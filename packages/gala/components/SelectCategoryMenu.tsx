import { ListItemText, MenuItem, ListItemAvatar, Menu } from '@mui/material';
import GenderAvatar from './GenderAvatar';
import { useSyncedStore } from '@syncedstore/react';
import { store } from '../lib/store';
import { CategorySelectorValue } from './CategorySelector';

export default function SelectCategoryMenu({
  anchorElement,
  onClose,
  onSelect,
  allowNone,
  allowAll,
}: {
  anchorElement: HTMLElement | null;
  onClose: () => void;
  onSelect: (value: CategorySelectorValue) => void;
  allowNone?: boolean;
  allowAll?: boolean;
}) {
  const { categories } = useSyncedStore(store);

  return (
    <Menu
      open={Boolean(anchorElement)}
      onClose={onClose}
      anchorEl={anchorElement}
    >
      {allowAll && (
        <MenuItem onClick={() => onSelect({ type: 'all' })}>
          <ListItemText>Toutes les catégories</ListItemText>
        </MenuItem>
      )}

      {allowNone && (
        <MenuItem onClick={() => onSelect({ type: 'none' })}>
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
              onClick={() => onSelect({ type: 'category', categoryKey })}
            >
              <ListItemAvatar>
                <GenderAvatar gender={category.gender} />
              </ListItemAvatar>
              <ListItemText>{category.name}</ListItemText>
            </MenuItem>
          )
      )}
    </Menu>
  );
}
