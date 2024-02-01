import {
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  DialogActions,
  Button,
  Stack,
  Box,
} from '@mui/material';
import { useCallback } from 'react';
import CategorySelector, {
  categoryKeyToCategorySelectorValue,
} from './CategorySelector';
import { addPlayer } from '../lib/player';
import EditPlayerButton from './EditPlayerButton';
import AddPlayerButton from './AddPlayerButton';
import { useCompetition } from './StoreProvider';
import { Team } from '@tgym.fr/core';
import AddCategoryButton from './AddCategoryButton';

export default function EditTeamDialog({
  open,
  team,
  onClose,
}: {
  open: boolean;
  team: Team;
  onClose: () => void;
}) {
  const { players, categories } = useCompetition();

  const importFromClipboard = useCallback(() => {
    navigator.clipboard.readText().then((text) => {
      if (team.categoryKey === undefined) {
        return;
      }

      // When copied from the PDF, names are on multiple lines but some may be
      // on the same line, separated by a space.  It then is not rtvial to find
      // first name and last name because last name can be multiple words and
      // sometime first name is in uppercase as well.

      const category = categories[team.categoryKey];

      if (category === undefined) {
        return;
      }

      const gender = category.gender;
      const words = text.split(/[\n ]+/);

      while (words.length > 0) {
        const firstName = words.shift();
        let lastName = words.shift();

        if (firstName !== undefined && lastName !== undefined) {
          while (words.length > 0 && words[0] === words[0].toUpperCase()) {
            lastName += ' ' + words.shift();
          }

          team.members[addPlayer(players, { firstName, lastName, gender })] =
            true;
        }
      }
    });
  }, [categories, team, players]);

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Modifier une équipe</DialogTitle>
      <DialogContent>
        <Stack direction="column" spacing={2}>
          <TextField
            autoFocus
            margin="dense"
            label="Nom"
            type="text"
            fullWidth
            variant="standard"
            value={team.name}
            onChange={(event) => (team.name = event.target.value)}
          />
          <TextField
            margin="dense"
            label="Numéro"
            type="text"
            fullWidth
            variant="standard"
            value={team.label ?? ""}
            onChange={(event) => (team.label = event.target.value ? event.target.value : undefined)}
          />
          <Stack direction="row" gap={2}>
            <Box width={300}>
              <CategorySelector
                allowNone
                value={categoryKeyToCategorySelectorValue(team.categoryKey)}
                onChange={(value) => {
                  if (value.type === 'category') {
                    team.categoryKey = value.categoryKey;
                  } else {
                    team.categoryKey = undefined;
                  }
                }}
              />
            </Box>
            <AddCategoryButton
              onAddCategory={(categoryKey) => {
                team.categoryKey = categoryKey;
              }}
            />
          </Stack>
          <Stack direction="row" gap={1} flexWrap="wrap">
            {Object.keys(team.members).map((playerKey) => {
              const player = players[playerKey];

              return (
                player !== undefined && (
                  <EditPlayerButton
                    key={playerKey}
                    player={player}
                    onDelete={() => {
                      delete team.members[playerKey];
                      delete players[playerKey];
                    }}
                  />
                )
              );
            })}
            <AddPlayerButton team={team} />
          </Stack>
          <Button variant="contained" onClick={() => importFromClipboard()}>
            Importer les joueurs du presse papier
          </Button>
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Fermer</Button>
      </DialogActions>
    </Dialog>
  );
}
