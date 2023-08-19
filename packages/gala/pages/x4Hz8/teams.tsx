import { Team, store } from '../../lib/store';
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
import { useState } from 'react';
import EditTeamDialog from '../../components/EditTeamDialog';
import Head from 'next/head';
import GenderAvatar from '../../components/GenderAvatar';
import { groupBy, sum } from 'lodash';
import CategorySelector from '../../components/CategorySelector';
import Loading from '../../components/Loading';
import EditPlayerButton from '../../components/EditPlayerButton';
import AddPlayerButton from '../../components/AddPlayerButton';
import { addTeam, defaultTeam } from '../../lib/team';
import { useSyncedStore } from '@syncedstore/react';

function EditTeamButton({ team }: { team: Team }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <EditTeamDialog
        open={open}
        onClose={() => {
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

function AddTeamButton() {
  const [open, setOpen] = useState(false);
  const [teamKey, setTeamKey] = useState<string | undefined>(undefined);
  const { teams } = useSyncedStore(store);
  const team = teamKey !== undefined ? teams[teamKey] : undefined;

  return (
    <>
      {team !== undefined && (
        <EditTeamDialog
          open={open}
          onClose={() => {
            setOpen(false);
          }}
          team={team}
        />
      )}
      <Button
        variant="contained"
        onClick={() => {
          setTeamKey(addTeam(teams, defaultTeam));
          setOpen(true);
        }}
      >
        Ajouter
      </Button>
    </>
  );
}

export default function TeamsPage() {
  const { teams, players, categories } = useSyncedStore(store);

  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');

  const deleteTeam = (teamKey: string) => {
    delete teams[teamKey];
  };

  const teamsByCategory = (() => {
    const filteredTeams = Object.entries(teams)
      .filter(([teamKey, team]) => {
        if (team === undefined) {
          return false;
        }

        if (categoryFilter !== '' && team.categoryKey !== categoryFilter) {
          return false;
        }

        if (team.categoryKey === undefined) {
          return false;
        }

        if (searchQuery === '') {
          return true;
        }

        const matchMembers = Object.keys(team.members).some((playerKey) => {
          const player = players[playerKey];
          return (
            player !== undefined &&
            (player.firstName
              .toLowerCase()
              .includes(searchQuery.toLowerCase()) ||
              player.lastName.toLowerCase().includes(searchQuery.toLowerCase()))
          );
        });

        const matchName = team.name
          .toLowerCase()
          .includes(searchQuery.toLowerCase());

        return matchMembers || matchName;
      })
      .map(([teamKey, team]) => ({ teamKey, team }));

    const ret = groupBy(filteredTeams, ({ team }) => team?.categoryKey);
    return ret;
  })();

  if (teamsByCategory === undefined) {
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
          <AddTeamButton />
        </Stack>

        {Object.entries(teamsByCategory).map(([categoryKey, teams]) => {
          const category = categories[categoryKey];
          return (
            category !== undefined && (
              <Paper key={categoryKey}>
                <Stack divider={<Divider />}>
                  <Stack
                    gap={2}
                    direction="row"
                    alignItems="center"
                    padding={2}
                  >
                    <GenderAvatar gender={category.gender} />
                    <Typography variant="h6">{category.name}</Typography>
                  </Stack>
                  {teams.map(
                    ({ teamKey, team }) =>
                      team !== undefined && (
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
                          <Stack direction="column" gap={2}>
                            <Stack direction="row" gap={1}>
                              <EditTeamButton team={team} />
                              <IconButton
                                onDoubleClick={() => deleteTeam(teamKey)}
                                sx={{ color: 'lightcoral' }}
                              >
                                <Delete />
                              </IconButton>
                            </Stack>
                          </Stack>
                        </Stack>
                      )
                  )}
                </Stack>
              </Paper>
            )
          );
        })}
      </Stack>
    </>
  );
}
