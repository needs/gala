import { addMinutes } from 'date-fns';
import {
  stageApparatuses,
  stageRotations,
} from './store';
import { ApparatusKey, Stage, TimelinePause, TimelineRotation, TimelineRotationApparatus } from '@tgym.fr/core';

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

export type ProgressGenericInfo = {
  index: number;
  count: number;
};

export type CurrentRotationInfo = {
  startDate: Date | undefined;
  endDate: Date | undefined;
  currentRotation: CurrentRotation;

  timeslotInfo?: ProgressGenericInfo;
  rotationInfo?: ProgressGenericInfo;
};

function mod(n: number, m: number) {
  'use strict';
  return ((n % m) + m) % m;
}

export function getCurrentRotation(stage: Stage): CurrentRotationInfo {
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

  let timeslotIndex = 1;

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

          timeslotInfo: {
            index: timeslotIndex,
            count: rotations.length,
          },
        };
      }
    } else if (rotation.type === 'rotation') {
      tmpProgress += apparatuses.length;

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
                  rotation.apparatuses[
                    apparatuses[mod(index - offset, apparatuses.length)]
                  ],
                ])
              ) as Record<ApparatusKey, TimelineRotationApparatus>,
              order: rotation.order,
              durationInMinutes: rotation.durationInMinutes,
            },
          },
          timeslotInfo: {
            index: timeslotIndex,
            count: rotations.length,
          },
          rotationInfo: {
            index: offset + 1,
            count: apparatuses.length,
          },
        };
      }
    }

    startDate = endDate;
    timeslotIndex += 1;
  }

  return {
    startDate: undefined,
    endDate: startDate,
    currentRotation: {
      type: 'end',
    },
  };
}
