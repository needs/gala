import { Alert, Button, Stack, Typography } from '@mui/material';
import { withCompetition } from '../../../lib/auth';
import ScheduleEventRotationComponent from '../../../components/ScheduleEventRotation';
import ScheduleEventPauseComponent from '../../../components/ScheduleEventPause';
import { ArrowBack, ArrowForward } from '@mui/icons-material';
import { ReactNode } from 'react';
import { format, formatDuration, intervalToDuration } from 'date-fns';
import fr from 'date-fns/locale/fr';
import { isEmpty } from 'lodash';
import { TimelineEvent, getCurrentTimelineEvent } from '../../../lib/progress';
import { useCompetition } from '../../../components/StoreProvider';

export function formatRotationTime(startDate?: Date, endDate?: Date) {
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
  scheduleName,
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
  scheduleName: string;
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
            <Typography variant="h5">{scheduleName}</Typography>
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
  scheduleName,
  onForward,
  scheduledRotation: {
    startDate,
  },
}: {
  scheduleName: string;
  onForward: () => void;
  scheduledRotation: Extract<TimelineEvent, {type: 'start'}>;
}) {
  return (
    <ProgressContainer
      scheduleName={scheduleName}
      onForward={onForward}
      startDate={startDate}
    />
  );
}

function ProgressEnd({
  scheduleName,
  onBackward,
  scheduledRotation: {
    endDate,
  },
}: {
  scheduleName: string;
  onBackward: () => void;
  scheduledRotation: Extract<TimelineEvent, {type: 'end'}>;
}) {
  return (
    <ProgressContainer
      endDate={endDate}
      scheduleName={scheduleName}
      onBackward={onBackward}
    />
  );
}

function ProgressRotation({
  scheduleName,
  onForward,
  onBackward,
  scheduledRotation: {
    startDate,
    endDate,
    timelineIndex,
    timelineLength,
    rotationIndex,
    rotationLength,
    apparatuses
  },
}: {
  scheduleName: string;
  onForward: () => void;
  onBackward: () => void;
  scheduledRotation: Extract<TimelineEvent, {type: 'rotation'}>;
}) {
  return (
    <ProgressContainer
      scheduleName={scheduleName}
      startDate={startDate}
      endDate={endDate}
      onForward={onForward}
      onBackward={onBackward}
      timelineIndex={timelineIndex}
      timelineLength={timelineLength}
      rotationIndex={rotationIndex}
      rotationLength={rotationLength}
    >
      <ScheduleEventRotationComponent
        apparatuses={apparatuses.map((apparatus, index) => ({
          apparatus: apparatus,
          apparatusUuid: "apparatus-" + index.toString(),
        }))}
        readOnly={true}
      />
    </ProgressContainer>
  );
}

function ProgressPause({
  scheduleName,
  onForward,
  onBackward,
  scheduledRotation: {
    startDate,
    endDate,
    timelineIndex,
    timelineLength,
  },
}: {
  scheduleName: string;
  onForward: () => void;
  onBackward: () => void;
  scheduledRotation: Extract<TimelineEvent, {type: 'pause'}>;
}) {
  return (
    <ProgressContainer
      scheduleName={scheduleName}
      startDate={startDate}
      endDate={endDate}
      onForward={onForward}
      onBackward={onBackward}
      timelineIndex={timelineIndex}
      timelineLength={timelineLength}
    >
      <ScheduleEventPauseComponent />
    </ProgressContainer>
  );
}

export default function ProgressPage() {
  const { schedules } = useCompetition();

  if (isEmpty(schedules)) {
    return (
      <Alert severity="info" sx={{ margin: 4 }}>
        {`Aucun échéancier n'a été créé pour cette compétition`}
      </Alert>
    );
  }

  return (
    <Stack direction="column" padding={4} gap={4}>
      {Object.entries(schedules).map(([scheduleUuid, schedule]) => {
        const currentScheduledRotation = getCurrentTimelineEvent(schedule);

        const onForward = () => {
          if (schedule.progress === undefined) {
            schedule.progress = 0;
          } else {
            schedule.progress += 1;
          }
        };

        const onBackward = () => {
          if (schedule.progress === 0) {
            schedule.progress = undefined;
          } else if (schedule.progress !== undefined) {
            schedule.progress -= 1;
          }
        };

        switch (currentScheduledRotation.type) {
          case 'start':
            return (
              <ProgressStart
                key={scheduleUuid}
                scheduledRotation={currentScheduledRotation}
                scheduleName={schedule.name}
                onForward={onForward}
              />
            );
          case 'end':
            return (
              <ProgressEnd
                key={scheduleUuid}
                scheduledRotation={currentScheduledRotation}
                scheduleName={schedule.name}
                onBackward={onBackward}
              />
            );
          case 'rotation':
            return (
              <ProgressRotation
                key={scheduleUuid}
                scheduleName={schedule.name}
                scheduledRotation={currentScheduledRotation}
                onForward={onForward}
                onBackward={onBackward}
              />
            );
          case 'pause':
            return (
              <ProgressPause
                key={scheduleUuid}
                scheduleName={schedule.name}
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

export const getServerSideProps = withCompetition('progress');
