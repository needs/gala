import { Avatar, Box, Chip, Divider, Stack, Typography } from '@mui/material';
import {
  ApparatusKey,
  database,
  playersSchema,
  progressSchema,
  teamsSchema,
  useDatabaseValue,
} from '../lib/database';
import { DatabaseReference, ref } from 'firebase/database';
import { Apparatus, apparatuses } from '../lib/apparatus';
import GenderAvatar from '../components/GenderAvatar';
import Loading from '../components/Loading';
import { fullName } from '../lib/utils';
import Image from 'next/image';
import GenderIcon from '../components/GenderIcon';

const progressARef = ref(database, 'progress');
const progressBRef = ref(database, 'progress2');
const teamsRef = ref(database, 'teams');
const playersRef = ref(database, 'players');

function Apparatus({
  apparatusKey,
  apparatus,
  progressRef,
}: {
  apparatusKey: ApparatusKey;
  apparatus: Apparatus;
  progressRef: DatabaseReference;
}) {
  const teams = useDatabaseValue(teamsRef, teamsSchema);
  const progress = useDatabaseValue(progressRef, progressSchema);
  const players = useDatabaseValue(playersRef, playersSchema);

  if (teams === undefined || progress === undefined || players === undefined) {
    return <Loading />;
  }

  const teamKey = progress[apparatusKey];
  const team = teamKey !== undefined ? teams[teamKey] : undefined;

  return (
    <Stack direction="column" gap={2} alignItems="center">
      <Stack direction="row" gap={2} alignItems="center">
        <Image src={apparatus.iconPath} alt="Vault" width={24} height={24} />
        <Typography variant="h5">{apparatus.name}</Typography>
      </Stack>
      {team === undefined ? <Typography color="gray">Aucune équipe</Typography> : (
        <>
          <Typography variant="h6" paddingY={3} paddingX={1}>
            {team.name}
          </Typography>

          <Stack direction="row" gap={2} width="100%" justifyContent="center" flexWrap="wrap">
            {Object.keys(team.members).map((playerKey) => (
              <Chip
                key={playerKey}
                avatar={
                  <Avatar sx={{ bgcolor: 'transparent' }}>
                    <GenderIcon gender={players[playerKey].gender} />
                  </Avatar>
                }
                label={fullName(players[playerKey])}
                variant="outlined"
              />
            ))}
          </Stack>
        </>
      )}
    </Stack>
  );
}

function Stage({
  stageName,
  progressRef,
}: {
  stageName: string;
  progressRef: DatabaseReference;
}) {
  return (
    <Stack
      direction="column"
      gap={2}
      alignItems="stretch"
      padding={2}
      width="100%"
    >
      <Box marginLeft="auto" marginRight="auto">
        <Typography variant="h4">{stageName}</Typography>
      </Box>

      <Stack direction="column" justifyContent="center" divider={<Divider />} gap={4}>
        {Object.entries(apparatuses).map(([apparatusKey, apparatus]) => (
          <Apparatus
            progressRef={progressRef}
            key={apparatusKey}
            apparatusKey={apparatusKey as ApparatusKey}
            apparatus={apparatus}
          />
        ))}
      </Stack>
    </Stack>
  );
}

export default function Index() {
  return (
    <Stack gap={10}>
      <Stage stageName="Plateau A" progressRef={progressARef} />
      <Stage stageName="Plateau B" progressRef={progressBRef} />
    </Stack>
  );
}
