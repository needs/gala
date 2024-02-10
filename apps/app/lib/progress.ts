import { addMinutes } from 'date-fns';
import {
  getRotationApparatuses,
  stageRotations,
} from './store';
import { Stage, TimelinePause, TimelineRotation } from '@tgym.fr/core';

export type ScheduledRotation =
  {
    type: 'start';
    startDate: Date;
  }
  | {
    type: 'end';
    endDate: Date;
  }
  | {
    type: 'rotation';
    startDate: Date;
    endDate: Date;
    rotation: TimelineRotation;
    timelineIndex: number;
    timelineLength: number;
    rotationIndex: number;
    rotationLength: number;
  }
  | {
    type: 'pause';
    startDate: Date;
    endDate: Date;
    durationInMinutes: TimelinePause["durationInMinutes"];
    timelineIndex: number;
    timelineLength: number;
  };

export function computeScheduledRotations(stage: Stage): ScheduledRotation[] {
  const rotations = stageRotations(stage);

  let startDate: Date, endDate = new Date(stage.timelineStartDate);

  const scheduledRotations: ScheduledRotation[] = [
    {
      type: 'start',
      startDate: endDate,
    }
  ]

  scheduledRotations.push(...rotations.flatMap((rotation, timelineIndex): (ScheduledRotation[]) => {
    startDate = endDate;
    endDate = addMinutes(startDate, rotation.durationInMinutes);

    if (rotation.type === 'pause') {
      return [{
        type: 'pause',
        startDate,
        endDate,
        timelineIndex,
        timelineLength: rotations.length,
        durationInMinutes: rotation.durationInMinutes,
      }];
    } else {
      const rotationApparatuses = getRotationApparatuses(stage, rotation);

      return rotationApparatuses.map((apparatusKey, rotationIndex) => {
        const rotationStartDate = addMinutes(startDate, (rotation.durationInMinutes / rotationApparatuses.length) * rotationIndex);
        const rotationEndDate = addMinutes(startDate, (rotation.durationInMinutes / rotationApparatuses.length) * (rotationIndex + 1));

        return {
          type: 'rotation',
          rotation: {
            ...rotation,
            apparatuses: Object.fromEntries(
              rotationApparatuses.map((apparatusKey, apparatusIndex) => [
                apparatusKey,
                { ...rotation.apparatuses[
                rotationApparatuses[mod(apparatusIndex - rotationIndex, rotationApparatuses.length)]
                ]},
              ])
            ),
            durationInMinutes: rotation.durationInMinutes / rotationApparatuses.length,
          },
          startDate: rotationStartDate,
          endDate: rotationEndDate,
          timelineIndex,
          timelineLength: rotations.length,
          rotationIndex,
          rotationLength: rotationApparatuses.length,
        };
      });
    }
  }));

  scheduledRotations.push({
    type: 'end',
    endDate,
  });

  return scheduledRotations;
}

function mod(n: number, m: number) {
  'use strict';
  return ((n % m) + m) % m;
}

export function getCurrentScheduledRotation(stage: Stage): ScheduledRotation {
  const scheduledRotations = computeScheduledRotations(stage);

  if (stage.progress === undefined || stage.progress < 0) {
    return scheduledRotations[0];
  } else if (stage.progress >= scheduledRotations.length - 1) {
    return scheduledRotations[scheduledRotations.length - 1];
  } else {
    return scheduledRotations[Math.floor(stage.progress)];
  }
}
