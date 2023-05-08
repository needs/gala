import {
  FormControl,
  InputLabel,
  Select,
  Stack,
  ListItemText,
  MenuItem,
  ListItemAvatar,
} from '@mui/material';
import GenderAvatar from './GenderAvatar';
import { ref } from 'firebase/database';
import { categoriesSchema, database, useDatabaseValue } from '../lib/database';

const categoriesRef = ref(database, 'categories');

export default function CategorySelector({
  categoryKey,
  onChange,
}: {
  categoryKey: string | undefined;
  onChange: (categoryKey: string) => void;
}) {
  const categories = useDatabaseValue(categoriesRef, categoriesSchema);

  if (categories === undefined) {
    return null;
  }

  return (
    <FormControl size="small" fullWidth>
      <InputLabel id="demo-simple-select-label">Catégorie</InputLabel>
      <Select
        labelId="demo-simple-select-label"
        id="demo-simple-select"
        value={categoryKey}
        label="Catégorie"
        renderValue={(categoryKey) => {
          if (categoryKey === undefined) {
            return <em>Selectionner une catégorie</em>;
          } else {
            const category = categories[categoryKey];
            return (
              <Stack direction="row" spacing={2} alignItems="center">
                <GenderAvatar gender={category.gender} />
                <ListItemText>{category.name}</ListItemText>
              </Stack>
            );
          }
        }}
        onChange={(event) => onChange(event.target.value)}
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
  );
}
