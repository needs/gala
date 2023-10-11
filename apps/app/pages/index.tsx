import { Add, EmojiEvents } from '@mui/icons-material';
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
import { signOut } from 'firebase/auth';
import { getFirebaseAppAuth } from '../lib/firebase';
import { withAuth } from '../lib/auth';
import { useCookies } from 'react-cookie';
import Link from 'next/link';

export default function ListPage() {
  const removeCookies = useCookies(['session'])[2];
  const router = useRouter();
  const create = trpc.create.useMutation();
  const { data: competitions } = trpc.list.useQuery(null);

  return (
    <Box
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
      }}
    >
      <CssBaseline />

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
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => {
              create.mutateAsync(null).then((competition) => {
                router.push(`/competition/${competition.uuid}`);
              });
            }}
          >
            Compétition
          </Button>
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
                      secondary={`${competition.teamCount} équipes`}
                    />
                  </ListItemButton>
                </ListItem>
              </Link>
            ))}
        </List>

        <Button
          onClick={() => {
            removeCookies('session');
            signOut(getFirebaseAppAuth()).then(() => {
              router.push('/login');
            });
          }}
          color="secondary"
        >
          Deconnexion
        </Button>
      </Stack>
    </Box>
  );
}

export const getServerSideProps = withAuth({});
