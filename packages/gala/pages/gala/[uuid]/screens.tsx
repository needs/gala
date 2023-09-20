import { withAuthGala } from '../../../lib/auth';
import {
  getScreenName,
  useGala,
  Screen,
  getDefaultScreen,
} from '../../../lib/store';
import { Stack, Typography } from '@mui/material';
import { Add, SportsBar } from '@mui/icons-material';
import { nanoid } from 'nanoid';
import TvFrame from '../../../components/TvFrame';
import EditScreenDialog from '../../../components/EditScreenDialog';
import { useState } from 'react';
import { boxed } from '@syncedstore/core';

function EditScreenButton({
  screen,
  onChange,
}: {
  screen: Screen;
  onChange: (screen: Screen) => void;
}) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <EditScreenDialog
        screen={screen}
        open={open}
        onCancel={() => setOpen(false)}
        onValidate={(screen) => {
          onChange(screen);
          setOpen(false);
        }}
      />
      <TvFrame height={200} width={300}>
        <Stack
          direction="row"
          gap={2}
          alignItems="center"
          justifyContent="center"
          height="100%"
          bgcolor="white"
          sx={{
            backgroundImage: 'url("/tv-background.svg")',
            backgroundRepeat: 'no-repeat',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            cursor: 'pointer',
          }}
          onClick={() => setOpen(true)}
        >
          <SportsBar fontSize="large" />
          <Stack direction="column">
            <Typography variant="body1">{screen.name || 'Sans nom'}</Typography>
            <Typography variant="caption">
              {getScreenName(screen.type)}
            </Typography>
          </Stack>
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
    name: 'Nouvel écran',
    ...getDefaultScreen('bar'),
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
            name: 'Nouvel écran',
            ...getDefaultScreen('bar'),
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

export default function ScreensPage() {
  const { screens } = useGala();

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
        onCreate={(screen) => {
          screens[nanoid()] = boxed(screen);
        }}
      />
    </Stack>
  );
}

export const getServerSideProps = withAuthGala('screens');
