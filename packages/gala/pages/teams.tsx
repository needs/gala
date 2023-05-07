import { ref, set, push, child } from 'firebase/database';
import {
  Player,
  database,
  playersSchema,
  teamsSchema,
  useDatabaseValue,
} from '../lib/database';
import {
  Button,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import { Add } from '@mui/icons-material';
import EditPlayerDialog from '../components/EditPlayerDialog';
import { useState } from 'react';

const teamsRef = ref(database, 'teams');
const playersRef = ref(database, 'players');

function PlayerButton({
  player,
  onChange,
}: {
  player: Player;
  onChange: (player: Player) => void;
}) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <EditPlayerDialog
        open={open}
        onCancel={() => setOpen(false)}
        onValidate={onChange}
        player={player}
      />
      <Button variant="text">{`${player.firstName} ${player.lastName}`}</Button>
    </>
  );
}

function AddPlayerButton({ onAdd }: { onAdd: (player: Player) => void }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <EditPlayerDialog
        open={open}
        onCancel={() => setOpen(false)}
        onValidate={(player) => {
          onAdd(player);
          setOpen(false);
        }}
        player={{
          firstName: '',
          lastName: '',
        }}
      />
      <Button onClick={() => setOpen(true)}>
        <Add />
      </Button>
    </>
  );
}

export function Teams() {
  const teams = useDatabaseValue(teamsRef, teamsSchema);
  const players = useDatabaseValue(playersRef, playersSchema);

  const addPlayer = (player: Player) => {
    const newPlayerKey = push(playersRef).key;

    if (newPlayerKey === null) {
      throw new Error('newPlayerKey is null');
    }

    set(child(playersRef, newPlayerKey), player);
    return newPlayerKey;
  };

  const updatePlayer = (playerKey: string, player: Player) => {
    set(child(playersRef, playerKey), player);
  };

  const addRandomTeam = () => {
    const newTeamKey = push(teamsRef).key;

    if (newTeamKey === null) {
      throw new Error('newTeamKey is null');
    }

    const newTeam = {
      name: 'Team ' + newTeamKey,
      members: {},
    };

    set(child(teamsRef, newTeamKey), newTeam);

    return newTeamKey;
  };

  const addMember = (teamKey: string, playerKey: string) => {
    const membersRef = ref(database, "teams/${teamKey}/members");
    set(child(membersRef, playerKey), true);
  };

  if (teams === undefined || players === undefined) {
    return <p>Loading...</p>;
  }

  return (
    <>
      <Stack padding={2} gap={2}>
        <Typography variant="h1">Équipes</Typography>
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell>Nom</TableCell>
                <TableCell>Joueurs</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {Object.entries(teams).map(([teamKey, team]) => (
                <TableRow
                  key={teamKey}
                  sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                >
                  <TableCell component="th" scope="row">
                    {team.name}
                  </TableCell>
                  <TableCell>
                    {Object.keys(team.members).map((playerKey) => (
                      <PlayerButton
                        key={playerKey}
                        player={players[playerKey]}
                        onChange={(player) => updatePlayer(playerKey, player)}
                      />
                    ))}
                    <AddPlayerButton onAdd={(player) => {
                      addMember(teamKey, addPlayer(player))
                    }} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <Button variant="contained" onClick={addRandomTeam}>
          Ajouter
        </Button>
      </Stack>
    </>
  );
}

export default Teams;
