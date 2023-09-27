import { withAuthCompetition } from '../../../lib/auth';
import {
  getScreenName,
  useCompetition,
  Screen,
  getDefaultScreen,
} from '../../../lib/store';
import { Chip, Snackbar, Stack, Typography } from '@mui/material';
import { Add } from '@mui/icons-material';
import TvFrame from '../../../components/TvFrame';
import EditScreenDialog, {
  getScreenIcon,
} from '../../../components/EditScreenDialog';
import { useState } from 'react';
import { boxed } from '@syncedstore/core';
import { v4 as uuidv4 } from 'uuid';
import { trpc } from '../../../utils/trpc';

function EditScreenButton({
  screen,
  onChange,
}: {
  screen: Screen;
  onChange: (screen: Screen) => void;
}) {
  const [openDialog, setOpenDialog] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);

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
          <Chip
            label="Activé"
            variant="outlined"
            color="success"
            size="small"
            sx={{
              '& .MuiChip-label': {
                marginX: 'auto',
              },
              marginLeft: 'auto',
            }}
          />

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
            label={`${location.host}/${screen.shortUrlId}`}
            size="small"
            sx={{
              '& .MuiChip-label': {
                marginX: 'auto',
              },
              width: '100%',
            }}
            onClick={() => {
              navigator.clipboard.writeText(
                `${location.origin}/${screen.shortUrlId}`
              );
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

export default function ScreensPage({ competitionUuid }: { competitionUuid: string }) {
  const { screens } = useCompetition();
  const toShortId = trpc.toShortId.useMutation();

  return (
    <Stack
      direction="row"
      padding={4}
      gap={4}
      flexWrap="wrap"
      justifyContent="space-evenly"
    >
      {Object.entries(screens).map(([screenKey, screen]) => (
        <EditScreenButton
          key={screenKey}
          screen={screen.value}
          onChange={(screen) => (screens[screenKey] = boxed(screen))}
        />
      ))}
      <CreateScreenButton
        onCreate={async (screen) => {
          const screenUuid = uuidv4();
          const shortId = await toShortId.mutateAsync({
            uuid: competitionUuid,
            screenUuid,
          });

          screens[screenUuid] = boxed({
            ...screen,
            shortUrlId: shortId,
          });
        }}
      />
    </Stack>
  );
}

export const getServerSideProps = withAuthCompetition('screens');
