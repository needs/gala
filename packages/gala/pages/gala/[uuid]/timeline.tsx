import {
  Box,
  Button,
  ButtonBase,
  Divider,
  IconButton,
  InputAdornment,
  Paper,
  Stack,
  TextField,
  Typography,
  duration,
} from '@mui/material';
import { withAuthGala } from '../../../lib/auth';
import Grid from '@mui/material/Unstable_Grid2'; // Grid version 2
import {
  Timeline,
  TimelineConnector,
  TimelineContent,
  TimelineDot,
  TimelineItem,
  TimelineOppositeContent,
  TimelineSeparator,
  timelineOppositeContentClasses,
} from '@mui/lab';
import Image from 'next/image';
import {
  Add,
  ArrowDownward,
  ArrowUpward,
  Delete,
  Remove,
} from '@mui/icons-material';
import EditPlayerButton from '../../../components/EditPlayerButton';
import { DatePicker, DateTimePicker, TimePicker } from '@mui/x-date-pickers';
import {
  ApparatusKey,
  Team,
  getApparatusIconPath,
  getApparatusName,
  store,
} from '../../../lib/store';
import { useSyncedStore } from '@syncedstore/react';
import { uuidv4 } from 'lib0/random';
import {
  Duration,
  addMinutes,
  differenceInMinutes,
  format,
  getMinutes,
  intervalToDuration,
  minutesToMilliseconds,
  startOfDay,
} from 'date-fns';
import EditTeamDialog from '../../../components/EditTeamDialog';
import { useState } from 'react';
import { addTeam, defaultTeam } from '../../../lib/team';
import { difference, sortBy } from 'lodash';

function TimelineAddTeamButton({
  teamsMap,
}: {
  teamsMap: Record<string, boolean>;
}) {
  const { teams } = useSyncedStore(store);
  const [open, setOpen] = useState(false);
  const [teamKey, setTeamKey] = useState<string | undefined>(undefined);
  const team = teamKey !== undefined ? teams[teamKey] : undefined;

  return (
    <>
      {team !== undefined && (
        <EditTeamDialog
          open={open}
          team={team}
          onClose={() => setOpen(false)}
        />
      )}
      <Button
        variant="text"
        startIcon={<Add />}
        size="small"
        onClick={() => {
          const teamKey = addTeam(teams, defaultTeam);
          teamsMap[teamKey] = true;
          setTeamKey(teamKey);
          setOpen(true);
        }}
      >
        Équipe
      </Button>
    </>
  );
}

function TimelineEditTeamButton({
  team,
  onRemove,
}: {
  team: Team;
  onRemove: () => void;
}) {
  const { players } = useSyncedStore(store);
  const [open, setOpen] = useState(false);

  return (
    <>
      <EditTeamDialog open={open} team={team} onClose={() => setOpen(false)} />
      <ButtonBase onClick={() => setOpen(true)} component="div">
        <Stack padding={2} gap={1} flexGrow={1}>
          <Stack
            direction="row"
            gap={1}
            alignItems="center"
            justifyContent="space-between"
          >
            <Typography variant="body1">{team.name}</Typography>
            <IconButton size="small" onClick={(event) => onRemove()}>
              <Remove />
            </IconButton>
          </Stack>
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
        </Stack>
      </ButtonBase>
    </>
  );
}

