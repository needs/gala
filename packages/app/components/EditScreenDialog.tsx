import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  TextField,
  DialogActions,
  Button,
  Stack,
  Select,
  FormControl,
  InputLabel,
  ListItemText,
  MenuItem,
  ListItemIcon,
} from '@mui/material';
import {
  Screen,
  ScreenBar,
  ScreenProgress,
  getDefaultScreen,
  getScreenName,
  screenTypes,
  useGala,
} from '../lib/store';
import { Schedule, SportsBar } from '@mui/icons-material';
import { cloneDeep } from 'lodash';
import { useState } from 'react';

export function getScreenIcon(
  screenType: Screen['type'],
  size: 'small' | 'medium' | 'large'
) {
  switch (screenType) {
    case 'bar':
      return <SportsBar fontSize={size} />;
    case 'progress':
      return <Schedule fontSize={size} />;
  }
}

function EditScreenProgress({
  screen,
  setScreen,
}: {
  screen: ScreenProgress;
  setScreen: (screen: ScreenProgress) => void;
}) {
  const { stages } = useGala();

  return (
    <FormControl sx={{ width: 300 }} variant="standard">
      <InputLabel>Plateau</InputLabel>
      <Select
        value={screen.stageKey}
        label="Plateau"
        onChange={(event) => {
          setScreen({ ...screen, stageKey: event.target.value as string });
        }}
        placeholder="Selectionner un plateau"
      >
        {Object.entries(stages).map(
          ([stageKey, stage]) =>
            stage !== undefined && (
              <MenuItem key={stageKey} value={stageKey}>
                {stage.name}
              </MenuItem>
            )
        )}
      </Select>
    </FormControl>
  );
}

function EditScreenBar({
  screen,
  setScreen,
}: {
  screen: ScreenBar;
  setScreen: (screen: ScreenBar) => void;
}) {
  return null;
}

export default function EditScreenDialog({
  open,
  screen: originalScreen,
  onCancel,
  onValidate,
}: {
  open: boolean;
  screen: Screen;
  onCancel: () => void;
  onValidate: (screen: Screen) => void;
}) {
  const [screen, setScreen] = useState<Screen>(() => cloneDeep(originalScreen));

  const renderScreenConfig = () => {
    switch (screen.type) {
      case 'progress':
        return (
          <EditScreenProgress
            screen={screen}
            setScreen={(screen) => setScreen(screen)}
          />
        );
      case 'bar':
        return (
          <EditScreenBar
            screen={screen}
            setScreen={(screen) => setScreen(screen)}
          />
        );
    }
  };

  return (
    <Dialog open={open}>
      <DialogTitle>Modifier un écran</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Les modifications seront appliquées seulement une fois validées.
        </DialogContentText>
        <Stack direction="column" gap={2}>
          <TextField
            margin="dense"
            label="Nom"
            type="text"
            fullWidth
            variant="standard"
            value={screen.name}
            onChange={(event) =>
              setScreen({ ...screen, name: event.target.value })
            }
          />
          <FormControl fullWidth variant="standard">
            <InputLabel>Affichage</InputLabel>
            <Select
              value={screen.type}
              label="Affichage"
              renderValue={(screenType) => {
                return (
                  <Stack direction="row" spacing={2} alignItems="center">
                    {getScreenIcon(screenType, 'large')}
                    <ListItemText>{getScreenName(screenType)}</ListItemText>
                  </Stack>
                );
              }}
              onChange={(event) => {
                setScreen({
                  ...screen,
                  ...getDefaultScreen(event.target.value as Screen['type']),
                });
              }}
            >
              {screenTypes.map((screenType) => (
                <MenuItem key={screenType} value={screenType}>
                  <ListItemIcon>
                    {getScreenIcon(screenType, 'medium')}
                  </ListItemIcon>
                  <ListItemText>{getScreenName(screenType)}</ListItemText>
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          {renderScreenConfig()}
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onCancel}>Annuler</Button>
        <Button onClick={() => onValidate(screen)}>Valider</Button>
      </DialogActions>
    </Dialog>
  );
}
