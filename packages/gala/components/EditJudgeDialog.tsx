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
import { Judge } from '../lib/database';

export default function EditJudgeDialog({
  open,
  onCancel,
  onValidate,
  judge,
}: {
  open: boolean;
  onCancel: () => void;
  onValidate: (judge: Judge) => void;
  judge: Judge;
}) {
  const [editedJudge, setEditedJudge] = useState(judge);

  useEffect(() => {
    setEditedJudge(judge);
  }, [judge]);

  return (
    <Dialog open={open} onClose={onCancel}>
      <DialogTitle>Modifier un juge</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Les modifications seront appliquées seulement une fois validées.
        </DialogContentText>
        <Stack direction="column" spacing={2}>
          <TextField
            autoFocus
            margin="dense"
            label="Prénom"
            type="text"
            fullWidth
            variant="standard"
            value={editedJudge.firstName}
            onChange={(event) =>
              setEditedJudge({
                ...editedJudge,
                firstName: event.target.value,
              })
            }
          />
          <TextField
            margin="dense"
            label="Nom"
            type="text"
            fullWidth
            variant="standard"
            value={editedJudge.lastName}
            onChange={(event) =>
              setEditedJudge({ ...editedJudge, lastName: event.target.value })
            }
          />
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onCancel}>Annuler</Button>
        <Button onClick={() => onValidate(editedJudge)}>Valider</Button>
      </DialogActions>
    </Dialog>
  );
}
