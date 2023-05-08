import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  TextField,
  DialogActions,
  Button,
  Select,
  FormLabel,
  Stack,
} from '@mui/material';
import { useEffect, useState } from 'react';
import { Category } from '../lib/database';
import GenderSelector from './GenderSelector';

export default function EditCategoryDialog({
  open,
  onCancel,
  onValidate,
  category,
}: {
  open: boolean;
  onCancel: () => void;
  onValidate: (category: Category) => void;
  category: Category;
}) {
  const [editedCategory, setEditedCategory] = useState(category);

  useEffect(() => {
    setEditedCategory(category);
  }, [category]);

  return (
    <Dialog open={open} onClose={onCancel}>
      <DialogTitle>Modifier une catégorie</DialogTitle>
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
            value={editedCategory.name}
            onChange={(event) =>
              setEditedCategory({ ...editedCategory, name: event.target.value })
            }
          />
          <Stack
            direction="row"
            spacing={2}
            justifyContent="space-between"
            alignItems="center"
          >
            <FormLabel>Genre</FormLabel>
            <GenderSelector
              gender={editedCategory.gender}
              onChange={(gender) =>
                setEditedCategory({ ...editedCategory, gender })
              }
            />
          </Stack>

          <Select>{/* TODO: Category apparatuses */}</Select>
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onCancel}>Annuler</Button>
        <Button onClick={() => onValidate(editedCategory)}>Valider</Button>
      </DialogActions>
    </Dialog>
  );
}
