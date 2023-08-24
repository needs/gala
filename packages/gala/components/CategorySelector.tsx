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
import { z } from "zod";

const categorySelectorValueSchema = z.union([
  z.object({
    type: z.literal('all'),
  }),
  z.object({
    type: z.literal('category'),
    categoryKey: z.string(),
  }),
  z.object({
    type: z.literal('none'),
  }),
]);

export type CategorySelectorValue = z.infer<typeof categorySelectorValueSchema>;

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
        value={JSON.stringify(value)}
        label="Catégorie"
        renderValue={(valueString) => {
          const value = categorySelectorValueSchema.parse(JSON.parse(valueString));

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
          if (typeof event.target.value === 'string') {
            onChange(categorySelectorValueSchema.parse(JSON.parse(event.target.value)));
          } else {
            onChange(event.target.value);
          }
        }}
      >
        {allowAll && (
          <MenuItem value={JSON.stringify({ type: 'all' })}>
            <ListItemText>Toutes les catégories</ListItemText>
          </MenuItem>
        )}
        {allowNone && (
          <MenuItem value={JSON.stringify({ type: 'none' })} selected={true}>
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
                value={JSON.stringify({ type: 'category', categoryKey })}
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
