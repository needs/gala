import { Alert, Button, Stack, Typography } from '@mui/material';
import {
  ApparatusKey,
  TimelineRotation,
  stageApparatuses,
  useGala,
} from '../../../lib/store';
import { withAuthGala } from '../../../lib/auth';
import TimelineRotation_ from '../../../components/TimelineRotation';
import TimelinePause_ from '../../../components/TimelinePause';
import { ArrowBack, ArrowForward } from '@mui/icons-material';
import { ReactNode } from 'react';
import {
  format,
  formatDuration,
  intervalToDuration,
} from 'date-fns';
import fr from 'date-fns/locale/fr';
import { isEmpty } from 'lodash';
import { ProgressGenericInfo, getCurrentRotation } from '../../../lib/progress';

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
  timeslotInfo,
  rotationInfo,
}: {
  stageName: string;
  startDate?: Date;
  endDate?: Date;
  children?: ReactNode;
  onForward?: () => void;
  onBackward?: () => void;
  timeslotInfo?: ProgressGenericInfo;
  rotationInfo?: ProgressGenericInfo;
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
            {timeslotInfo !== undefined && (
              <Typography variant="body2">
                Créneau {timeslotInfo.index}/{timeslotInfo.count}
              </Typography>
            )}
            {rotationInfo !== undefined && (
              <Typography variant="body2">
                Rotation {rotationInfo.index}/{rotationInfo.count}
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
  startDate,
  timeslotInfo,
  rotationInfo,
}: {
  stageName: string;
  onForward: () => void;
  startDate?: Date;
  timeslotInfo?: ProgressGenericInfo;
  rotationInfo?: ProgressGenericInfo;
}) {
  return (
    <ProgressContainer
      stageName={stageName}
      onForward={onForward}
      startDate={startDate}
      timeslotInfo={timeslotInfo}
      rotationInfo={rotationInfo}
    />
  );
}

function ProgressEnd({
  stageName,
  onBackward,
  endDate,
  timeslotInfo,
  rotationInfo,
}: {
  stageName: string;
  onBackward: () => void;
  endDate?: Date;
  timeslotInfo?: ProgressGenericInfo;
  rotationInfo?: ProgressGenericInfo;
}) {
  return (
    <ProgressContainer
      endDate={endDate}
      stageName={stageName}
      onBackward={onBackward}
      timeslotInfo={timeslotInfo}
      rotationInfo={rotationInfo}
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
  timeslotInfo,
  rotationInfo,
}: {
  apparatuses: ApparatusKey[];
  stageName: string;
  startDate?: Date;
  endDate?: Date;
  rotation: TimelineRotation;
  onForward: () => void;
  onBackward: () => void;
  timeslotInfo?: ProgressGenericInfo;
  rotationInfo?: ProgressGenericInfo;
}) {
  return (
    <ProgressContainer
      stageName={stageName}
      startDate={startDate}
      endDate={endDate}
      onForward={onForward}
      onBackward={onBackward}
      timeslotInfo={timeslotInfo}
      rotationInfo={rotationInfo}
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
  timeslotInfo,
  rotationInfo,
}: {
  stageName: string;
  startDate?: Date;
  endDate?: Date;
  onForward: () => void;
  onBackward: () => void;
  timeslotInfo?: ProgressGenericInfo;
  rotationInfo?: ProgressGenericInfo;
}) {
  return (
    <ProgressContainer
      stageName={stageName}
      startDate={startDate}
      endDate={endDate}
      onForward={onForward}
      onBackward={onBackward}
      timeslotInfo={timeslotInfo}
      rotationInfo={rotationInfo}
    >
      <TimelinePause_ />
    </ProgressContainer>
  );
}

export default function ProgressPage() {
  const { stages } = useGala();

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

        const {
          currentRotation,
          startDate,
          endDate,
          timeslotInfo,
          rotationInfo,
        } = getCurrentRotation(stage);

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
                timeslotInfo={timeslotInfo}
                rotationInfo={rotationInfo}
              />
            );
          case 'end':
            return (
              <ProgressEnd
                key={stageKey}
                endDate={endDate}
                stageName={stage.name}
                onBackward={onBackward}
                timeslotInfo={timeslotInfo}
                rotationInfo={rotationInfo}
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
                timeslotInfo={timeslotInfo}
                rotationInfo={rotationInfo}
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
                timeslotInfo={timeslotInfo}
                rotationInfo={rotationInfo}
              />
            );
        }
      })}
    </Stack>
  );
}

export const getServerSideProps = withAuthGala('progress');
