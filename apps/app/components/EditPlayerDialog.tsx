import {
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  DialogActions,
  Button,
  FormLabel,
  Stack,
} from '@mui/material';
import GenderSelector from './GenderSelector';
import { Player } from '@tgym.fr/core';

export default function EditPlayerDialog({
  open,
  onClose,
  player,
}: {
  open: boolean;
  onClose: () => void;
  player: Player;
}) {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Modifier un joueur</DialogTitle>
      <DialogContent>
        <Stack direction="column" spacing={2}>
          <TextField
            autoFocus
            margin="dense"
            label="Prénom"
            type="text"
            fullWidth
            variant="standard"
            value={player.firstName}
            onChange={(event) => (player.firstName = event.target.value)}
          />
          <TextField
            margin="dense"
            label="Nom"
            type="text"
            fullWidth
            variant="standard"
            value={player.lastName}
            onChange={(event) => (player.lastName = event.target.value)}
          />
          <Stack
            direction="row"
            spacing={2}
            justifyContent="space-between"
            alignItems="center"
          >
            <FormLabel>Genre</FormLabel>
            <GenderSelector
              gender={player.gender}
              onChange={(gender) => (player.gender = gender)}
            />
          </Stack>
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Fermer</Button>
      </DialogActions>
    </Dialog>
  );
}
