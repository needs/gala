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
import { sortBy } from 'lodash';
import { withAuthGala } from '../../../lib/auth';
import TimelineRotation_ from '../../../components/TimelineRotation';
import TimelinePause_ from '../../../components/TimelinePause';
import { ArrowBack, ArrowForward } from '@mui/icons-material';
import { ReactNode } from 'react';

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

function ProgressContainer({
  stageName,
  children,
  onForward,
  onBackward,
  onReset,
}: {
  stageName: string;
  children?: ReactNode;
  onForward?: () => void;
  onBackward?: () => void;
  onReset?: () => void;
}) {
  return (
    <Stack gap={2}>
      <Stack
        direction={{ xs: 'column', md: 'row' }}
        gap={2}
        alignItems="center"
        justifyContent="space-between"
      >
        <Typography variant="h5">{stageName}</Typography>
        <Stack direction="row" gap={2}>
          <Button
            onDoubleClick={onReset}
            disabled={onReset === undefined}
            color="warning"
          >
            Remise à zéro
          </Button>
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
}: {
  stageName: string;
  onForward: () => void;
}) {
  return <ProgressContainer stageName={stageName} onForward={onForward} />;
}

function ProgressEnd({
  stageName,
  onBackward,
  onReset,
}: {
  stageName: string;
  onBackward: () => void;
  onReset: () => void;
}) {
  return (
    <ProgressContainer
      stageName={stageName}
      onBackward={onBackward}
      onReset={onReset}
    />
  );
}

function ProgressRotation({
  stageName,
  rotation,
  onForward,
  onBackward,
  onReset,
}: {
  stageName: string;
  rotation: TimelineRotation;
  onForward: () => void;
  onBackward: () => void;
  onReset: () => void;
}) {
  return (
    <ProgressContainer
      stageName={stageName}
      onForward={onForward}
      onBackward={onBackward}
      onReset={onReset}
    >
      <TimelineRotation_ rotation={rotation} readOnly={true} />
    </ProgressContainer>
  );
}

function ProgressPause({
  stageName,
  onForward,
  onBackward,
  onReset,
}: {
  stageName: string;
  onForward: () => void;
  onBackward: () => void;
  onReset: () => void;
}) {
  return (
    <ProgressContainer
      stageName={stageName}
      onForward={onForward}
      onBackward={onBackward}
      onReset={onReset}
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
  currentRotation: CurrentRotation;
  nextProgress: StageProgress | undefined;
  previousProgress: StageProgress | undefined;
};

function getCurrentRotation(stage: Stage): CurrentRotationInfo {
  const progress = stage.progress;

  if (progress === undefined || progress.rotationIndex < 0) {
    return {
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

    return {
      previousProgress,
      nextProgress: undefined,
      currentRotation: {
        type: 'end',
      },
    };
  }

  const currentRotation = rotations[progress.rotationIndex];
  const nextProgress = getNextProgress(currentRotation, progress);

  switch (currentRotation.type) {
    case 'pause':
      return {
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

        const { currentRotation, nextProgress, previousProgress } =
          getCurrentRotation(stage);

        const onForward = () => {
          stage.progress = nextProgress;
        };

        const onBackward = () => {
          stage.progress = previousProgress;
        };

        const onReset = () => {
          stage.progress = undefined;
        };

        switch (currentRotation.type) {
          case 'start':
            return (
              <ProgressStart
                key={stageKey}
                stageName={stage.name}
                onForward={onForward}
              />
            );
          case 'end':
            return (
              <ProgressEnd
                key={stageKey}
                stageName={stage.name}
                onBackward={onBackward}
                onReset={onReset}
              />
            );
          case 'rotation':
            return (
              <ProgressRotation
                key={stageKey}
                stageName={stage.name}
                rotation={currentRotation.rotation}
                onForward={onForward}
                onBackward={onBackward}
                onReset={onReset}
              />
            );
          case 'pause':
            return (
              <ProgressPause
                key={stageKey}
                stageName={stage.name}
                onForward={onForward}
                onBackward={onBackward}
                onReset={onReset}
              />
            );
        }
      })}
    </Stack>
  );
}

export const getServerSideProps = withAuthGala('progress');
