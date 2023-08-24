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

export type CategorySelectorValue =
  | {
      type: 'all';
    }
  | {
      type: 'category';
      categoryKey: string;
    }
  | {
      type: 'none';
    };

export const categoryKeyToCategorySelectorValue = (
  categoryKey: string | undefined
): CategorySelectorValue => {
  if (categoryKey === undefined) {
    return { type: 'none' };
  } else {
    return { type: 'category', categoryKey };
  }
};

export default function CategorySelector({
  value,
  onChange,
  allowAll,
  allowNone,
}: {
  value: CategorySelectorValue;
  onChange: (value: CategorySelectorValue) => void;
  allowAll?: boolean;
  allowNone?: boolean;
}) {
  const { categories } = useSyncedStore(store);

  return (
    <FormControl size="small" fullWidth>
      <InputLabel id="demo-simple-select-label">Catégorie</InputLabel>
      <Select
        labelId="demo-simple-select-label"
        id="demo-simple-select"
        value={value}
        label="Catégorie"
        renderValue={(value) => {
          if (value.type === 'all') {
            return <em>Selectionner une catégorie</em>;
          } else if (value.type === 'none') {
            return (
              <Stack direction="row" spacing={2} alignItems="center">
                <GenderAvatar size={24} />
                <ListItemText sx={{ fontStyle: 'italic' }}>
                  Sans catégorie
                </ListItemText>
              </Stack>
            );
          } else {
            const category = categories[value.categoryKey];
            return (
              category !== undefined && (
                <Stack direction="row" spacing={2} alignItems="center">
                  <GenderAvatar gender={category.gender} size={24} />
                  <ListItemText>{category.name}</ListItemText>
                </Stack>
              )
            );
          }
        }}
        onChange={(event) => {
          if (typeof event.target.value === 'string') return;
          onChange(event.target.value);
        }}
      >
        {allowAll && (
          <MenuItem value={{ type: 'all' } as any}>
            <ListItemText>Toutes les catégories</ListItemText>
          </MenuItem>
        )}
        {allowNone && (
          <MenuItem value={{ type: 'none' } as any}>
            <ListItemAvatar>
              <GenderAvatar />
            </ListItemAvatar>
            <ListItemText sx={{ fontStyle: 'italic' }}>
              Sans catégorie
            </ListItemText>
          </MenuItem>
        )}
        {Object.entries(categories).map(
          ([categoryKey, category]) =>
            category !== undefined && (
              <MenuItem
                key={categoryKey}
                value={{ type: 'category', categoryKey } as any}
              >
                <ListItemAvatar>
                  <GenderAvatar gender={category.gender} />
                </ListItemAvatar>
                <ListItemText>{category.name}</ListItemText>
              </MenuItem>
            )
        )}
      </Select>
    </FormControl>
  );
}
