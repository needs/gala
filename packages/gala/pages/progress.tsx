import {
  Autocomplete,
  Divider,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { child, ref, set } from 'firebase/database';
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

const apparatuses: {
  name: string;
  key: ApparatusKey;
  icon: JSX.Element;
}[] = [
  {
    name: 'Saut',
    key: 'vault',
    icon: (
      <Image
        src="/icons/apparatuses/vault.png"
        alt="Vault"
        width={24}
        height={24}
      />
    ),
  },
  {
    name: 'Barres asymétriques',
    key: 'unevenBars',
    icon: (
      <Image
        src="/icons/apparatuses/unevenBars.png"
        alt="Vault"
        width={24}
        height={24}
      />
    ),
  },
  {
    name: 'Poutre',
    key: 'beam',
    icon: (
      <Image
        src="/icons/apparatuses/beam.png"
        alt="Vault"
        width={24}
        height={24}
      />
    ),
  },
  {
    name: 'Sol',
    key: 'floor',
    icon: (
      <Image
        src="/icons/apparatuses/floor.png"
        alt="Vault"
        width={24}
        height={24}
      />
    ),
  },
];

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
      {apparatuses.map(({ name, key, icon }) => (
        <Stack key={key} direction="row" gap={2} alignItems="center">
          <Stack direction="row" gap={2} alignItems="center" minWidth={300}>
            {icon}
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
              progress[key]
                ? {
                    teamKey: progress[key],
                    label: teams[progress[key] ?? ''].name,
                  }
                : null
            }
            onChange={(event, newValue) => {
              if (newValue) {
                updateProgress(produce(progress, draft => {draft[key] = newValue.teamKey}));
              } else {
                updateProgress(produce(progress, draft => {delete draft[key]}));
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
