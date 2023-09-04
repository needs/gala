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
  Tooltip,
  Typography,
} from '@mui/material';
import { withAuthGala } from '../../../lib/auth';
import Grid from '@mui/material/Unstable_Grid2'; // Grid version 2
import Image from 'next/image';
import {
  Add,
  ArrowDownward,
  ArrowUpward,
  Delete,
  Remove,
} from '@mui/icons-material';
import EditPlayerButton from '../../../components/EditPlayerButton';
import { DateTimePicker } from '@mui/x-date-pickers';
import {
  ApparatusKey,
  Team,
  TimelinePause,
  TimelineRotation,
  getApparatusIconPath,
  getApparatusName,
  store,
} from '../../../lib/store';
import { useSyncedStore } from '@syncedstore/react';
import { uuidv4 } from 'lib0/random';
import {
  addMinutes,
  format,
  formatDuration,
  intervalToDuration,
} from 'date-fns';
import EditTeamDialog from '../../../components/EditTeamDialog';
import { ReactNode, useState } from 'react';
import { sortBy } from 'lodash';
import SelectTeamDialog from '../../../components/SelectTeamDialog';
import fr from 'date-fns/locale/fr';

function TimelineAddTeamButton({
  teamsMap,
}: {
  teamsMap: Record<string, boolean>;
}) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <SelectTeamDialog
        open={open}
        onSelect={(teamKey) => {
          teamsMap[teamKey] = true;
          setOpen(false);
        }}
        onClose={() => setOpen(false)}
      />
      <Button
        variant="text"
        startIcon={<Add />}
        size="small"
        onClick={() => {
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

function TimelineRotationContainer({
  children,
  rotation,
  date,
  onMoveUp,
  onMoveDown,
  onDelete,
}: {
  children: ReactNode;
  rotation: TimelineRotation | TimelinePause;
  date: Date;
  onMoveUp?: () => void;
  onMoveDown?: () => void;
  onDelete?: () => void;
}) {
  return (
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
            {format(date, 'HH:mm')}
          </Typography>
          <TextField
            label="Durée"
            inputProps={{
              inputMode: 'numeric',
              pattern: '[0-9]*',
            }}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">minutes</InputAdornment>
              ),
            }}
            size="small"
            value={rotation.durationInMinutes}
            onChange={(event) => {
              const duration = parseInt(event.target.value);
              rotation.durationInMinutes = isNaN(duration) ? 0 : duration;
            }}
            sx={{
              maxWidth: '130px',
            }}
          />
        </Stack>
        <Stack gap={2} direction="row">
          <IconButton
            size="small"
            disabled={onMoveUp === undefined}
            onClick={onMoveUp}
          >
            <ArrowUpward />
          </IconButton>
          <IconButton
            size="small"
            disabled={onMoveDown === undefined}
            onClick={onMoveDown}
          >
            <ArrowDownward />
          </IconButton>

          <Tooltip
            title={
              onDelete !== undefined
                ? undefined
                : 'Enelever toute les équipes pour pouvoir supprimer la rotation'
            }
          >
            <span>
              <IconButton
                size="small"
                onClick={onDelete}
                disabled={onDelete === undefined}
              >
                <Delete />
              </IconButton>
            </span>
          </Tooltip>
        </Stack>
      </Stack>
      {children}
    </Stack>
  );
}

