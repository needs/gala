import { Alert, Box, CssBaseline, Stack, Typography } from '@mui/material';
import {
  getApparatusIconPath,
  getApparatusName,
} from '../../lib/store';
import { TimelineEvent, getCurrentTimelineEvent } from '../../lib/progress';
import Image from 'next/image';
import GenderAvatar from '../GenderAvatar';
import { useEffect, useRef, useState } from 'react';
import { ScreenProgress } from '@tgym.fr/core';
import { useCompetition } from '../StoreProvider';

function Start() {
  return (
    <Box flexGrow="1" display="flex">
      <Typography variant="h1" textAlign="center" marginY="auto" flexGrow="1">
        {"L'échéancier va bientôt commencer"}
      </Typography>
    </Box>
  );
}

function End() {
  return (
    <Box flexGrow="1" display="flex">
      <Typography variant="h1" textAlign="center" marginY="auto" flexGrow="1">
        {"L'échéancier est terminé"}
      </Typography>
    </Box>
  );
}

function Rotation({
  rotation,
}: {
  rotation: Extract<TimelineEvent, { type: 'rotation' }>;
}) {
  const { teams, players, categories } = useCompetition();

  const [scrollIndex, setScrollIndex] = useState(0);
  const refs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    refs.current = refs.current.slice(0, rotation.apparatuses.length);
  }, [rotation.apparatuses.length]);

  useEffect(() => {
    const interval = setInterval(() => {
      setScrollIndex((scrollIndex) => scrollIndex + 1);
    }, 10000);

    return () => clearInterval(interval);
  }, [refs.current.length, setScrollIndex]);

  useEffect(() => {
    refs.current[scrollIndex % refs.current.length]?.scrollIntoView({
      behavior: 'smooth',
      block: 'nearest',
      inline: 'center',
    });
  }, [scrollIndex]);

  return (
    <Stack
      direction="row"
      gap={4}
      padding={4}
      flexGrow="1"
      alignItems="start"
      overflow="hidden"
    >
      {rotation.apparatuses.map((apparatus, index) => {
        return (
          <Stack
            key={index}
            flexGrow="1"
            bgcolor="#ffffff87"
            borderRadius={8}
            minWidth="26vw"
            ref={(el) => (refs.current[index] = el)}
          >
            <Stack direction="row" gap={4} alignItems="center" padding={4}>
              <Image
                src={getApparatusIconPath(apparatus.type)}
                alt="Vault"
                width={96}
                height={96}
              />

              <Typography variant="h2" fontWeight="bold">
                {getApparatusName(apparatus.type)}
              </Typography>
            </Stack>

            <Stack gap={4}>
              {Object.keys(apparatus.teams).map((teamKey) => {
                  const team = teams[teamKey];
                  const category = categories[team.categoryKey ?? ''];

                  return (
                    team !== undefined && (
                      <Stack
                        key={teamKey}
                        direction="column"
                        padding={2}
                        sx={{
                          backgroundColor: 'white',
                          borderRadius: 8,
                        }}
                      >
                        <Stack paddingY={3} paddingX={1}>
                          <Typography variant="h4" fontWeight="bold">
                            {`${team.name}${team.label !== undefined ? ` - Équipe ${team.label}` : ''}`}
                          </Typography>
                          <Typography variant="h5" color="grey">
                            {category.name}
                          </Typography>
                        </Stack>

                        <Stack direction="column" gap={2} width="100%">
                          {Object.keys(team.members).map((playerKey) => {
                            const player = players[playerKey];

                            return (
                              player !== undefined && (
                                <Stack
                                  key={playerKey}
                                  direction="row"
                                  gap={4}
                                  alignItems="center"
                                  padding={2}
                                >
                                  <GenderAvatar
                                    gender={player.gender}
                                    size={56}
                                  />
                                  <Typography variant="h4">
                                    {player.firstName} {player.lastName}
                                  </Typography>
                                </Stack>
                              )
                            );
                          })}
                        </Stack>
                      </Stack>
                    )
                  );
                })}
            </Stack>
          </Stack>
        );
      })}
    </Stack>
  );
}

function Pause() {
  return (
    <Box flexGrow="1" display="flex">
      <Typography variant="h1" textAlign="center" marginY="auto" flexGrow="1">
        {'Pause'}
      </Typography>
    </Box>
  );
}

export default function ScreenProgress({ screen }: { screen: ScreenProgress }) {
  const { schedules } = useCompetition();

  if (screen.scheduleUuid === undefined) {
    return (
      <Alert severity="warning">
        {"Cet écran n'a aucun échéancier d'associé."}
      </Alert>
    );
  }

  const schedule = schedules[screen.scheduleUuid];

  if (schedule === undefined) {
    return (
      <Alert severity="warning">
        {"L'échéancier que cet écran doit afficher n'éxiste plus."}
      </Alert>
    );
  }

  const currentScheduledRotation = getCurrentTimelineEvent(schedule);

  const rotationComponent = () => {
    switch (currentScheduledRotation.type) {
      case 'start':
        return <Start />;
      case 'end':
        return <End />;
      case 'rotation':
        return (
          <Rotation
            rotation={currentScheduledRotation}
          />
        );
      case 'pause':
        return <Pause />;
    }
  };

  return (
    <Box>
      <CssBaseline />
      <Stack
        minHeight="100vh"
        sx={{
          backgroundImage: 'url("/tv-background.svg")',
          backgroundRepeat: 'no-repeat',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <Box
          sx={{
            backgroundImage: 'url("/background.svg")',
            backgroundRepeat: 'no-repeat',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
          padding={4}
        >
          <Typography textAlign="center" variant="h1" color="white">
            {schedule.name}
          </Typography>
        </Box>

        {rotationComponent()}
      </Stack>
    </Box>
  );
}
