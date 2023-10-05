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
import { Category } from '../lib/store';
import GenderSelector from './GenderSelector';

export default function EditCategoryDialog({
  open,
  onClose,
  category,
}: {
  open: boolean;
  onClose: () => void;
  category: Category;
}) {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Modifier une catégorie</DialogTitle>
      <DialogContent>
        <Stack direction="column" spacing={2}>
          <TextField
            autoFocus
            margin="dense"
            label="Nom"
            type="text"
            fullWidth
            variant="standard"
            value={category.name}
            onChange={(event) => (category.name = event.target.value)}
          />
          <Stack
            direction="row"
            spacing={2}
            justifyContent="space-between"
            alignItems="center"
          >
            <FormLabel>Genre</FormLabel>
            <GenderSelector
              gender={category.gender}
              onChange={(gender) => (category.gender = gender)}
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
