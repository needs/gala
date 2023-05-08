import { ref, set, push, child, remove } from 'firebase/database';
import {
  Player,
  Team,
  Teams,
  categoriesSchema,
  database,
  playersSchema,
  teamsSchema,
  useDatabaseValue,
} from '../lib/database';
import {
  Avatar,
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
  TextField,
  Typography,
} from '@mui/material';
import { Add, Delete, Edit } from '@mui/icons-material';
import EditPlayerDialog from '../components/EditPlayerDialog';
import { useMemo, useState } from 'react';
import EditTeamDialog from '../components/EditTeamDialog';
import Head from 'next/head';
import GenderAvatar from '../components/GenderAvatar';
import GenderIcon from '../components/GenderIcon';

const teamsRef = ref(database, 'teams');
const playersRef = ref(database, 'players');
const categoriesRef = ref(database, 'categories');

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
        avatar={
          <Avatar sx={{ bgcolor: 'transparent' }}>
            <GenderIcon gender={player.gender} />
          </Avatar>
        }
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
          gender: 'man',
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
  const categories = useDatabaseValue(categoriesRef, categoriesSchema);

  const [searchQuery, setSearchQuery] = useState('');

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

  const filteredTeams = useMemo<Teams | undefined>(() => {
    if (teams === undefined || players === undefined) {
      return undefined;
    }

    return Object.fromEntries(
      Object.entries(teams).filter(([teamKey, team]) => {
        if (searchQuery === '') {
          return true;
        }

        const matchMembers = Object.keys(team.members).some((playerKey) => {
          const player = players[playerKey];
          return (
            player.firstName
              .toLowerCase()
              .includes(searchQuery.toLowerCase()) ||
            player.lastName.toLowerCase().includes(searchQuery.toLowerCase())
          );
        });

        const matchName = team.name
          .toLowerCase()
          .includes(searchQuery.toLowerCase());

        return matchMembers || matchName;
      })
    );
  }, [teams, players, searchQuery]);

  if (
    teams === undefined ||
    players === undefined ||
    categories === undefined ||
    filteredTeams === undefined
  ) {
    return <p>Loading...</p>;
  }

  return (
    <>
      <Head>
        <title>Équipes</title>
      </Head>
      <Stack padding={2} gap={2}>
        <Stack direction="row" justifyContent="space-between">
          <Stack direction="row" gap={2} alignItems="center">
            <TextField
              label="Rechercher"
              variant="outlined"
              size="small"
              autoFocus
              sx={{ width: 300 }}
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
            />
            <Typography variant="caption">{`${
              Object.values(filteredTeams).length
            } / ${Object.values(teams).length} équipe(s)`}</Typography>
          </Stack>
          <AddTeamButton onAdd={addTeam} />
        </Stack>

        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell>Catégorie</TableCell>
                <TableCell>Nom</TableCell>
                <TableCell>Joueurs</TableCell>
                <TableCell></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {Object.entries(filteredTeams).map(([teamKey, team]) => (
                <TableRow
                  key={teamKey}
                  sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                >
                  <TableCell component="th" scope="row">
                    {team.category !== undefined && (
                      <Stack direction="row" spacing={2} alignItems="center">
                        <GenderAvatar
                          gender={categories[team.category].gender}
                        />
                        <span>{categories[team.category].name}</span>
                      </Stack>
                    )}
                  </TableCell>
                  <TableCell>{team.name}</TableCell>
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
      </Stack>
    </>
  );
}

export default Teams;
