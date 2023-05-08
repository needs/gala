import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  TextField,
  DialogActions,
  Button,
  Select,
  FormControl,
  InputLabel,
  MenuItem,
  Stack,
  ListItemIcon,
  ListItemText,
  OutlinedInput,
  ListItemAvatar,
} from '@mui/material';
import { useEffect, useState } from 'react';
import {
  Team,
  categoriesSchema,
  database,
  useDatabaseValue,
} from '../lib/database';
import { ref } from 'firebase/database';
import GenderAvatar from './GenderAvatar';

const categoriesRef = ref(database, 'categories');

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

  const categories = useDatabaseValue(categoriesRef, categoriesSchema);

  useEffect(() => {
    setEditedTeam(team);
  }, [team]);

  if (categories === undefined) {
    return null;
  }

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
          <FormControl size="small" fullWidth>
            <InputLabel id="demo-simple-select-label">Catégorie</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={editedTeam.category}
              label="Catégorie"
              renderValue={(categoryKey) => {
                const category = categories[categoryKey];
                return (
                  <Stack direction="row" spacing={2} alignItems="center">
                    <GenderAvatar gender={category.gender} />
                    <ListItemText>{category.name}</ListItemText>
                  </Stack>
                );
              }}
              onChange={(event) =>
                setEditedTeam({ ...editedTeam, category: event.target.value })
              }
            >
              {Object.entries(categories).map(([categoryKey, category]) => (
                <MenuItem key={categoryKey} value={categoryKey}>
                  <ListItemAvatar>
                    <GenderAvatar gender={category.gender} />
                  </ListItemAvatar>
                  <ListItemText>{category.name}</ListItemText>
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onCancel}>Annuler</Button>
        <Button onClick={() => onValidate(editedTeam)}>Valider</Button>
      </DialogActions>
    </Dialog>
  );
}
