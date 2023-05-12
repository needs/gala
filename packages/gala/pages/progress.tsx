import {
  Autocomplete,
  Divider,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { ref, set } from 'firebase/database';
import {
  ApparatusKey,
  Progress,
  database,
  progressSchema,
  teamsSchema,
  useDatabaseValue,
} from '../lib/database';
import Loading from '../components/Loading';
import Image from 'next/image';
import { produce } from 'immer';
import { apparatuses } from '../lib/apparatus';
import App from 'next/app';

const teamsRef = ref(database, 'teams');
const progressRef = ref(database, 'progress');

export default function ProgressPage() {
  const teams = useDatabaseValue(teamsRef, teamsSchema);
  const progress = useDatabaseValue(progressRef, progressSchema);

  const updateProgress = (progress: Progress) => {
    set(progressRef, progress);
  };

  if (teams === undefined || progress === undefined) {
    return <Loading />;
  }

  return (
    <Stack gap={2} direction="column" padding={4} divider={<Divider />}>
      {Object.entries(apparatuses).map(([key, { name, iconPath }]) => (
        <Stack key={key} direction="row" gap={2} alignItems="center">
          <Stack direction="row" gap={2} alignItems="center" minWidth={300}>
            <Image src={iconPath} alt="Vault" width={24} height={24} />
            <Typography variant="h6">{name}</Typography>
          </Stack>
          <Autocomplete
            disablePortal
            autoHighlight
            options={Object.entries(teams).map(([teamKey, team]) => ({
              label: team.name,
              teamKey,
            }))}
            value={
              progress[key as ApparatusKey]
                ? {
                    teamKey: progress[key as ApparatusKey],
                    label: teams[progress[key as ApparatusKey] ?? ''].name,
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
  );
}