function TimelineRotationComponent({
  rotation,
  date,
  onMoveUp,
  onMoveDown,
  onDelete,
}: {
  rotation: TimelineRotation;
  date: Date;
  onMoveUp?: () => void;
  onMoveDown?: () => void;
  onDelete?: () => void;
}) {
  const { teams } = useSyncedStore(store);

  return (
    <TimelineRotationContainer
      rotation={rotation}
      date={date}
      onMoveUp={onMoveUp}
      onMoveDown={onMoveDown}
      onDelete={onDelete}
    >
      <Paper elevation={1} sx={{ overflow: 'hidden' }}>
        <Grid container>
          {Object.entries(rotation.apparatuses).map(
            ([apparatuseKey, { teams: apparatusTeams }]) => (
              <Grid
                key={apparatuseKey}
                xs
                sx={{
                  '&:nth-of-type(odd)': {
                    backgroundColor: (theme) => theme.palette.grey[50],
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
                        alt={getApparatusName(apparatuseKey as ApparatusKey)}
                        width={24}
                        height={24}
                      />
                      <Typography variant="h6">
                        {getApparatusName(apparatuseKey as ApparatusKey)}
                      </Typography>
                    </Stack>

                    <TimelineAddTeamButton teamsMap={apparatusTeams} />
                  </Stack>

                  <Stack flexGrow={1} direction="column" divider={<Divider />}>
                    {Object.keys(apparatusTeams).map((teamKey) => {
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
                    })}
                  </Stack>
                </Stack>
              </Grid>
            )
          )}
        </Grid>
      </Paper>
    </TimelineRotationContainer>
  );
}

function TimelinePauseComponent({
  rotation,
  date,
  onMoveUp,
  onMoveDown,
  onDelete,
}: {
  rotation: TimelinePause;
  date: Date;
  onMoveUp?: () => void;
  onMoveDown?: () => void;
  onDelete?: () => void;
}) {
  return (
    <TimelineRotationContainer
      rotation={rotation}
      date={date}
      onMoveUp={onMoveUp}
      onMoveDown={onMoveDown}
      onDelete={onDelete}
    >
      <Box
        paddingY={2}
        paddingX={4}
        borderRadius={2}
        sx={{
          backgroundImage: 'url("/background-pause.svg")',
          backgroundRepeat: 'no-repeat',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <Typography variant="h6" component="h2" color="ActiveBorder">
          Pause
        </Typography>
      </Box>
    </TimelineRotationContainer>
  );
}

export default function TimelinePage() {
  const { stages } = useSyncedStore(store);

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
          <Button
            variant="outlined"
            startIcon={<Add />}
            onClick={() => {
              Object.values(stage.timeline).forEach((rotation) => {
                rotation.order += 1;
              });

              stage.timeline[uuidv4()] = {
                type: 'pause',
                order: 0,
                durationInMinutes: 30,
              };
            }}
          >
            Pause
          </Button>
          <Button
            variant="contained"
            onClick={() => {
              Object.values(stage.timeline).forEach((rotation) => {
                rotation.order += 1;
              });

              stage.timeline[uuidv4()] = {
                type: 'rotation',
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
                durationInMinutes: 60,
              };
            }}
            startIcon={<Add />}
          >
            Rotation
          </Button>
        </Stack>
      </Stack>

      <Stack direction="column" gap={2}>
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

      {rotations.map(([rotationKey, rotation], order) => {
        const rotationDate = nextRotationDate;

        nextRotationDate = addMinutes(
          nextRotationDate,
          rotation.durationInMinutes
        );

        const onMoveUp = () => {
          rotations[order][1].order -= 1;
          rotations[order - 1][1].order += 1;
        };

        const onMoveDown = () => {
          rotations[order][1].order += 1;
          rotations[order + 1][1].order -= 1;
        };

        const onDelete = () => {
          delete stage.timeline[rotationKey];
        };

        if (rotation.type === 'rotation') {
          const isEmpty = Object.values(rotation.apparatuses).every(
            (apparatus) => Object.keys(apparatus.teams).length === 0
          );

          return (
            <TimelineRotationComponent
              key={rotationKey}
              rotation={rotation}
              date={rotationDate}
              onMoveUp={order === 0 ? undefined : onMoveUp}
              onMoveDown={
                order === Object.keys(stage.timeline).length - 1
                  ? undefined
                  : onMoveDown
              }
              onDelete={!isEmpty ? undefined : onDelete}
            />
          );
        } else if (rotation.type === 'pause') {
          return (
            <TimelinePauseComponent
              key={rotationKey}
              rotation={rotation}
              date={rotationDate}
              onMoveUp={order === 0 ? undefined : onMoveUp}
              onMoveDown={
                order === Object.keys(stage.timeline).length - 1
                  ? undefined
                  : onMoveDown
              }
              onDelete={onDelete}
            />
          );
        }
      })}

      <Stack gap={2}>
        <Typography variant="h6" component="h1">
          {format(nextRotationDate, 'HH:mm')} - Fin de la compétition
        </Typography>
        <Typography variant="body1">
          Durée totale de la compétition :{' '}
          {formatDuration(
            intervalToDuration({
              start: new Date(stage.timelineStartDate),
              end: nextRotationDate,
            }),
            {
              locale: fr,
            }
          )}
        </Typography>
      </Stack>
    </Stack>
  );
}

export const getServerSideProps = withAuthGala('timeline');
