import { Divider, Paper, Stack, Typography } from '@mui/material';
import Image from 'next/image';
import { apparatuses } from '../../lib/apparatus';
import { ref } from 'firebase/database';
import {
  ApparatusKey,
  database,
  playersSchema,
  progressSchema,
  teamsSchema,
  useDatabaseValue,
} from '../../lib/database';
import Loading from '../../components/Loading';
import { fullName } from '../../lib/utils';
import GenderAvatar from '../../components/GenderAvatar';

const teamsRef = ref(database, 'teams');
const progressRef = ref(database, 'progress');
const playersRef = ref(database, 'players');

export default function Screen1() {
  const width = `${(1 / Object.entries(apparatuses).length) * 100}%`;

  const teams = useDatabaseValue(teamsRef, teamsSchema);
  const progress = useDatabaseValue(progressRef, progressSchema);
  const players = useDatabaseValue(playersRef, playersSchema);

  if (teams === undefined || progress === undefined || players === undefined) {
    return <Loading />;
  }

  return (
    <Stack
      direction="row"
      justifyContent="center"
      divider={<Divider orientation="vertical" />}
    >
      {Object.entries(progress).map(([apparatusKey, teamKey]) => (
        <Stack
          key={apparatusKey}
          direction="column"
          gap={2}
          alignItems="center"
          minWidth={width}
          maxWidth={width}
        >
          <Image
            src={apparatuses[apparatusKey as ApparatusKey].iconPath}
            alt="Vault"
            width={96}
            height={96}
          />
          <Typography variant="h1">
            {apparatuses[apparatusKey as ApparatusKey].name}
          </Typography>
          <Typography variant="h4" paddingY={3} paddingX={1}>{teams[teamKey].name}</Typography>

          <Stack direction="column" gap={2} width="100%">
            {Object.keys(teams[teamKey].members).map((playerKey) => (
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
        </Stack>
      ))}
    </Stack>
  );
}
