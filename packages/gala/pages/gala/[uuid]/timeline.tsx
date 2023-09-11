import {
  Box,
  Button,
  Divider,
  IconButton,
  InputAdornment,
  Stack,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material';
import { withAuthGala } from '../../../lib/auth';
import { Add, ArrowDownward, ArrowUpward, Delete } from '@mui/icons-material';
import { DateTimePicker } from '@mui/x-date-pickers';
import {
  ApparatusKey,
  Stage,
  TimelinePause,
  TimelineRotation,
  stageApparatuses,
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
import { ReactNode } from 'react';
import { sortBy } from 'lodash';
import TimelineRotation_ from '../../../components/TimelineRotation';
import TimelinePause_ from '../../../components/TimelinePause';
import fr from 'date-fns/locale/fr';

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
  apparatuses,
  rotation,
  date,
  onMoveUp,
  onMoveDown,
  onDelete,
}: {
  apparatuses: ApparatusKey[];
  rotation: TimelineRotation;
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
      <TimelineRotation_ apparatuses={apparatuses} rotation={rotation} />
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
      <TimelinePause_ />
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
            apparatuses: {},
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

  const apparatuses = stageApparatuses(stage);

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
                apparatuses: {},
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
          rotation.durationInMinutes || 0
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
          const isEmpty = apparatuses.every((apparatusKey) => {
            const apparatus = rotation.apparatuses[apparatusKey];
            return apparatus === undefined || Object.keys(apparatus.teams).length === 0;
          });

          return (
            <TimelineRotationComponent
              key={rotationKey}
              apparatuses={apparatuses}
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
