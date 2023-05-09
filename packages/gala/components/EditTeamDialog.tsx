import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  TextField,
  DialogActions,
  Button,
  Stack,
} from '@mui/material';
import { useEffect, useState } from 'react';
import {
  Team,
} from '../lib/database';
import CategorySelector from './CategorySelector';

export default function EditTeamDialog({
  open,
  onCancel,
  onValidate,
  team,
}: {
  open: boolean;
  onCancel: () => void;
  onValidate: (player: Team) => void;
  team: Team;
}) {
  const [editedTeam, setEditedTeam] = useState(team);

  useEffect(() => {
    setEditedTeam(team);
  }, [team]);

  return (
    <Dialog open={open} onClose={onCancel}>
      <DialogTitle>Modifier une équipe</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Les modifications seront appliquées seulement une fois validées.
        </DialogContentText>
        <Stack direction="column" spacing={2}>
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
          <CategorySelector
            categoryKey={editedTeam.category}
            onChange={(categoryKey) =>
              setEditedTeam({ ...editedTeam, category: categoryKey })
            }
          />
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onCancel}>Annuler</Button>
        <Button onClick={() => onValidate(editedTeam)}>Valider</Button>
      </DialogActions>
    </Dialog>
  );
}
