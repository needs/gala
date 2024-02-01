import {
  Avatar,
  Box,
  Divider,
  FormControl,
  IconButton,
  InputAdornment,
  InputLabel,
  OutlinedInput,
  Paper,
  Stack,
  Tooltip,
  Typography,
} from '@mui/material';
import { Clear, Delete, Edit, QuestionMark } from '@mui/icons-material';
import { useState } from 'react';
import EditTeamDialog from '../../../components/EditTeamDialog';
import Head from 'next/head';
import GenderAvatar from '../../../components/GenderAvatar';
import { groupBy, sum } from 'lodash';
import CategorySelector, {
  CategorySelectorValue,
} from '../../../components/CategorySelector';
import EditPlayerButton from '../../../components/EditPlayerButton';
import AddPlayerButton from '../../../components/AddPlayerButton';
import { withAuthCompetition } from '../../../lib/auth';
import EditCategoryDialog from '../../../components/EditCategoryDialog';
import { Category, Team } from '@tgym.fr/core';
import { useCompetition } from '../../../components/StoreProvider';
import AddTeamButton from '../../../components/AddTeamButton';
import AddCategoryButton from '../../../components/AddCategoryButton';

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

function EditCategoryButton({ category }: { category: Category }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <EditCategoryDialog
        open={open}
        onClose={() => setOpen(false)}
        category={category}
      />
      <IconButton onClick={() => setOpen(true)}>
        <Edit />
      </IconButton>
    </>
  );
}

export default function TeamsPage() {
  const { teams, players, categories } = useCompetition();

  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<CategorySelectorValue>({
    type: 'all',
  });

  const deleteTeam = (teamKey: string) => {
    delete teams[teamKey];
  };

  const teamsByCategory = (() => {
    const filteredTeams = Object.entries(teams)
      .filter(([teamKey, team]) => {
        if (team === undefined) {
          return false;
        }

        switch (categoryFilter.type) {
          case 'all':
            break;
          case 'none':
            if (team.categoryKey !== undefined) {
              return false;
            }
            break;
          case 'category':
            if (team.categoryKey !== categoryFilter.categoryKey) {
              return false;
            }
            break;
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

    const teamsByCategory = groupBy(
      filteredTeams,
      ({ team }) => team?.categoryKey
    );

    // Add missing categories
    if (searchQuery === '') {
      switch (categoryFilter.type) {
        case 'all':
          for (const categoryKey of Object.keys(categories)) {
            if (!(categoryKey in teamsByCategory)) {
              teamsByCategory[categoryKey] = [];
            }
          }
          break;
        case 'none':
          if (!('undefined' in teamsByCategory)) {
            teamsByCategory['undefined'] = [];
          }
          break;
        case 'category':
          if (!(categoryFilter.categoryKey in teamsByCategory)) {
            teamsByCategory[categoryFilter.categoryKey] = [];
          }
          break;
      }
    }

    return teamsByCategory;
  })();

  const deleteCategory = (categoryKey: string) => {
    delete categories[categoryKey];
  };

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
                value={categoryFilter}
                onChange={setCategoryFilter}
                allowAll
                allowNone
              />
            </Box>
            <Typography variant="caption">{`${sum(
              Object.values(teamsByCategory).map((teams) => teams.length)
            )} / ${Object.values(teams).length} équipe(s)`}</Typography>
          </Stack>
          <AddCategoryButton variant="contained" />
        </Stack>

        {Object.entries(teamsByCategory).map(([categoryKey, categoryTeams]) => {
          const category = categories[categoryKey];

          const icon =
            category === undefined ? (
              <Avatar>
                <QuestionMark />
              </Avatar>
            ) : (
              <GenderAvatar gender={category.gender} />
            );

          const name =
            category === undefined ? (
              <Typography variant="h6" sx={{ fontStyle: 'italic' }}>
                Sans catégorie
              </Typography>
            ) : (
              <Typography variant="h6">{category.name}</Typography>
            );

          return (
            <Paper key={categoryKey}>
              <Stack divider={<Divider />}>
                <Stack
                  padding={2}
                  direction="row"
                  justifyContent="space-between"
                  alignItems="center"
                >
                  <Stack gap={2} direction="row" alignItems="center">
                    {icon}
                    <Stack direction="column">
                      {name}
                      <Typography variant="caption">
                        {categoryTeams.length}
                        {searchQuery !== '' &&
                          ` / ${
                            Object.values(teams).filter(
                              (team) => team?.categoryKey === categoryKey
                            ).length
                          }`}
                        {' équipe(s)'}
                      </Typography>
                    </Stack>
                  </Stack>
                  {category !== undefined && (
                    <Stack
                      direction="row"
                      gap={2}
                      divider={<Divider orientation="vertical" flexItem />}
                    >
                      <AddTeamButton defaultCategoryKey={categoryKey} />
                      <Stack direction="row" gap={1}>
                        <EditCategoryButton category={category} />
                        <Tooltip
                          title={
                            categoryTeams.length === 0
                              ? 'Doubler cliquez pour supprimer'
                              : 'Enlevez toutes les équipes avant de pouvoir supprimer cette catégorie'
                          }
                        >
                          <span>
                            <IconButton
                              onDoubleClick={() => deleteCategory(categoryKey)}
                              sx={{ color: 'lightcoral' }}
                              disabled={categoryTeams.length > 0}
                            >
                              <Delete />
                            </IconButton>
                          </span>
                        </Tooltip>
                      </Stack>
                    </Stack>
                  )}
                </Stack>
                {categoryTeams.map(
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
                        <Stack
                          direction="row"
                          gap={2}
                          minWidth={300}
                          maxWidth={300}
                          padding={1}
                          alignItems="baseline"
                        >
                          {team.name}
                          {team.label !== undefined && (
                            <Typography
                              variant="caption"
                              px={1}
                              py={0.5}
                              sx={{
                                backgroundColor: '#eeeeee',
                                borderRadius: 2,
                              }}
                            >
                              Équipe {team.label}
                            </Typography>
                          )}
                        </Stack>
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
                            <Tooltip title="Double cliquez pour supprimer">
                              <IconButton
                                onDoubleClick={() => deleteTeam(teamKey)}
                                sx={{ color: 'lightcoral' }}
                              >
                                <Delete />
                              </IconButton>
                            </Tooltip>
                          </Stack>
                        </Stack>
                      </Stack>
                    )
                )}
              </Stack>
            </Paper>
          );
        })}
      </Stack>
    </>
  );
}

export const getServerSideProps = withAuthCompetition('teams');
