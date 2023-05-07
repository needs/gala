import { ref, set, push, child, remove } from 'firebase/database';
import {
  Player,
  Team,
  database,
  playersSchema,
  teamsSchema,
  useDatabaseValue,
} from '../lib/database';
import {
  Button,
  Chip,
  IconButton,
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
import { Add, Delete, Edit, Woman } from '@mui/icons-material';
import EditPlayerDialog from '../components/EditPlayerDialog';
import { useState } from 'react';
import EditTeamDialog from '../components/EditTeamDialog';
import Head from 'next/head';

const teamsRef = ref(database, 'teams');
const playersRef = ref(database, 'players');

function EditTeamButton({
  team,
  onChange,
}: {
  team: Team;
  onChange: (team: Team) => void;
}) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <EditTeamDialog
        open={open}
        onCancel={() => setOpen(false)}
        onValidate={(team) => {
          onChange(team);
          setOpen(false);
        }}
        team={team}
      />
      <IconButton onClick={() => setOpen(true)}>
        <Edit />
      </IconButton>
    </>
  );
}

function EditPlayerButton({
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
        onValidate={(player) => {
          onChange(player);
          setOpen(false);
        }}
        player={player}
      />
      <Chip
        icon={<Woman sx={{ '&&': { color: 'pink' } }} />}
        onClick={() => setOpen(true)}
        label={`${player.firstName} ${player.lastName.toUpperCase()}`}
        variant="outlined"
      />
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
      <IconButton onClick={() => setOpen(true)} size="small">
        <Add />
      </IconButton>
    </>
  );
}

function AddTeamButton({ onAdd }: { onAdd: (team: Team) => void }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <EditTeamDialog
        open={open}
        onCancel={() => setOpen(false)}
        team={{
          name: '',
          category: undefined,
          members: {},
        }}
        onValidate={onAdd}
      />
      <Button variant="contained" onClick={() => setOpen(true)}>
        Ajouter
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

  const addTeam = (team: Team) => {
    const newTeamKey = push(teamsRef).key;

    if (newTeamKey === null) {
      throw new Error('newTeamKey is null');
    }

    set(child(teamsRef, newTeamKey), team);
    return newTeamKey;
  };

  const addMember = (teamKey: string, playerKey: string) => {
    const membersRef = ref(database, `teams/${teamKey}/members`);
    set(child(membersRef, playerKey), true);
  };

  const updateTeam = (teamKey: string, team: Team) => {
    set(child(teamsRef, teamKey), team);
  };

  const deleteTeam = (teamKey: string) => {
    remove(child(teamsRef, teamKey));
  };

  if (teams === undefined || players === undefined) {
    return <p>Loading...</p>;
  }

  return (
    <>
      <Head>
        <title>Équipes</title>
      </Head>
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
                    <Stack direction="row" gap={1}>
                      {Object.keys(team.members).map((playerKey) => (
                        <EditPlayerButton
                          key={playerKey}
                          player={players[playerKey]}
                          onChange={(player) => updatePlayer(playerKey, player)}
                        />
                      ))}
                      <AddPlayerButton
                        onAdd={(player) => {
                          addMember(teamKey, addPlayer(player));
                        }}
                      />
                    </Stack>
                  </TableCell>
                  <TableCell>
                    <Stack direction="row" gap={1}>
                      <EditTeamButton
                        team={team}
                        onChange={(team) => updateTeam(teamKey, team)}
                      />
                      <IconButton
                        onDoubleClick={() => deleteTeam(teamKey)}
                        sx={{ color: 'lightcoral' }}
                      >
                        <Delete />
                      </IconButton>
                    </Stack>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <AddTeamButton onAdd={addTeam} />
      </Stack>
    </>
  );
}

export default Teams;
