import { Button, Stack, Typography } from '@mui/material';
import { useSyncedStore } from '@syncedstore/react';
import {
  ApparatusKey,
  Stage,
  StageProgress,
  TimelinePause,
  TimelineRotation,
  TimelineRotationApparatus,
  store,
} from '../../../lib/store';
import { sortBy, sum } from 'lodash';
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

function rotationLastApparatusIndex(
  rotation: TimelineRotation | TimelinePause
): number {
  switch (rotation.type) {
    case 'pause':
      return 0;
    case 'rotation':
      return Object.keys(rotation.apparatuses).length - 1;
  }
}

function getNextProgress(
  currentRotation: TimelineRotation | TimelinePause | undefined,
  progress: StageProgress
) {
  if (
    currentRotation === undefined ||
    rotationLastApparatusIndex(currentRotation) === progress.apparatusIndex
  ) {
    return {
      rotationIndex: progress.rotationIndex + 1,
      apparatusIndex: 0,
    };
  } else {
    return {
      rotationIndex: progress.rotationIndex,
      apparatusIndex: progress.apparatusIndex + 1,
    };
  }
}

function getPreviousProgress(
  previousRotation: TimelineRotation | TimelinePause | undefined,
  progress: StageProgress
) {
  if (progress.apparatusIndex === 0) {
    if (previousRotation === undefined) {
      return undefined;
    }
    return {
      rotationIndex: progress.rotationIndex - 1,
      apparatusIndex: rotationLastApparatusIndex(previousRotation),
    };
  } else {
    return {
      rotationIndex: progress.rotationIndex,
      apparatusIndex: progress.apparatusIndex - 1,
    };
  }
}

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

    if (now > startDate) {
      return `Commencé il y a ${remainingTime}`;
    } else {
      return `Commence dans ${remainingTime}`;
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
  stageName,
  startDate,
  endDate,
  rotation,
  onForward,
  onBackward,
}: {
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
      <TimelineRotation_ rotation={rotation} readOnly={true} />
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
  nextProgress: StageProgress | undefined;
  previousProgress: StageProgress | undefined;
};

function getCurrentRotation(stage: Stage): CurrentRotationInfo {
  const progress = stage.progress;

  const timelineStartDate = new Date(stage.timelineStartDate);

  if (progress === undefined || progress.rotationIndex < 0) {
    return {
      startDate: timelineStartDate,
      endDate: undefined,
      previousProgress: undefined,
      nextProgress: {
        rotationIndex: 0,
        apparatusIndex: 0,
      },
      currentRotation: {
        type: 'start',
      },
    };
  }

  const rotations = sortBy(
    Object.values(stage.timeline),
    (rotation) => rotation.order
  );

  const previousRotation =
    progress.rotationIndex === 0
      ? undefined
      : rotations.at(progress.rotationIndex - 1);

  const previousProgress = getPreviousProgress(previousRotation, progress);

  if (progress.rotationIndex >= rotations.length) {
    const previousRotation =
      progress.rotationIndex === 0
        ? undefined
        : rotations[progress.rotationIndex - 1];

    const previousProgress = getPreviousProgress(previousRotation, progress);
    const endDate = addMinutes(
      timelineStartDate,
      sum(
        Object.values(stage.timeline).map(
          (rotation) => rotation.durationInMinutes
        )
      )
    );

    return {
      startDate: undefined,
      endDate,
      previousProgress,
      nextProgress: undefined,
      currentRotation: {
        type: 'end',
      },
    };
  }

  const currentRotation = rotations[progress.rotationIndex];

  const startDate = addMinutes(
    timelineStartDate,
    sum(
      Object.values(stage.timeline)
        .slice(0, progress.rotationIndex)
        .map((rotation) => rotation.durationInMinutes)
    )
  );
  const endDate = addMinutes(startDate, currentRotation.durationInMinutes);

  const nextProgress = getNextProgress(currentRotation, progress);

  switch (currentRotation.type) {
    case 'pause':
      return {
        startDate,
        endDate,
        previousProgress,
        nextProgress,
        currentRotation: {
          type: 'pause',
          rotation: currentRotation,
        },
      };
    case 'rotation':
      const apparatuses = Object.entries(currentRotation.apparatuses);

      return {
        startDate,
        endDate,
        previousProgress,
        nextProgress,
        currentRotation: {
          type: 'rotation',
          rotation: {
            type: 'rotation',
            apparatuses: Object.fromEntries(
              apparatuses.map(([apparatusKey], index) => [
                apparatusKey,
                apparatuses.at(index - progress.apparatusIndex)?.at(1),
              ])
            ) as Record<ApparatusKey, TimelineRotationApparatus>,
            order: currentRotation.order,
            durationInMinutes: currentRotation.durationInMinutes,
          },
        },
      };
  }
}

export default function ProgressPage() {
  const { stages } = useSyncedStore(store);

  return (
    <Stack direction="column" padding={4} gap={4}>
      {Object.entries(stages).map(([stageKey, stage]) => {
        if (stage === undefined) {
          return null;
        }

        const {
          currentRotation,
          nextProgress,
          previousProgress,
          startDate,
          endDate,
        } = getCurrentRotation(stage);

        const onForward = () => {
          stage.progress = nextProgress;
        };

        const onBackward = () => {
          stage.progress = previousProgress;
        };

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
