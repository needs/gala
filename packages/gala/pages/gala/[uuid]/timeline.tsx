import {
  Box,
  Button,
  ButtonBase,
  Divider,
  IconButton,
  Paper,
  Stack,
  Typography,
} from '@mui/material';
import { withAuthGala } from '../../../lib/auth';
import Grid from '@mui/material/Unstable_Grid2'; // Grid version 2
import {
  Timeline,
  TimelineConnector,
  TimelineContent,
  TimelineDot,
  TimelineItem,
  TimelineOppositeContent,
  TimelineSeparator,
  timelineOppositeContentClasses,
} from '@mui/lab';
import { apparatuses } from '../../../lib/apparatus';
import Image from 'next/image';
import { Add, Edit, Remove } from '@mui/icons-material';
import EditPlayerButton from 'packages/gala/components/EditPlayerButton';

export default function TimelinePage() {
  return (
    <Stack direction="column" padding={4} gap={4}>
      <Stack
        direction="row"
        gap={2}
        alignItems="center"
        justifyContent="space-between"
      >
        <Typography variant="h6" component="h1">
          Échéancier
        </Typography>
      </Stack>

      <Timeline
        sx={{
          [`& .${timelineOppositeContentClasses.root}`]: {
            flex: 0,
          },
        }}
      >
        <TimelineItem>
          <TimelineOppositeContent color="textSecondary">
            09h30
          </TimelineOppositeContent>
          <TimelineSeparator>
            <TimelineDot />
            <TimelineConnector />
          </TimelineSeparator>
          <TimelineContent>
            <Typography variant="h6" component="h1">
              Ouverture des portes
            </Typography>
          </TimelineContent>
        </TimelineItem>

        <TimelineItem>
          <TimelineOppositeContent color="textSecondary">
            10h00
          </TimelineOppositeContent>
          <TimelineSeparator>
            <TimelineDot />
            <TimelineConnector />
          </TimelineSeparator>
          <TimelineContent>
            <Paper elevation={1} sx={{ overflow: 'hidden' }}>
              <Grid container>
                {Object.entries(apparatuses).map(
                  ([key, { name, iconPath }]) => (
                    <Grid
                      key={name}
                      xs
                      sx={{
                        '&:nth-of-type(odd)': {
                          backgroundColor: (theme) => theme.palette.grey[50],
                        },
                      }}
                    >
                      <Stack alignItems="stretch" flexGrow={1}>
                        <Stack
                          direction="row"
                          gap={2}
                          alignItems="center"
                          justifyContent="center"
                          padding={2}
                          sx={{
                            backgroundColor: '#a5a5a511',
                          }}
                        >
                          <Image
                            src={iconPath}
                            alt={name}
                            width={24}
                            height={24}
                          />
                          <Typography variant="h6">{name}</Typography>
                        </Stack>

                        <Stack
                          flexGrow={1}
                          direction="column"
                          divider={<Divider />}
                        >
                          <ButtonBase sx={{
                          }}>
                            <Stack padding={2} gap={1} flexGrow={1}>
                              <Stack
                                direction="row"
                                gap={1}
                                alignItems="center"
                                justifyContent="space-between"
                              >
                                <Typography variant="body1">
                                  Les bosses
                                </Typography>
                                <IconButton size="small">
                                  <Remove />
                                </IconButton>
                              </Stack>
                              <EditPlayerButton
                                player={{
                                  firstName: 'Jean',
                                  lastName: 'Dupont',
                                  gender: 'man',
                                }}
                                onDelete={() => {}}
                              />
                            </Stack>
                          </ButtonBase>

                          <Box padding={1}>
                            <Button
                              variant="text"
                              startIcon={<Add />}
                              size="small"
                              fullWidth
                            >
                              Ajouter
                            </Button>
                          </Box>
                        </Stack>
                      </Stack>
                    </Grid>
                  )
                )}
              </Grid>
            </Paper>
          </TimelineContent>
        </TimelineItem>
      </Timeline>
    </Stack>
  );
}

export const getServerSideProps = withAuthGala('timeline');
