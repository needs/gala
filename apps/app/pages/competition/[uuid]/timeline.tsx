import {
  Alert,
  Button,
  Divider,
  IconButton,
  InputAdornment,
  Stack,
  Tab,
  Tabs,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material';
import { withCompetition } from '../../../lib/auth';
import {
  Add,
  ArrowDownward,
  ArrowUpward,
  Delete,
  Remove,
} from '@mui/icons-material';
import { DateTimePicker } from '@mui/x-date-pickers';
import { uuidv4 } from 'lib0/random';
import {
  addMinutes,
  format,
  formatDuration,
  intervalToDuration,
} from 'date-fns';
import { ReactNode, useState } from 'react';
import { sortBy } from 'lodash';
import TimelineRotation_ from '../../../components/TimelineRotation';
import TimelinePause_ from '../../../components/TimelinePause';
import fr from 'date-fns/locale/fr';
import { Stage, TimelinePause, TimelineRotation } from '@tgym.fr/core';
import { useCompetition } from '../../../components/StoreProvider';
import { getRotationApparatuses } from '../../../lib/store';

function TimelineRotationContainer({
  children,
  rotation,
  date,
  headerComponent,
  onMoveUp,
  onMoveDown,
  onDelete,
}: {
  children: ReactNode;
  rotation: TimelineRotation | TimelinePause;
  date: Date;
  headerComponent?: ReactNode;
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
          {headerComponent}
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
  stage,
  rotation,
  date,
  onMoveUp,
  onMoveDown,
  onDelete,
}: {
  stage: Stage;
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
      headerComponent={
        !('rest' in rotation.apparatuses) ? (
          <Button
            variant="text"
            startIcon={<Add />}
            onClick={() => {
              rotation.apparatuses['rest'] = {
                teams: {},
              };
            }}
          >
            Repos
          </Button>
        ) : (
          <Tooltip title="Double cliquer pour supprimer le repos">
            <Button
              variant="text"
              color="warning"
              startIcon={<Remove />}
              onDoubleClick={() => {
                delete rotation.apparatuses['rest'];
              }}
            >
              Repos
            </Button>
          </Tooltip>
        )
      }
      onMoveUp={onMoveUp}
      onMoveDown={onMoveDown}
      onDelete={onDelete}
    >
      <TimelineRotation_ stage={stage} rotation={rotation} />
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
  const { stages } = useCompetition();

  const [selectedStageKey, setSelectedStageKey] = useState<string | undefined>(
    Object.keys(stages).at(0)
  );

  if (selectedStageKey === undefined) {
    return (
      <Alert severity="info" sx={{ margin: 4 }}>
        {`Aucun plateau n'a été créé pour cette compétition`}
      </Alert>
    );
  }

  const selectedStage = stages[selectedStageKey];

  if (selectedStage === undefined) {
    return (
      <Alert
        severity="warning"
        sx={{ margin: 4 }}
        action={
          <Button
            color="inherit"
            size="small"
            onClick={() => {
              setSelectedStageKey(Object.keys(stages).at(0));
            }}
          >
            Précédent
          </Button>
        }
      >
        {`Le plateau sélectionné n'existe plus`}
      </Alert>
    );
  }

  const rotations = sortBy(
    Object.entries(selectedStage.timeline),
    (entry) => entry[1].order
  );

  let nextRotationDate = new Date(selectedStage.timelineStartDate);

  return (
    <Stack direction="column" padding={4} gap={4}>
      <Stack direction="column">
        <Stack
          direction="row"
          gap={2}
          alignItems="center"
          justifyContent="space-between"
        >
          <Tabs
            value={selectedStageKey}
            onChange={(event, newValue) => {
              setSelectedStageKey(newValue);
            }}
            variant="scrollable"
            scrollButtons
            allowScrollButtonsMobile
          >
            {Object.entries(stages).map(
              ([stageKey, stage]) =>
                stage !== undefined && (
                  <Tab key={stageKey} label={stage.name} value={stageKey} />
                )
            )}
          </Tabs>
          <Stack direction="row" gap={2} py={2}>
            <Button
              variant="outlined"
              startIcon={<Add />}
              onClick={() => {
                Object.values(selectedStage.timeline).forEach((rotation) => {
                  rotation.order += 1;
                });

                selectedStage.timeline[uuidv4()] = {
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
                Object.values(selectedStage.timeline).forEach((rotation) => {
                  rotation.order += 1;
                });

                selectedStage.timeline[uuidv4()] = {
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
        <Divider />
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
          value={new Date(selectedStage.timelineStartDate)}
          onChange={(date) => {
            if (date !== null) {
              selectedStage.timelineStartDate = date.toString();
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
          delete selectedStage.timeline[rotationKey];
        };

        if (rotation.type === 'rotation') {
          const rotationApparatuses = getRotationApparatuses(
            selectedStage,
            rotation
          );

          const isEmpty = rotationApparatuses.every((apparatusKey) => {
            const apparatus = rotation.apparatuses[apparatusKey];
            return (
              apparatus === undefined ||
              Object.keys(apparatus.teams).length === 0
            );
          });

          return (
            <TimelineRotationComponent
              key={rotationKey}
              stage={selectedStage}
              rotation={rotation}
              date={rotationDate}
              onMoveUp={order === 0 ? undefined : onMoveUp}
              onMoveDown={
                order === Object.keys(selectedStage.timeline).length - 1
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
                order === Object.keys(selectedStage.timeline).length - 1
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
              start: new Date(selectedStage.timelineStartDate),
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

export const getServerSideProps = withCompetition('timeline');
