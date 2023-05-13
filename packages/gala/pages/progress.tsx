import {
  Autocomplete,
  Divider,
  Paper,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { DatabaseReference, ref, set } from 'firebase/database';
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
const progressRefA = ref(database, 'progress');
const progressRefB = ref(database, 'progress2');

function Stage({ stageName, databaseRef }: { stageName: string, databaseRef: DatabaseReference }) {
  const teams = useDatabaseValue(teamsRef, teamsSchema);
  const progress = useDatabaseValue(databaseRef, progressSchema);

  const updateProgress = (progress: Progress) => {
    set(databaseRef, progress);
  };

  if (teams === undefined || progress === undefined) {
    return <Loading />;
  }

  return (
    <Stack direction="column" padding={4}>
      <Typography variant="h4" paddingY={3} paddingX={1}>
        {stageName}
      </Typography>
      <Stack gap={2} direction="column" divider={<Divider />}>
        {Object.entries(apparatuses).map(([key, { name, iconPath }]) => (
          <Stack key={key} direction="row" gap={2} alignItems="center">
            <Stack direction="row" gap={2} alignItems="center" minWidth={300}>
              <Image src={iconPath} alt="Vault" width={24} height={24} />
              <Typography variant="h6">{name}</Typography>
            </Stack>
            <Autocomplete
              disablePortal
              autoHighlight
              size="small"
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
    </Stack>
  );
}

export default function ProgressPage() {
  return (
    <Stack direction="column">
      <Stage stageName="Plateau A" databaseRef={progressRefA} />
      <Stage stageName="Plateau B" databaseRef={progressRefB}/>
    </Stack>
  );
}
