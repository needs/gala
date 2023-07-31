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
import { useSyncedStore } from '@syncedstore/react';
import { store } from '../lib/store';

export default function CategorySelector({
  categoryKey,
  onChange,
  allowAll,
}: {
  categoryKey: string | undefined;
  onChange: (categoryKey: string) => void;
  allowAll?: boolean;
}) {
  const categories = useSyncedStore(store.categories);

  return (
    <FormControl size="small" fullWidth>
      <InputLabel id="demo-simple-select-label">Catégorie</InputLabel>
      <Select
        labelId="demo-simple-select-label"
        id="demo-simple-select"
        value={categoryKey ?? ""}
        label="Catégorie"
        renderValue={(categoryKey) => {
          if (categoryKey === undefined) {
            return <em>Selectionner une catégorie</em>;
          } else {
            const category = categories[categoryKey];
            return category !== undefined && (
              <Stack direction="row" spacing={2} alignItems="center">
                <GenderAvatar gender={category.gender} size={24}/>
                <ListItemText>{category.name}</ListItemText>
              </Stack>
            );
          }
        }}
        onChange={(event) => onChange(event.target.value)}
      >
        {allowAll && (
          <MenuItem value="">
            <ListItemText>Toutes les catégories</ListItemText>
          </MenuItem>
        )}
        {Object.entries(categories).map(([categoryKey, category]) => category !== undefined && (
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
