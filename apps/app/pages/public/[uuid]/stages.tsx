import { Avatar, Box, Chip, Divider, Stack, Typography } from '@mui/material';
import { fullName } from '../../../lib/utils';
import Image from 'next/image';
import GenderIcon from '../../../components/GenderIcon';
import { getApparatusIconPath, getApparatusName } from '../../../lib/store';
import { GetServerSideProps } from 'next';
import { PageProps } from '../../_app';
import { ApparatusKey, Progress } from '@tgym.fr/core';
import { useCompetition } from '../../../components/StoreProvider';
import { getTeamName, getTeamNameSxProps } from '../../../lib/team';

function Apparatus({
  apparatusKey,
  teamKey,
}: {
  apparatusKey: ApparatusKey;
  teamKey: string;
}) {
  const { teams, players } = useCompetition();

  const team = teams[teamKey];

  return (
    <Stack direction="column" gap={2} alignItems="center">
      <Stack direction="row" gap={2} alignItems="center">
        <Image
          src={getApparatusIconPath(apparatusKey)}
          alt="Vault"
          width={24}
          height={24}
        />
        <Typography variant="h5">{getApparatusName(apparatusKey)}</Typography>
      </Stack>
      {team === undefined ? (
        <Typography color="gray">Aucune équipe</Typography>
      ) : (
        <>
          <Typography
            variant="h6"
            paddingY={3}
            paddingX={1}
            sx={getTeamNameSxProps(team)}
          >
            {getTeamName(team)}
          </Typography>

          <Stack
            direction="row"
            gap={2}
            width="100%"
            justifyContent="center"
            flexWrap="wrap"
          >
            {Object.keys(team.members).map((playerKey) => {
              const player = players[playerKey];

              return (
                player !== undefined && (
                  <Chip
                    key={playerKey}
                    avatar={
                      <Avatar sx={{ bgcolor: 'transparent' }}>
                        <GenderIcon gender={player.gender} />
                      </Avatar>
                    }
                    label={fullName(player)}
                    variant="outlined"
                  />
                )
              );
            })}
          </Stack>
        </>
      )}
    </Stack>
  );
}

function Stage({
  stageName,
  progress,
}: {
  stageName: string;
  progress: Progress;
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

      <Stack
        direction="column"
        justifyContent="center"
        divider={<Divider />}
        gap={4}
      >
        {Object.entries(progress).map(([apparatusKey, teamKey]) => (
          <Apparatus
            key={apparatusKey}
            apparatusKey={apparatusKey as ApparatusKey}
            teamKey={teamKey}
          />
        ))}
      </Stack>
    </Stack>
  );
}

export default function Stages() {
  const { progresses } = useCompetition();

  return (
    <Stack gap={10}>
      {Object.entries(progresses).map(
        ([stageName, progress]) =>
          progress !== undefined && (
            <Stage stageName={stageName} progress={progress} key={stageName} />
          )
      )}
    </Stack>
  );
}

export const getServerSideProps: GetServerSideProps<PageProps> = async (
  context
) => {
  const competitionUuid = context.query.uuid as string;
  return {
    props: {
      competitionUuid: competitionUuid,

      layoutInfo: {
        menu: 'visitor',
        selected: 'stages',
        uuid: competitionUuid,
      },
    },
  };
};
