import {
  Autocomplete,
  Button,
  Divider,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import Loading from '../../components/Loading';
import Image from 'next/image';
import { produce } from 'immer';
import { apparatuses } from '../../lib/apparatus';
import { useSyncedStore } from '@syncedstore/react';
import { ApparatusKey, Progress, store } from '../../lib/store';

function mod(n: number, m: number) {
  return ((n % m) + m) % m;
}

function rotateLeft(progress: Progress) {
  const apparatusKeys = Object.keys(apparatuses) as ApparatusKey[];

  return produce(progress, (draft) => {
    apparatusKeys.forEach((apparatusKey, index) => {
      const previousApparatusKey =
        apparatusKeys[mod(index + 1, apparatusKeys.length)];

      if (previousApparatusKey in progress) {
        draft[apparatusKey] = progress[previousApparatusKey];
      } else {
        delete draft[apparatusKey];
      }
    });
  });
}

function rotateRight(progress: Progress) {
  const apparatusKeys = Object.keys(apparatuses) as ApparatusKey[];

  return produce(progress, (draft) => {
    apparatusKeys.forEach((apparatusKey, index) => {
      const previousApparatusKey =
        apparatusKeys[mod(index - 1, apparatusKeys.length)];

      if (previousApparatusKey in progress) {
        draft[apparatusKey] = progress[previousApparatusKey];
      } else {
        delete draft[apparatusKey];
      }
    });
  });
}

function Stage({
  stageName,
  stageKey,
}: {
  stageName: string;
  stageKey: 'stage1' | 'stage2';
}) {
  const { teams, progresses } = useSyncedStore(store)
  const progress = progresses[stageKey];

  const updateProgress = (progress: Progress) => {
    progresses[stageKey] = progress;
  };

  if (teams === undefined || progress === undefined) {
    return <Loading />;
  }

  return (
    <Stack direction="column" padding={4}>
      <Stack
        direction={{ xs: 'column', md: 'row' }}
        gap={2}
        alignItems="center"
      >
        <Typography variant="h4" paddingY={{ xs: 0, md: 3 }} paddingX={1}>
          {stageName}
        </Typography>
        <Button onDoubleClick={() => updateProgress({})} color="warning">
          Remise à zéro
        </Button>
        <Button onClick={() => updateProgress(rotateLeft(progress))}>
          Rotation arrière
        </Button>
        <Button onClick={() => updateProgress(rotateRight(progress))}>
          Rotation avant
        </Button>
      </Stack>
      <Stack gap={2} direction="column" divider={<Divider />}>
        {Object.entries(apparatuses).map(([key, { name, iconPath }]) => (
          <Stack
            key={key}
            direction={{ xs: 'column', md: 'row' }}
            gap={2}
            alignItems="center"
          >
            <Stack direction="row" gap={2} alignItems="center" minWidth={300}>
              <Image src={iconPath} alt="Vault" width={24} height={24} />
              <Typography variant="h6">{name}</Typography>
            </Stack>
            <Autocomplete
              disablePortal
              autoHighlight
              size="small"
              options={Object.entries(teams).map(([teamKey, team]) => ({
                label: team?.name,
                teamKey,
              }))}
              value={
                progress[key as ApparatusKey]
                  ? {
                      teamKey: progress[key as ApparatusKey],
                      label: teams[progress[key as ApparatusKey] ?? '']?.name,
                    }
                  : null
              }
              onChange={(event, newValue) => {
                if (newValue) {
                  updateProgress(
                    produce(progress, (draft) => {
                      draft[key as ApparatusKey] = newValue.teamKey;
                    })
                  );
                } else {
                  updateProgress(
                    produce(progress, (draft) => {
                      delete draft[key as ApparatusKey];
                    })
                  );
                }
              }}
              sx={{ width: 300 }}
              renderInput={(params) => <TextField {...params} label="Équipe" />}
            />
          </Stack>
        ))}
      </Stack>
    </Stack>
  );
}

export default function ProgressPage() {
  return (
    <Stack direction="column">
      <Stage stageName="Plateau A" stageKey="stage1" />
      <Stage stageName="Plateau B" stageKey="stage2" />
    </Stack>
  );
}
