import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  TextField,
  DialogActions,
  Button,
  Select,
  ToggleButton,
  ToggleButtonGroup,
} from '@mui/material';
import { useEffect, useState } from 'react';
import { Category } from '../lib/database';
import { Group, Man, Woman } from '@mui/icons-material';

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
        <ToggleButtonGroup
          value={editedCategory.sex}
          exclusive
          onChange={(event, newSex: Category['sex']) =>
            setEditedCategory({ ...editedCategory, sex: newSex })
          }
        >
          <ToggleButton value="male">
            <Man sx={{ color: "lightblue"}}/>
          </ToggleButton>
          <ToggleButton value="female">
            <Woman sx={{ color: "pink"}}/>
          </ToggleButton>
          <ToggleButton value="mixed">
            <Group />
          </ToggleButton>
        </ToggleButtonGroup>
        <Select>{/* TODO: Category apparatuses */}</Select>
      </DialogContent>
      <DialogActions>
        <Button onClick={onCancel}>Annuler</Button>
        <Button onClick={() => onValidate(editedCategory)}>Valider</Button>
      </DialogActions>
    </Dialog>
  );
}
