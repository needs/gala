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

export default function ListPage() {
  const create = trpc.create.useMutation();
  const { data: galas } = trpc.list.useQuery(null);
  const router = useRouter();

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
            Vos GALAs
          </Typography>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => {
              create.mutateAsync(null).then((gala) => {
                router.push(`/gala/${gala.uuid}/teams`);
              });
            }}
          >
            Créer un GALA
          </Button>
        </Stack>
        <List>
          {galas !== undefined &&
            galas.map((gala) => (
              <ListItem key={gala.uuid} disablePadding>
                <ListItemButton onClick={() => router.push(`/gala/${gala.uuid}/teams`)}>
                  <ListItemAvatar>
                    <Avatar>
                      <EmojiEvents />
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary="GALA de l'Arbresle"
                    secondary={`${gala.teamCount} équipes`}
                  />
                </ListItemButton>
              </ListItem>
            ))}
        </List>
      </Stack>
    </Box>
  );
}

ListPage.disableStoreProvider = true;
