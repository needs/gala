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
import {
  Team,
  categoriesSchema,
  database,
  playersSchema,
  useDatabaseValue,
} from '../lib/database';
import CategorySelector from './CategorySelector';
import { ref } from 'firebase/database';
import { addPlayer, deletePlayer, updatePlayer } from '../lib/player';
import EditPlayerButton from './EditPlayerButton';
import Loading from './Loading';
import AddPlayerButton from './AddPlayerButton';
import { produce } from 'immer';

const playersRef = ref(database, 'players');
const categoriesRef = ref(database, 'categories');

export default function EditTeamDialog({
  open,
  team,
  onChange,
  onClose,
}: {
  open: boolean;
  team: Team;
  onClose: () => void;
  onChange: (player: Team) => void;
}) {
  const players = useDatabaseValue(playersRef, playersSchema);
  const categories = useDatabaseValue(categoriesRef, categoriesSchema);

  const importFromClipboard = useCallback(() => {
    navigator.clipboard.readText().then((text) => {
      if (categories === undefined || team.category === undefined) {
        return;
      }

      // When copied from the PDF, names are on multiple lines but some may be
      // on the same line, separated by a space.  It then is not rtvial to find
      // first name and last name because last name can be multiple words and
      // sometime first name is in uppercase as well.

      const gender = categories[team.category].gender;
      const words = text.split(/[\n ]+/);
      const playersKey: string[] = [];

      while (words.length > 0) {
        const firstName = words.shift();
        let lastName = words.shift();

        if (firstName !== undefined && lastName !== undefined) {
          while (words.length > 0 && words[0] === words[0].toUpperCase()) {
            lastName += ' ' + words.shift();
          }

          playersKey.push(addPlayer({ firstName, lastName, gender }));
        }
      }

      onChange(
        produce(team, (draft) => {
          for (const playerKey of playersKey) {
            draft.members[playerKey] = true;
          }
        })
      );
    });
  }, [categories, team, onChange]);

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
              onChange(
                produce(team, (draft) => {
                  draft.name = event.target.value;
                })
              )
            }
          />
          <CategorySelector
            categoryKey={team.category}
            onChange={(categoryKey) =>
              onChange(
                produce(team, (draft) => {
                  draft.category = categoryKey;
                })
              )
            }
          />
          <Stack direction="row" gap={1} flexWrap="wrap">
            {Object.keys(team.members).map(
              (playerKey) =>
                playerKey in players && (
                  <EditPlayerButton
                    key={playerKey}
                    player={players[playerKey]}
                    onChange={(player) => updatePlayer(playerKey, player)}
                    onDelete={() => {
                      onChange(
                        produce(team, (draft) => {
                          delete draft.members[playerKey];
                        })
                      );
                      deletePlayer(playerKey);
                    }}
                  />
                )
            )}
            <AddPlayerButton
              onAdd={(player) => {
                onChange(
                  produce(team, (draft) => {
                    draft.members[addPlayer(player)] = true;
                  })
                );
              }}
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
