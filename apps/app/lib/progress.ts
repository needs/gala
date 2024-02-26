import { addMinutes } from 'date-fns';
import {
  getRotationApparatuses, getScheduleEvents, rotateApparatusesOnce,
} from './store';
import { Schedule, ScheduleEventPause, ScheduleEventRotation, ScheduleEventRotationApparatus } from '@tgym.fr/core';

export type TimelineEvent =
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
    event: ScheduleEventRotation;
    timelineIndex: number;
    timelineLength: number;
    rotationIndex: number;
    rotationLength: number;
    apparatuses: ScheduleEventRotationApparatus[];
  }
  | {
    type: 'pause';
    startDate: Date;
    endDate: Date;
    event: ScheduleEventPause;
    timelineIndex: number;
    timelineLength: number;
  };

export function computeTimeline(schedule: Schedule): TimelineEvent[] {
  let startDate: Date, endDate = new Date(schedule.startDate);

  const timeline: TimelineEvent[] = [
    {
      type: 'start',
      startDate: endDate,
    }
  ]

  const scheduleEvents = getScheduleEvents(schedule);

  scheduleEvents.forEach((({ scheduleEvent }, timelineIndex) => {
    startDate = endDate;
    endDate = addMinutes(startDate, scheduleEvent.durationInMinutes);

    if (scheduleEvent.type === 'pause') {
      timeline.push({
        type: 'pause',
        startDate,
        endDate,
        timelineIndex,
        timelineLength: scheduleEvents.length,
        event: scheduleEvent,
      });
    } else {
      let rotationApparatuses = getRotationApparatuses(scheduleEvent).map(({ apparatus }) => apparatus);

      for (let rotationIndex = 0; rotationIndex < rotationApparatuses.length; rotationIndex++) {
        const rotationStartDate = addMinutes(startDate, (scheduleEvent.durationInMinutes / rotationApparatuses.length) * rotationIndex);
        const rotationEndDate = addMinutes(startDate, (scheduleEvent.durationInMinutes / rotationApparatuses.length) * (rotationIndex + 1));

        timeline.push({
          type: 'rotation',
          startDate: rotationStartDate,
          endDate: rotationEndDate,
          event: scheduleEvent,
          timelineIndex,
          timelineLength: scheduleEvents.length,
          rotationIndex,
          rotationLength: rotationApparatuses.length,
          apparatuses: rotationApparatuses,
        });

        rotationApparatuses = rotateApparatusesOnce(rotationApparatuses);
      }
    }
  }));

  timeline.push({
    type: 'end',
    endDate,
  });

  return timeline;
}

export function getCurrentTimelineEvent(schedule: Schedule): TimelineEvent {
  const timeline = computeTimeline(schedule);

  if (schedule.progress === undefined || schedule.progress < 0) {
    return timeline[0];
  } else if (schedule.progress >= timeline.length - 1) {
    return timeline[timeline.length - 1];
  } else {
    return timeline[Math.floor(schedule.progress)];
  }
}
