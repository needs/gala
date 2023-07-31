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
import { Judge } from '../lib/database';

export default function EditJudgeDialog({
  open,
  onClose,
  judge,
}: {
  open: boolean;
  onClose: () => void;
  judge: Judge;
}) {
  return (
    <Dialog open={open} onClose={onClose}>
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
            value={judge.firstName}
            onChange={(event) =>
              judge.firstName = event.target.value
            }
          />
          <TextField
            margin="dense"
            label="Nom"
            type="text"
            fullWidth
            variant="standard"
            value={judge.lastName}
            onChange={(event) =>
              judge.lastName = event.target.value
            }
          />
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Fermer</Button>
      </DialogActions>
    </Dialog>
  );
}
