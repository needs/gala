import { withCompetition } from '../../../lib/auth';
import { getScreenName, getDefaultScreen } from '../../../lib/store';
import {
  Chip,
  IconButton,
  Snackbar,
  Stack,
  Tooltip,
  Typography,
} from '@mui/material';
import { Add, Close } from '@mui/icons-material';
import TvFrame from '../../../components/TvFrame';
import EditScreenDialog, {
  getScreenIcon,
} from '../../../components/EditScreenDialog';
import { useState } from 'react';
import { boxed } from '@syncedstore/core';
import { v4 as uuidv4 } from 'uuid';
import { trpc } from '../../../utils/trpc';
import { Screen } from '@tgym.fr/core';
import { useCompetition } from '../../../components/StoreProvider';
import { Role } from '@prisma/client';

function getScreenUrl(
  competitionUuid: string,
  screenUuid: string,
  shortUrlId: string | undefined
) {
  if (shortUrlId !== undefined) {
    return `${location.origin}/${shortUrlId}`;
  } else {
    return `${location.origin}/competition/${competitionUuid}/screen/${screenUuid}`;
  }
}

function EditScreenButton({
  screen,
  competitionUuid,
  screenUuid,
  onChange,
  onDelete,
}: {
  screen: Screen;
  competitionUuid: string;
  screenUuid: string;
  onChange: (screen: Screen) => void;
  onDelete: () => void;
}) {
  const [openDialog, setOpenDialog] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);

  const screenUrl = getScreenUrl(
    competitionUuid,
    screenUuid,
    screen.shortUrlId
  );

  return (
    <>
      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={() => setOpenSnackbar(false)}
        message="URL copiée... Collez là dans un navigateur internet (Chrome, Firefox...)"
      />
      <EditScreenDialog
        screen={screen}
        open={openDialog}
        onCancel={() => setOpenDialog(false)}
        onValidate={(screen) => {
          onChange(screen);
          setOpenDialog(false);
        }}
      />
      <TvFrame height={200} width={300}>
        <Stack
          height="100%"
          sx={{
            backgroundImage: 'url("/tv-background.svg")',
            backgroundRepeat: 'no-repeat',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            cursor: 'pointer',
          }}
          padding={1}
        >
          <Stack
            direction="row"
            gap={1}
            justifyContent="space-between"
            alignItems="center"
          >
            <Chip
              label="Activé"
              variant="outlined"
              color="success"
              size="small"
              sx={{
                '& .MuiChip-label': {
                  marginX: 'auto',
                },
              }}
            />
            <Tooltip title="Double cliquez pour supprimer">
              <IconButton
                size="small"
                color="error"
                onDoubleClick={() => onDelete()}
              >
                <Close fontSize="inherit" />
              </IconButton>
            </Tooltip>
          </Stack>

          <Stack
            direction="row"
            gap={2}
            alignItems="center"
            justifyContent="center"
            onClick={() => setOpenDialog(true)}
            flexGrow="1"
          >
            {getScreenIcon(screen.type, 'large')}
            <Stack direction="column">
              <Typography variant="body1">
                {screen.name || 'Sans nom'}
              </Typography>
              <Typography variant="caption">
                {getScreenName(screen.type)}
              </Typography>
            </Stack>
          </Stack>
          <Chip
            label={screen.shortUrlId === undefined ? "Copier l'URL" : screenUrl}
            size="small"
            sx={{
              '& .MuiChip-label': {
                marginX: 'auto',
              },
              width: '100%',
            }}
            onClick={() => {
              navigator.clipboard.writeText(screenUrl);
              setOpenSnackbar(true);
            }}
          />
        </Stack>
      </TvFrame>
    </>
  );
}

function CreateScreenButton({
  onCreate,
}: {
  onCreate: (screen: Screen) => void;
}) {
  const [open, setOpen] = useState(false);
  const [screen, setScreen] = useState<Screen>({
    ...getDefaultScreen('bar'),
    name: 'Nouvel écran',
  });

  return (
    <>
      <EditScreenDialog
        screen={screen}
        open={open}
        onCancel={() => setOpen(false)}
        onValidate={(screen) => {
          onCreate(screen);
          setOpen(false);
        }}
      />
      <Stack
        height={200}
        width={300}
        sx={{
          borderRadius: 2,
          borderStyle: 'dashed',
          borderWidth: 4,
          borderColor: 'grey.300',
          bgcolor: 'grey.100',
          color: 'grey.600',
          cursor: 'pointer',
        }}
        justifyContent="center"
        alignItems="center"
        onClick={() => {
          setScreen({
            ...getDefaultScreen('bar'),
            name: 'Nouvel écran',
          });
          setOpen(true);
        }}
      >
        <Add fontSize="large" />
        <Typography variant="h5" component="span">
          Ajouter un écran
        </Typography>
      </Stack>
    </>
  );
}

export default function ScreensPage({
  competitionUuid,
}: {
  competitionUuid: string;
}) {
  const { screens } = useCompetition();
  const { data: user } = trpc.user.useQuery({ competitionUuid });
  const toShortId = trpc.toShortId.useMutation();

  return (
    <Stack
      direction="row"
      padding={4}
      gap={4}
      flexWrap="wrap"
      justifyContent="space-evenly"
    >
      {Object.entries(screens).map(([screenUuid, screen]) => (
        <EditScreenButton
          key={screenUuid}
          screen={screen.value}
          competitionUuid={competitionUuid}
          screenUuid={screenUuid}
          onChange={(screen) => (screens[screenUuid] = boxed(screen))}
          onDelete={() => delete screens[screenUuid]}
        />
      ))}
      {user !== undefined && (
        <CreateScreenButton
          onCreate={async (screen) => {
            const screenUuid = uuidv4();

            const shortId =
              user.role === Role.READER
                ? undefined
                : await toShortId.mutateAsync({
                    uuid: competitionUuid,
                    screenUuid,
                  });

            screens[screenUuid] = boxed({
              ...screen,
              shortUrlId: shortId,
            });
          }}
        />
      )}
    </Stack>
  );
}

export const getServerSideProps = withCompetition('screens');