export default function TimelinePage() {
  const { stages, teams } = useSyncedStore(store);

  const stage = Object.values(stages)[0];

  if (stage === undefined) {
    return (
      <Button
        variant="contained"
        onClick={() => {
          stages[uuidv4()] = {
            name: 'Plateau 1',
            timeline: {},
            timelineStartDate: new Date().toString(),
          };
        }}
      >
        Ajouter un plateau
      </Button>
    );
  }

  const rotations = sortBy(
    Object.entries(stage.timeline),
    (entry) => entry[1].order
  );

  let nextRotationDate = new Date(stage.timelineStartDate);
  const startOfDayDate = startOfDay(new Date(0));

  return (
    <Stack direction="column" padding={4} gap={4}>
      <Stack
        direction="row"
        gap={2}
        alignItems="center"
        justifyContent="space-between"
      >
        <Stack direction="row" gap={2}>
          <Typography variant="h6" component="h1">
            Échéancier
          </Typography>
        </Stack>
        <Stack direction="row" gap={2}>
          <Button variant="outlined" startIcon={<Add />} disabled>
            Pause
          </Button>
          <Button
            variant="contained"
            onClick={() => {
              Object.values(stage.timeline).forEach((rotation) => {
                rotation.order += 1;
              });

              stage.timeline[uuidv4()] = {
                apparatuses: {
                  vault: {
                    teams: {},
                  },
                  unevenBars: {
                    teams: {},
                  },
                  beam: {
                    teams: {},
                  },
                  floor: {
                    teams: {},
                  },
                },
                order: 0,
                durationInMinutes: 10,
              };
            }}
            startIcon={<Add />}
          >
            Rotation
          </Button>
        </Stack>
      </Stack>

      <Timeline
        sx={{
          [`& .${timelineOppositeContentClasses.root}`]: {
            flex: 0,
          },
        }}
      >
        <TimelineItem>
          <TimelineOppositeContent
            color="textSecondary"
            minWidth="80px"
          ></TimelineOppositeContent>
          <TimelineSeparator>
            <TimelineDot />
            <TimelineConnector />
          </TimelineSeparator>
          <TimelineContent sx={{ paddingTop: '0' }}>
            <Stack direction="column" gap={2} paddingBottom={4}>
              <Typography variant="h6" component="h1">
                Ouverture du gymnase
              </Typography>
              <DateTimePicker
                label="Date"
                sx={{
                  minWidth: '400px',
                }}
                value={new Date(stage.timelineStartDate)}
                onChange={(date) => {
                  if (date !== null) {
                    stage.timelineStartDate = date.toString();
                  }
                }}
                format="EEEE d MMMM yyyy HH:mm"
              />
            </Stack>
          </TimelineContent>
        </TimelineItem>

        {rotations.map(([rotationKey, rotation], order) => {
          const rotationDate = nextRotationDate;

          nextRotationDate = addMinutes(
            nextRotationDate,
            rotation.durationInMinutes
          );
          const durationDate = addMinutes(
            startOfDayDate,
            rotation.durationInMinutes
          );

          return (
            rotation !== undefined && (
              <TimelineItem key={rotationKey}>
                <TimelineOppositeContent color="textSecondary" minWidth="80px">
                  <Stack gap={2} alignItems="end">
                    <Typography variant="body1">
                      {format(rotationDate, 'HH:mm')}
                    </Typography>
                    <IconButton
                      size="small"
                      disabled={order === 0}
                      onClick={() => {
                        rotations[order][1].order -= 1;
                        rotations[order - 1][1].order += 1;
                      }}
                    >
                      <ArrowUpward />
                    </IconButton>
                    <IconButton
                      size="small"
                      disabled={
                        order === Object.keys(stage.timeline).length - 1
                      }
                      onClick={() => {
                        rotations[order][1].order += 1;
                        rotations[order + 1][1].order -= 1;
                      }}
                    >
                      <ArrowDownward />
                    </IconButton>
                  </Stack>
                </TimelineOppositeContent>
                <TimelineSeparator>
                  <TimelineDot />
                  <TimelineConnector />
                </TimelineSeparator>
                <TimelineContent marginBottom={4} sx={{ paddingTop: '0' }}>
                  <Stack gap={2}>
                    <Stack
                      direction="row"
                      gap={2}
                      alignItems="center"
                      justifyContent="space-between"
                    >
                      <Stack
                        direction="row"
                        gap={2}
                        alignItems="center"
                        divider={<Divider />}
                      >
                        <Typography variant="h6" component="h1">
                          Rotation {order + 1}
                        </Typography>
                        <TextField
                          label="Durée"
                          inputProps={{
                            inputMode: 'numeric',
                            pattern: '[0-9]*',
                          }}
                          InputProps={{
                            endAdornment: (
                              <InputAdornment position="end">
                                minutes
                              </InputAdornment>
                            ),
                          }}
                          size="small"
                          value={rotation.durationInMinutes}
                          onChange={(event) => {
                            const duration = parseInt(event.target.value);
                            rotation.durationInMinutes = isNaN(duration)
                              ? 0
                              : duration;
                          }}
                          sx={{
                            maxWidth: '130px',
                          }}
                        />
                      </Stack>
                      <IconButton
                        size="small"
                        onClick={() => {
                          delete stage.timeline[rotationKey];
                        }}
                      >
                        <Delete />
                      </IconButton>
                    </Stack>
                    <Paper elevation={1} sx={{ overflow: 'hidden' }}>
                      <Grid container>
                        {Object.entries(rotation.apparatuses).map(
                          ([apparatuseKey, { teams: apparatusTeams }]) => (
                            <Grid
                              key={apparatuseKey}
                              xs
                              sx={{
                                '&:nth-of-type(odd)': {
                                  backgroundColor: (theme) =>
                                    theme.palette.grey[50],
                                },
                              }}
                            >
                              <Stack alignItems="stretch" flexGrow={1}>
                                <Stack
                                  direction="row"
                                  gap={2}
                                  justifyContent="space-between"
                                  padding={2}
                                  sx={{
                                    backgroundColor: '#a5a5a511',
                                  }}
                                >
                                  <Stack
                                    direction="row"
                                    gap={2}
                                    alignItems="center"
                                    justifyContent="center"
                                  >
                                    <Image
                                      src={getApparatusIconPath(
                                        apparatuseKey as ApparatusKey
                                      )}
                                      alt={getApparatusName(
                                        apparatuseKey as ApparatusKey
                                      )}
                                      width={24}
                                      height={24}
                                    />
                                    <Typography variant="h6">
                                      {getApparatusName(
                                        apparatuseKey as ApparatusKey
                                      )}
                                    </Typography>
                                  </Stack>

                                  <TimelineAddTeamButton
                                    teamsMap={apparatusTeams}
                                  />
                                </Stack>

                                <Stack
                                  flexGrow={1}
                                  direction="column"
                                  divider={<Divider />}
                                >
                                  {Object.keys(apparatusTeams).map(
                                    (teamKey) => {
                                      const team = teams[teamKey];

                                      return (
                                        team !== undefined && (
                                          <TimelineEditTeamButton
                                            key={teamKey}
                                            team={team}
                                            onRemove={() => {
                                              delete apparatusTeams[teamKey];
                                            }}
                                          />
                                        )
                                      );
                                    }
                                  )}
                                </Stack>
                              </Stack>
                            </Grid>
                          )
                        )}
                      </Grid>
                    </Paper>
                  </Stack>
                </TimelineContent>
              </TimelineItem>
            )
          );
        })}

        <TimelineItem>
          <TimelineOppositeContent color="textSecondary" minWidth="80px">
            {format(nextRotationDate, 'HH:mm')}
          </TimelineOppositeContent>
          <TimelineSeparator>
            <TimelineDot />
          </TimelineSeparator>
          <TimelineContent sx={{ paddingTop: '0' }}>
            <Typography variant="h6" component="h1">
              Fin de la compétition
            </Typography>
          </TimelineContent>
        </TimelineItem>
      </Timeline>
    </Stack>
  );
}

export const getServerSideProps = withAuthGala('timeline');
