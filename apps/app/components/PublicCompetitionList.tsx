import { EmojiEvents, AccessTime, Visibility } from '@mui/icons-material';
import {
  Avatar,
  List,
  ListItem,
  ListItemAvatar,
  ListItemButton,
  ListItemText,
  Stack,
  Typography,
} from '@mui/material';
import { formatHoursAndMinutes } from '../lib/utils';
import { trpc } from '../utils/trpc';
import Link from 'next/link';

export default function PublicCompetitionList() {
  const { data: competitions } = trpc.listPublic.useQuery(null);

  return (
    <Stack
      gap={2}
      width="600px"
      padding={4}
      sx={{ backgroundColor: 'white' }}
      borderRadius="10px"
    >
      <Typography variant="h6" component="h1">
        Exemples de compétitions
      </Typography>
      <List>
        {competitions !== undefined && competitions.length === 0 && (
          <ListItem disablePadding>
            <ListItemText
              primary="Aucun exemple de compétition disponible."
              secondary="Expérimentez en créant votre propre compétition !"
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
    </Stack>
  );
}
