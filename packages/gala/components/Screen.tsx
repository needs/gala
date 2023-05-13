import { Box, Divider, Stack, Typography } from '@mui/material';
import Image from 'next/image';
import { Apparatus, apparatuses } from '../lib/apparatus';
import { DatabaseReference, ref } from 'firebase/database';
import {
  ApparatusKey,
  database,
  playersSchema,
  progressSchema,
  teamsSchema,
  useDatabaseValue,
} from '../lib/database';
import Loading from '../components/Loading';
import { fullName } from '../lib/utils';
import GenderAvatar from '../components/GenderAvatar';

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
  const width = `${(1 / Object.entries(apparatuses).length) * 100}%`;

  const teams = useDatabaseValue(teamsRef, teamsSchema);
  const progress = useDatabaseValue(progressRef, progressSchema);
  const players = useDatabaseValue(playersRef, playersSchema);

  if (teams === undefined || progress === undefined || players === undefined) {
    return <Loading />;
  }
  console.log(progress)

  const teamKey = progress[apparatusKey];
  const team = teamKey !== undefined ? teams[teamKey] : undefined;

  console.log(teamKey)

  return (
    <Stack
      direction="column"
      gap={2}
      alignItems="center"
      minWidth={width}
      maxWidth={width}
    >
      <Image src={apparatus.iconPath} alt="Vault" width={96} height={96} />
      <Typography variant="h1">{apparatus.name}</Typography>
      {team !== undefined && (
        <>
          <Typography variant="h4" paddingY={3} paddingX={1}>
            {team.name}
          </Typography>

          <Stack direction="column" gap={2} width="100%">
            {Object.keys(team.members).map((playerKey) => (
              <Stack
                key={playerKey}
                direction="row"
                gap={2}
                alignItems="center"
                padding={2}
              >
                <GenderAvatar gender={players[playerKey].gender} />
                <Typography key={playerKey} variant="h5">
                  {fullName(players[playerKey])}
                </Typography>
              </Stack>
            ))}
          </Stack>
        </>
      )}
    </Stack>
  );
}

export default function Screen({ stageName, progressRef}: { stageName: string, progressRef: DatabaseReference }) {
  return (
    <Stack
      direction="column"
      gap={2}
      alignItems="stretch"
      padding={2}
      width="100%"
    >
      <Box marginLeft="auto" marginRight="auto">
        <Typography variant="h1">{stageName}</Typography>
      </Box>

      <Stack
        direction="row"
        justifyContent="center"
        divider={<Divider orientation="vertical" />}
      >
        {Object.entries(apparatuses).map(([apparatusKey, apparatus]) => (
          <Apparatus progressRef={progressRef} key={apparatusKey} apparatusKey={apparatusKey as ApparatusKey} apparatus={apparatus} />
        ))}
      </Stack>
    </Stack>
  );
}
