import { Alert, Button, Stack, Typography } from '@mui/material';
import { withAuthCompetition } from '../../../lib/auth';
import TimelineRotation_ from '../../../components/TimelineRotation';
import TimelinePause_ from '../../../components/TimelinePause';
import { ArrowBack, ArrowForward } from '@mui/icons-material';
import { ReactNode } from 'react';
import { format, formatDuration, intervalToDuration } from 'date-fns';
import fr from 'date-fns/locale/fr';
import { isEmpty } from 'lodash';
import { ScheduledRotation, getCurrentScheduledRotation } from '../../../lib/progress';
import { Stage } from '@tgym.fr/core';
import { useCompetition } from '../../../components/StoreProvider';

function formatRotationTime(startDate?: Date, endDate?: Date) {
  if (startDate === undefined && endDate === undefined) {
    return '';
  } else if (startDate !== undefined && endDate === undefined) {
    const now = new Date();

    const remainingTime = formatDuration(
      intervalToDuration({ start: now, end: startDate }),
      {
        locale: fr,
        format: ['years', 'months', 'days', 'hours', 'minutes'],
      }
    );

    if (now > startDate && remainingTime !== '') {
      return `Aurait dû commencer il y a ${remainingTime}`;
    } else if (remainingTime !== '') {
      return `Commence dans ${remainingTime}`;
    } else {
      return `Commence maintenant`;
    }
  } else if (startDate === undefined && endDate !== undefined) {
    return `Échéancier terminé`;
  } else if (startDate !== undefined && endDate !== undefined) {
    return `${format(startDate, 'HH:mm')} → ${format(endDate, 'HH:mm')}`;
  }
}

function ProgressContainer({
  stageName,
  startDate,
  endDate,
  children,
  onForward,
  onBackward,
  timelineIndex,
  timelineLength,
  rotationIndex,
  rotationLength,
}: {
  stageName: string;
  startDate?: Date;
  endDate?: Date;
  children?: ReactNode;
  onForward?: () => void;
  onBackward?: () => void;
  timelineIndex?: number;
  timelineLength?: number;
  rotationIndex?: number;
  rotationLength?: number;
}) {
  const rotationTime = formatRotationTime(startDate, endDate);

  return (
    <Stack gap={2}>
      <Stack
        direction={{ xs: 'column', md: 'row' }}
        gap={2}
        alignItems="center"
        justifyContent="space-between"
      >
        <Stack>
          <Stack direction="row" gap={2} alignItems="baseline">
            <Typography variant="h5">{stageName}</Typography>
          </Stack>
          <Stack direction="row" gap={2} alignItems="baseline">
            {timelineIndex !== undefined && timelineLength !== undefined && (
              <Typography variant="body2">
                Créneau {timelineIndex + 1}/{timelineLength}
              </Typography>
            )}
            {rotationIndex !== undefined && rotationLength !== undefined && (
              <Typography variant="body2">
                Rotation {rotationIndex + 1}/{rotationLength}
              </Typography>
            )}
            <Typography variant="body2">{rotationTime}</Typography>
          </Stack>
        </Stack>
        <Stack direction="row" gap={2}>
          <Button
            onClick={onBackward}
            disabled={onBackward === undefined}
            variant="outlined"
            startIcon={<ArrowBack />}
          >
            Reculer
          </Button>
          <Button
            onClick={onForward}
            disabled={onForward === undefined}
            variant="contained"
            endIcon={<ArrowForward />}
          >
            Avancer
          </Button>
        </Stack>
      </Stack>

      {children}
    </Stack>
  );
}

function ProgressStart({
  stageName,
  onForward,
  scheduledRotation: {
    startDate,
  },
}: {
  stageName: string;
  onForward: () => void;
  scheduledRotation: Extract<ScheduledRotation, {type: 'start'}>;
}) {
  return (
    <ProgressContainer
      stageName={stageName}
      onForward={onForward}
      startDate={startDate}
    />
  );
}

