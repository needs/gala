import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  TextField,
  DialogActions,
  Button,
} from '@mui/material';
import { useEffect, useState } from 'react';
import { Player } from '../lib/database';

export default function EditPlayerDialog({
  open,
  onCancel,
  onValidate,
  player,
}: {
  open: boolean;
  onCancel: () => void;
  onValidate: (player: Player) => void;
  player: Player;
}) {
  const [editedPlayer, setEditedPlayer] = useState(player);

  useEffect(() => {
    setEditedPlayer(player);
  }, [player])

  return (
    <Dialog open={open} onClose={onCancel}>
      <DialogTitle>Modifier un joueur</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Les modifications seront appliquées seulement une fois validées.
        </DialogContentText>
        <TextField
          autoFocus
          margin="dense"
          label="Nom"
          type="text"
          fullWidth
          variant="standard"
          value={editedPlayer.firstName}
          onChange={(event) =>
            setEditedPlayer({ ...editedPlayer, firstName: event.target.value })
          }
        />
        <TextField
          margin="dense"
          label="Prénom"
          type="text"
          fullWidth
          variant="standard"
          value={editedPlayer.lastName}
          onChange={(event) =>
            setEditedPlayer({ ...editedPlayer, lastName: event.target.value })
          }
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onCancel}>Annuler</Button>
        <Button onClick={() => onValidate(editedPlayer)}>Valider</Button>
      </DialogActions>
    </Dialog>
  );
}
