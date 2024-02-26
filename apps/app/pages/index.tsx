import { AccessTime, Add, EmojiEvents, Visibility } from '@mui/icons-material';
import {
  Avatar,
  Box,
  Button,
  CssBaseline,
  List,
  ListItem,
  ListItemAvatar,
  ListItemButton,
  ListItemText,
  Stack,
  Typography,
} from '@mui/material';
import { trpc } from '../utils/trpc';
import { useRouter } from 'next/router';
import { withAuth } from '../lib/auth';
import Link from 'next/link';
import AccountIconButton from '../components/AccountIconButton';
import { formatHoursAndMinutes } from '../lib/utils';
import PublicCompetitionList from '../components/PublicCompetitionList';

export default function ListPage() {
  const router = useRouter();
  const create = trpc.create.useMutation();
  const { data: competitions } = trpc.list.useQuery(null);

  return (
    <Stack
      direction="column"
      gap={4}
      p={4}
      minWidth="100vw"
      minHeight="100vh"
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      sx={{
        backgroundImage: 'url("/background.svg")',
        backgroundRepeat: 'no-repeat',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        overflowY: 'auto',
        backgroundAttachment: 'fixed',
      }}
    >
      <CssBaseline />
      <Stack gap={4} direction="column">
        <PublicCompetitionList />

        <Stack
          gap={2}
          width="600px"
          padding={4}
          sx={{ backgroundColor: 'white' }}
          borderRadius="10px"
        >
          <Stack
            direction="row"
            gap={2}
            justifyContent="space-between"
            alignItems="center"
          >
            <Typography variant="h6" component="h1">
              Vos compétitions
            </Typography>
            <AccountIconButton />
          </Stack>
          <List>
            {competitions !== undefined && competitions.length === 0 && (
              <ListItem disablePadding>
                <ListItemText
                  primary="Vous n'avez pas encore créé de compétition"
                  secondary="Cliquez sur le bouton ci-dessus pour créer une compétition"
                />
              </ListItem>
            )}
            {competitions !== undefined &&
              competitions.length > 0 &&
              competitions.map((competition) => (
                <Link
                  key={competition.uuid}
                  href={`/competition/${competition.uuid}`}
                  legacyBehavior
                >
                  <ListItem disablePadding>
                    <ListItemButton>
                      <ListItemAvatar>
                        <Avatar>
                          <EmojiEvents />
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={
                          competition.name
                            ? competition.name
                            : 'Compétition sans nom'
                        }
                        secondary={
                          <Stack
                            direction="row"
                            justifyContent="space-between"
                            component="span"
                          >
                            {`${competition.teamCount} équipes, ${competition.playerCount} joueurs`}
                            <Stack direction="row" gap={2} component="span">
                              <Stack
                                direction="row"
                                alignItems="center"
                                gap={0.5}
                                component="span"
                              >
                                <AccessTime fontSize="small" />
                                {formatHoursAndMinutes(
                                  competition.cumulativeDuration
                                )}
                              </Stack>
                              <Stack
                                direction="row"
                                alignItems="center"
                                gap={0.5}
                                component="span"
                              >
                                <Visibility fontSize="small" />
                                {`${competition.viewCount}`}
                              </Stack>
                            </Stack>
                          </Stack>
                        }
                      />
                    </ListItemButton>
                  </ListItem>
                </Link>
              ))}
          </List>

          <Box marginLeft="auto">
            <Button
              variant={
                competitions === undefined || competitions.length === 0
                  ? 'contained'
                  : 'outlined'
              }
              startIcon={<Add />}
              onClick={() => {
                create.mutateAsync(null).then((competition) => {
                  router.push(`/competition/${competition.uuid}`);
                });
              }}
            >
              Compétition
            </Button>
          </Box>
        </Stack>
      </Stack>
    </Stack>
  );
}

export const getServerSideProps = withAuth({});
