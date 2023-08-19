import {
  Autocomplete,
  Button,
  Divider,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import Image from 'next/image';
import { apparatuses } from '../../lib/apparatus';
import { useSyncedStore } from '@syncedstore/react';
import { ApparatusKey, Progress, store } from '../../lib/store';
import { useEffect } from 'react';
import { isEmpty } from 'lodash';

const apparatusKeys = Object.keys(apparatuses) as ApparatusKey[];

function rotateLeft(progress: Progress) {
  const values = apparatusKeys.map((apparatusKey) => progress[apparatusKey]);
  values.push(values.shift());
  apparatusKeys.forEach((apparatusKey, index) => progress[apparatusKey] = values[index]);
}

function rotateRight(progress: Progress) {
  const values = apparatusKeys.map((apparatusKey) => progress[apparatusKey]);
  values.unshift(values.pop());
  apparatusKeys.forEach((apparatusKey, index) => progress[apparatusKey] = values[index]);
}

function Stage({
  stageName,
  progress,
}: {
  stageName: string;
  progress: Progress;
}) {
  const { teams } = useSyncedStore(store)

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
        <Button onDoubleClick={() => progress = {}} color="warning">
          Remise à zéro
        </Button>
        <Button onClick={() => rotateLeft(progress)}>
          Rotation arrière
        </Button>
        <Button onClick={() => rotateRight(progress)}>
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
                  progress[key as ApparatusKey] = newValue.teamKey;
                } else {
                  delete progress[key as ApparatusKey];
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
  const { progresses } = useSyncedStore(store)

  useEffect(() => {
    if (isEmpty(progresses)) {
      progresses["Plateau A"] = {};
      progresses["Plateau B"] = {};
    }
  }, [progresses]);

  return (
    <Stack direction="column">
      {Object.entries(progresses).map(([stageName, progress]) => (
        progress !== undefined && <Stage stageName={stageName} progress={progress} key={stageName} />
      ))}
    </Stack>
  );
}