function ProgressEnd({
  stageName,
  onBackward,
  scheduledRotation: {
    endDate,
  },
}: {
  stageName: string;
  onBackward: () => void;
  scheduledRotation: Extract<ScheduledRotation, {type: 'end'}>;
}) {
  return (
    <ProgressContainer
      endDate={endDate}
      stageName={stageName}
      onBackward={onBackward}
    />
  );
}

function ProgressRotation({
  stage,
  stageName,
  onForward,
  onBackward,
  scheduledRotation: {
    startDate,
    endDate,
    rotation,
    timelineIndex,
    timelineLength,
    rotationIndex,
    rotationLength,
  },
}: {
  stage: Stage;
  stageName: string;
  onForward: () => void;
  onBackward: () => void;
  scheduledRotation: Extract<ScheduledRotation, {type: 'rotation'}>;
}) {
  return (
    <ProgressContainer
      stageName={stageName}
      startDate={startDate}
      endDate={endDate}
      onForward={onForward}
      onBackward={onBackward}
      timelineIndex={timelineIndex}
      timelineLength={timelineLength}
      rotationIndex={rotationIndex}
      rotationLength={rotationLength}
    >
      <TimelineRotation_
        stage={stage}
        rotation={rotation}
        readOnly={true}
      />
    </ProgressContainer>
  );
}

function ProgressPause({
  stageName,
  onForward,
  onBackward,
  scheduledRotation: {
    startDate,
    endDate,
    timelineIndex,
    timelineLength,
  },
}: {
  stageName: string;
  onForward: () => void;
  onBackward: () => void;
  scheduledRotation: Extract<ScheduledRotation, {type: 'pause'}>;
}) {
  return (
    <ProgressContainer
      stageName={stageName}
      startDate={startDate}
      endDate={endDate}
      onForward={onForward}
      onBackward={onBackward}
      timelineIndex={timelineIndex}
      timelineLength={timelineLength}
    >
      <TimelinePause_ />
    </ProgressContainer>
  );
}

export default function ProgressPage() {
  const { stages } = useCompetition();

  if (isEmpty(stages)) {
    return (
      <Alert severity="info" sx={{ margin: 4 }}>
        {`Aucun plateau n'a été créé pour cette compétition`}
      </Alert>
    );
  }

  return (
    <Stack direction="column" padding={4} gap={4}>
      {Object.entries(stages).map(([stageKey, stage]) => {
        if (stage === undefined) {
          return null;
        }

        const currentScheduledRotation = getCurrentScheduledRotation(stage);

        const onForward = () => {
          if (stage.progress === undefined) {
            stage.progress = 0;
          } else {
            stage.progress += 1;
          }
        };

        const onBackward = () => {
          if (stage.progress === 0) {
            stage.progress = undefined;
          } else if (stage.progress !== undefined) {
            stage.progress -= 1;
          }
        };

        switch (currentScheduledRotation.type) {
          case 'start':
            return (
              <ProgressStart
                key={stageKey}
                scheduledRotation={currentScheduledRotation}
                stageName={stage.name}
                onForward={onForward}
              />
            );
          case 'end':
            return (
              <ProgressEnd
                key={stageKey}
                scheduledRotation={currentScheduledRotation}
                stageName={stage.name}
                onBackward={onBackward}
              />
            );
          case 'rotation':
            return (
              <ProgressRotation
                stage={stage}
                key={stageKey}
                stageName={stage.name}
                scheduledRotation={currentScheduledRotation}
                onForward={onForward}
                onBackward={onBackward}
              />
            );
          case 'pause':
            return (
              <ProgressPause
                key={stageKey}
                stageName={stage.name}
                onForward={onForward}
                onBackward={onBackward}
                scheduledRotation={currentScheduledRotation}
              />
            );
        }
      })}
    </Stack>
  );
}

export const getServerSideProps = withAuthCompetition('progress');
