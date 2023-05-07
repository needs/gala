import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  TextField,
  DialogActions,
  Button,
  Select,
} from '@mui/material';
import { useEffect, useState } from 'react';
import { Team, categoriesSchema, database, useDatabaseValue } from '../lib/database';
import { ref } from 'firebase/database';

const categoriesRef = ref(database, 'categories');

export default function EditTeamDialog({
  open,
  onCancel,
  onValidate,
  team: team,
}: {
  open: boolean;
  onCancel: () => void;
  onValidate: (player: Team) => void;
  team: Team;
}) {
  const [editedTeam, setEditedTeam] = useState(team);

  const categories = useDatabaseValue(categoriesRef, categoriesSchema);

  useEffect(() => {
    setEditedTeam(team);
  }, [team])

  return (
    <Dialog open={open} onClose={onCancel}>
      <DialogTitle>Modifier une équipe</DialogTitle>
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
          value={editedTeam.name}
          onChange={(event) =>
            setEditedTeam({ ...editedTeam, name: event.target.value })
          }
        />
        <Select>
          {/* TODO: Category selection */}
        </Select>
      </DialogContent>
      <DialogActions>
        <Button onClick={onCancel}>Annuler</Button>
        <Button onClick={() => onValidate(editedTeam)}>Valider</Button>
      </DialogActions>
    </Dialog>
  );
}
