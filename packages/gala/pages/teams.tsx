import { ref, set, push, child, remove } from 'firebase/database';
import {
  Player,
  Team,
  categoriesSchema,
  database,
  playersSchema,
  teamsSchema,
  useDatabaseValue,
} from '../lib/database';
import {
  Avatar,
  Box,
  Button,
  Chip,
  Divider,
  FormControl,
  IconButton,
  InputAdornment,
  InputLabel,
  OutlinedInput,
  Paper,
  Stack,
  Typography,
} from '@mui/material';
import { Add, Clear, Delete, Edit } from '@mui/icons-material';
import EditPlayerDialog from '../components/EditPlayerDialog';
import { useMemo, useState } from 'react';
import EditTeamDialog from '../components/EditTeamDialog';
import Head from 'next/head';
import GenderAvatar from '../components/GenderAvatar';
import GenderIcon from '../components/GenderIcon';
import { groupBy, sum } from 'lodash';
import CategorySelector from '../components/CategorySelector';

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

function capitalizeFirstLetter(string: string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
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
        label={`${capitalizeFirstLetter(
          player.firstName
        )} ${player.lastName.toUpperCase()}`}
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

export function Index() {
  const teams = useDatabaseValue(teamsRef, teamsSchema);
  const players = useDatabaseValue(playersRef, playersSchema);
  const categories = useDatabaseValue(categoriesRef, categoriesSchema);

  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');

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

  const teamsByCategory = useMemo(() => {
    if (teams === undefined || players === undefined) {
      return undefined;
    }

    const filteredTeams = Object.entries(teams)
      .filter(([teamKey, team]) => {
        if (categoryFilter !== '' && team.category !== categoryFilter) {
          return false;
        }

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
      .map(([teamKey, team]) => ({ teamKey, team }));

    const ret = groupBy(filteredTeams, ({ team }) => team.category);
    return ret;
  }, [teams, players, searchQuery, categoryFilter]);

  if (
    teams === undefined ||
    players === undefined ||
    categories === undefined ||
    teamsByCategory === undefined
  ) {
    return <p>Loading...</p>;
  }

  return (
    <>
      <Head>
        <title>Équipes</title>
      </Head>
      <Stack padding={4} gap={4}>
        <Stack direction="row" justifyContent="space-between">
          <Stack direction="row" gap={2} alignItems="center">
            <FormControl variant="outlined" size="small">
              <InputLabel htmlFor="teams-search">Rechercher</InputLabel>

              <OutlinedInput
                id="teams-search"
                type="text"
                label="Rechercher"
                autoFocus
                sx={{ width: 300 }}
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                endAdornment={
                  searchQuery !== '' && (
                    <InputAdornment position="end">
                      <IconButton onClick={() => setSearchQuery('')} edge="end">
                        <Clear />
                      </IconButton>
                    </InputAdornment>
                  )
                }
              />
            </FormControl>
            <Box width={300}>
            <CategorySelector
              categoryKey={categoryFilter}
              onChange={setCategoryFilter}
              allowAll
            />
            </Box>
            <Typography variant="caption">{`${sum(
              Object.values(teamsByCategory).map((teams) => teams.length)
            )} / ${Object.values(teams).length} équipe(s)`}</Typography>
          </Stack>
          <AddTeamButton onAdd={addTeam} />
        </Stack>

        {Object.entries(teamsByCategory).map(([categoryKey, teams]) => (
          <Paper key={categoryKey}>
            <Stack divider={<Divider />}>
              <Stack gap={2} direction="row" alignItems="center" padding={2}>
                <GenderAvatar gender={categories[categoryKey].gender} />
                <Typography variant="h6">
                  {categories[categoryKey].name}
                </Typography>
              </Stack>
              <Stack direction="column" gap={2} padding={2} alignItems="center">
                {teams.map(({ teamKey, team }) => (
                  <Stack
                    direction="row"
                    spacing={2}
                    key={teamKey}
                    divider={<Divider orientation="vertical" flexItem />}
                    width="100%"
                  >
                    <Box width={300} padding={1}>
                      {team.name}
                    </Box>
                    <Stack
                      direction="row"
                      gap={1}
                      flexGrow="1"
                      flexWrap="wrap"
                      alignItems="center"
                    >
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
                    <Stack direction="column" gap={2}>
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
                    </Stack>
                  </Stack>
                ))}
              </Stack>
            </Stack>
          </Paper>
        ))}
      </Stack>
    </>
  );
}

export default Index;
