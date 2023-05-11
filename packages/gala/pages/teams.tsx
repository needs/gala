import { ref, set, child, remove } from 'firebase/database';
import {
  Team,
  categoriesSchema,
  database,
  playersSchema,
  teamSchema,
  teamsSchema,
  useDatabaseValue,
} from '../lib/database';
import {
  Box,
  Button,
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
import { Clear, Delete, Edit } from '@mui/icons-material';
import { useMemo, useState } from 'react';
import EditTeamDialog from '../components/EditTeamDialog';
import Head from 'next/head';
import GenderAvatar from '../components/GenderAvatar';
import { groupBy, sum } from 'lodash';
import CategorySelector from '../components/CategorySelector';
import Loading from '../components/Loading';
import { addPlayer, updatePlayer } from '../lib/player';
import EditPlayerButton from '../components/EditPlayerButton';
import AddPlayerButton from '../components/AddPlayerButton';
import { addTeam, defaultTeam, updateTeam } from '../lib/team';

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
        onClose={() => setOpen(false)}
        onChange={onChange}
        team={team}
      />
      <IconButton onClick={() => setOpen(true)}>
        <Edit />
      </IconButton>
    </>
  );
}

function AddTeamButton({ onAdd }: { onAdd: (team: Team) => void }) {
  const [open, setOpen] = useState(false);
  const [teamKey, setTeamKey] = useState<string | undefined>(undefined);

  const teamRef = useMemo(() => {
    return teamKey !== undefined ? child(teamsRef, teamKey) : undefined;
  }, [teamKey]);

  const team = useDatabaseValue(teamRef, teamSchema);

  return (
    <>
      {team !== undefined && teamKey !== undefined && (
        <EditTeamDialog
          open={open}
          onClose={() => setOpen(false)}
          onChange={(team) => {
            updateTeam(teamKey, team);
          }}
          team={team}
        />
      )}
      <Button
        variant="contained"
        onClick={() => {
          setTeamKey(addTeam(defaultTeam));
          setOpen(true);
        }}
      >
        Ajouter
      </Button>
    </>
  );
}

export default function TeamsPage() {
  const teams = useDatabaseValue(teamsRef, teamsSchema);
  const players = useDatabaseValue(playersRef, playersSchema);
  const categories = useDatabaseValue(categoriesRef, categoriesSchema);

  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');

  const addMember = (teamKey: string, playerKey: string) => {
    const membersRef = ref(database, `teams/${teamKey}/members`);
    set(child(membersRef, playerKey), true);
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

        if (team.category === undefined) {
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
    return <Loading />;
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
              {teams.map(({ teamKey, team }) => (
                <Stack
                  direction="row"
                  gap={2}
                  padding={2}
                  key={teamKey}
                  divider={<Divider orientation="vertical" flexItem />}
                  width="100%"
                >
                  <Box minWidth={300} maxWidth={300} padding={1}>
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
          </Paper>
        ))}
      </Stack>
    </>
  );
}
