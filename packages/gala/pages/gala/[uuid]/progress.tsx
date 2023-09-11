import { Button, Stack, Typography } from '@mui/material';
import { useSyncedStore } from '@syncedstore/react';
import {
  ApparatusKey,
  Stage,
  TimelinePause,
  TimelineRotation,
  TimelineRotationApparatus,
  stageApparatuses,
  stageRotations,
  store,
} from '../../../lib/store';
import { withAuthGala } from '../../../lib/auth';
import TimelineRotation_ from '../../../components/TimelineRotation';
import TimelinePause_ from '../../../components/TimelinePause';
import { ArrowBack, ArrowForward } from '@mui/icons-material';
import { ReactNode } from 'react';
import {
  addMinutes,
  format,
  formatDuration,
  intervalToDuration,
} from 'date-fns';
import fr from 'date-fns/locale/fr';

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
}: {
  stageName: string;
  startDate?: Date;
  endDate?: Date;
  children?: ReactNode;
  onForward?: () => void;
  onBackward?: () => void;
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
        <Stack direction="row" gap={2} alignItems="baseline">
          <Typography variant="h5">{stageName}</Typography>
          <Typography variant="subtitle1">{rotationTime}</Typography>
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
  startDate,
}: {
  stageName: string;
  onForward: () => void;
  startDate?: Date;
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
  endDate,
}: {
  stageName: string;
  onBackward: () => void;
  endDate?: Date;
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
  apparatuses,
  stageName,
  startDate,
  endDate,
  rotation,
  onForward,
  onBackward,
}: {
  apparatuses: ApparatusKey[];
  stageName: string;
  startDate?: Date;
  endDate?: Date;
  rotation: TimelineRotation;
  onForward: () => void;
  onBackward: () => void;
}) {
  return (
    <ProgressContainer
      stageName={stageName}
      startDate={startDate}
      endDate={endDate}
      onForward={onForward}
      onBackward={onBackward}
    >
      <TimelineRotation_
        apparatuses={apparatuses}
        rotation={rotation}
        readOnly={true}
      />
    </ProgressContainer>
  );
}

function ProgressPause({
  stageName,
  startDate,
  endDate,
  onForward,
  onBackward,
}: {
  stageName: string;
  startDate?: Date;
  endDate?: Date;
  onForward: () => void;
  onBackward: () => void;
}) {
  return (
    <ProgressContainer
      stageName={stageName}
      startDate={startDate}
      endDate={endDate}
      onForward={onForward}
      onBackward={onBackward}
    >
      <TimelinePause_ />
    </ProgressContainer>
  );
}

type CurrentRotation =
  | {
      type: 'start';
    }
  | {
      type: 'end';
    }
  | {
      type: 'rotation';
      rotation: TimelineRotation;
    }
  | {
      type: 'pause';
      rotation: TimelinePause;
    };

type CurrentRotationInfo = {
  startDate: Date | undefined;
  endDate: Date | undefined;
  currentRotation: CurrentRotation;
};

function mod(n: number, m: number) {
  "use strict";
  return ((n % m) + m) % m;
};

function getCurrentRotation(stage: Stage): CurrentRotationInfo {
  const progress = stage.progress;
  const rotations = stageRotations(stage);
  const apparatuses = stageApparatuses(stage);

  let tmpProgress = 0;
  let startDate = new Date(stage.timelineStartDate);

  if (progress === undefined || progress < 0) {
    return {
      startDate,
      endDate: undefined,
      currentRotation: {
        type: 'start',
      },
    };
  }

  for (const rotation of rotations) {
    const endDate = addMinutes(startDate, rotation.durationInMinutes);

    if (rotation.type === 'pause') {
      tmpProgress += 1;

      if (progress < tmpProgress) {
        return {
          startDate,
          endDate,
          currentRotation: {
            type: 'pause',
            rotation,
          },
        };
      }
    } else if (rotation.type === 'rotation') {
      tmpProgress += apparatuses.length;
      console.log(JSON.parse(JSON.stringify(rotation)));

      if (progress < tmpProgress) {
        const offset = progress - tmpProgress + apparatuses.length;

        return {
          startDate,
          endDate,
          currentRotation: {
            type: 'rotation',
            rotation: {
              type: 'rotation',
              apparatuses: Object.fromEntries(
                apparatuses.map((apparatusKey, index) => [
                  apparatusKey,
                  rotation.apparatuses[apparatuses[mod(index - offset, apparatuses.length)]],
                ])
              ) as Record<ApparatusKey, TimelineRotationApparatus>,
              order: rotation.order,
              durationInMinutes: rotation.durationInMinutes,
            },
          },
        };
      }
    }

    startDate = endDate;
  }

  return {
    startDate: undefined,
    endDate: startDate,
    currentRotation: {
      type: 'end',
    },
  };
}

export default function ProgressPage() {
  const { stages } = useSyncedStore(store);

  return (
    <Stack direction="column" padding={4} gap={4}>
      {Object.entries(stages).map(([stageKey, stage]) => {
        if (stage === undefined) {
          return null;
        }

        const { currentRotation, startDate, endDate } =
          getCurrentRotation(stage);

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

        const apparatuses = stageApparatuses(stage);

        switch (currentRotation.type) {
          case 'start':
            return (
              <ProgressStart
                key={stageKey}
                startDate={startDate}
                stageName={stage.name}
                onForward={onForward}
              />
            );
          case 'end':
            return (
              <ProgressEnd
                key={stageKey}
                endDate={endDate}
                stageName={stage.name}
                onBackward={onBackward}
              />
            );
          case 'rotation':
            return (
              <ProgressRotation
                apparatuses={apparatuses}
                key={stageKey}
                startDate={startDate}
                endDate={endDate}
                stageName={stage.name}
                rotation={currentRotation.rotation}
                onForward={onForward}
                onBackward={onBackward}
              />
            );
          case 'pause':
            return (
              <ProgressPause
                key={stageKey}
                startDate={startDate}
                endDate={endDate}
                stageName={stage.name}
                onForward={onForward}
                onBackward={onBackward}
              />
            );
        }
      })}
    </Stack>
  );
}

export const getServerSideProps = withAuthGala('progress');
