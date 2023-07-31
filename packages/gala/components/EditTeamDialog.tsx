import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  TextField,
  DialogActions,
  Button,
  Stack,
} from '@mui/material';
import { useCallback } from 'react';
import CategorySelector from './CategorySelector';
import { addPlayer } from '../lib/player';
import EditPlayerButton from './EditPlayerButton';
import Loading from './Loading';
import AddPlayerButton from './AddPlayerButton';
import { Team, store } from '../lib/store';
import { useSyncedStore } from '@syncedstore/react';

export default function EditTeamDialog({
  open,
  team,
  onClose,
}: {
  open: boolean;
  team: Team;
  onClose: () => void;
}) {
  const { players, categories } = useSyncedStore(store);

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

          team.members[(addPlayer(players, { firstName, lastName, gender }))] = true;
        }
      }
    });
  }, [categories, team, players]);

  if (players === undefined || categories === undefined) {
    return <Loading />;
  }

  return (
    <Dialog open={open} onClose={onClose}>
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
            value={team.name}
            onChange={(event) =>
              team.name = event.target.value
            }
          />
          <CategorySelector
            categoryKey={team.categoryKey}
            onChange={(categoryKey) =>
              team.categoryKey = categoryKey
            }
          />
          <Stack direction="row" gap={1} flexWrap="wrap">
            {Object.keys(team.members).map(
              (playerKey) => {
                const player = players[playerKey];

                return player !== undefined &&  (
                  <EditPlayerButton
                    key={playerKey}
                    player={player}
                    onDelete={() => {
                      delete team.members[playerKey];
                      delete players[playerKey];
                    }}
                  />
                )}
            )}
            <AddPlayerButton
              team={team}
            />
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
