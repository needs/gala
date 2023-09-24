import {
  Badge,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Stack,
  List,
  ListItemAvatar,
  ListItemText,
  ListItemButton,
  FormControl,
  InputLabel,
  InputAdornment,
  IconButton,
  Input,
} from '@mui/material';
import { useState } from 'react';
import { CategorySelectorValue } from './CategorySelector';
import { useCompetition } from '../lib/store';
import GenderAvatar from './GenderAvatar';
import { FilterList } from '@mui/icons-material';
import SelectCategoryMenu from './SelectCategoryMenu';

export default function SelectTeamDialog({
  open,
  onSelect,
  onClose,
}: {
  open: boolean;
  onSelect: (teamKey: string) => void;
  onClose: () => void;
}) {
  const { teams, categories } = useCompetition();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] =
    useState<CategorySelectorValue>({ type: 'all' });

  const filteredTeams = Object.entries(teams).filter(([teamKey, team]) => {
    if (team === undefined) {
      return false;
    }

    if (selectedCategory.type === 'category') {
      if (team.categoryKey !== selectedCategory.categoryKey) {
        return false;
      }
    } else if (selectedCategory.type === 'none') {
      if (team.categoryKey !== undefined) {
        return false;
      }
    }

    if (searchQuery !== '') {
      const lowerCaseSearchQuery = searchQuery.toLowerCase();

      if (team.categoryKey !== undefined) {
        const category = categories[team.categoryKey];
        if (
          category !== undefined &&
          category.name.toLowerCase().includes(lowerCaseSearchQuery)
        ) {
          return true;
        }
      }

      if (team.name.toLowerCase().includes(lowerCaseSearchQuery)) {
        return true;
      }

      return false;
    }

    return true;
  });

  const [anchorMenu, setAnchorMenu] = useState<null | HTMLElement>(null);

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Selectionner une équipe</DialogTitle>
      <DialogContent>
        <Stack direction="column" spacing={2}>
          <Stack direction="column" gap={2} alignItems="center">
            <FormControl fullWidth variant="standard">
              <InputLabel>Recherche</InputLabel>
              <Input
                autoFocus
                margin="dense"
                type="text"
                fullWidth
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton
                      edge="end"
                      onClick={(event) => {
                        setAnchorMenu(event.currentTarget);
                      }}
                    >
                      <Badge
                        invisible={selectedCategory.type === 'all'}
                        variant="dot"
                        color="primary"
                      >
                        <FilterList />
                      </Badge>
                    </IconButton>
                    <SelectCategoryMenu
                      allowNone
                      allowAll
                      anchorElement={anchorMenu}
                      onClose={() => setAnchorMenu(null)}
                      onSelect={(category) => {
                        setSelectedCategory(category);
                        setAnchorMenu(null);
                      }}
                    />
                  </InputAdornment>
                }
              />
            </FormControl>
          </Stack>

          <List
            sx={{
              width: 360,
              height: 300,
              bgcolor: 'background.paper',
              overflowY: 'auto',
            }}
            dense
            disablePadding
          >
            {filteredTeams.map(([teamKey, team]) => {
              if (team === undefined) {
                return null;
              }

              const category =
                team.categoryKey !== undefined
                  ? categories[team.categoryKey]
                  : undefined;

              return (
                <ListItemButton key={teamKey} onClick={() => onSelect(teamKey)}>
                  <ListItemAvatar>
                    <GenderAvatar size={40} gender={category?.gender} />
                  </ListItemAvatar>
                  <ListItemText
                    primary={team.name}
                    secondary={category?.name ?? 'Sans catégorie'}
                  />
                </ListItemButton>
              );
            })}
          </List>
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Fermer</Button>
      </DialogActions>
    </Dialog>
  );
}
