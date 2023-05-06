import { ref, set, push, child } from 'firebase/database';
import {
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

const teamsRef = ref(database, 'teams');
const playersRef = ref(database, 'players');

export function Teams() {
  const teams = useDatabaseValue(teamsRef, teamsSchema);
  const players = useDatabaseValue(playersRef, playersSchema);

  const addRandomPlayer = () => {
    const newPlayerKey = push(playersRef).key;

    if (newPlayerKey === null) {
      throw new Error('newPlayerKey is null');
    }

    const newPlayer = {
      firstName: 'firstName_' + newPlayerKey,
      lastName: 'lastName_' + newPlayerKey,
    };

    set(child(playersRef, newPlayerKey), newPlayer);

    return newPlayerKey;
  };

  const addRandomTeam = () => {
    const newTeamKey = push(teamsRef).key;

    if (newTeamKey === null) {
      throw new Error('newTeamKey is null');
    }

    const newTeam = {
      name: 'Team ' + newTeamKey,
      members: {
        [addRandomPlayer()]: true,
        [addRandomPlayer()]: true,
      },
    };

    set(child(teamsRef, newTeamKey), newTeam);

    return newTeamKey;
  };

  if (teams === undefined || players === undefined) {
    return <p>Loading...</p>;
  }

  return (
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
            {Object.entries(teams).map(([uuid, team]) => (
              <TableRow
                key={uuid}
                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
              >
                <TableCell component="th" scope="row">
                  {team.name}
                </TableCell>
                <TableCell>
                  {Object.keys(team.members).map((playerKey) => (
                    <Button
                      variant="text"
                      key={playerKey}
                    >{`${players[playerKey].firstName} ${players[playerKey].lastName}`}</Button>
                  ))}
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
  );
}

export default Teams;
