import {
  Alert,
  Button,
  Divider,
  IconButton,
  InputAdornment,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  MenuList,
  Stack,
  Tab,
  Tabs,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material';
import { withCompetition } from '../../../lib/auth';
import {
  Add,
  ArrowDownward,
  ArrowUpward,
  CalendarViewWeek,
  Delete,
  EventNote,
  KeyboardArrowDown,
  Pause,
} from '@mui/icons-material';
import { DateTimePicker } from '@mui/x-date-pickers';
import { uuidv4 } from 'lib0/random';
import {
  addMinutes,
  format,
  formatDuration,
  intervalToDuration,
  isEqual,
} from 'date-fns';
import { ReactNode, useState } from 'react';
import { max, sortBy } from 'lodash';
import ScheduleEventRotationComponent from '../../../components/ScheduleEventRotation';
import ScheduleEventPauseComponent from '../../../components/ScheduleEventPause';
import fr from 'date-fns/locale/fr';
import {
  Schedule,
  ScheduleEvent,
  ScheduleEventPause,
  ScheduleEventRotation,
} from '@tgym.fr/core';
import { useCompetition } from '../../../components/StoreProvider';
import { getRotationApparatuses } from '../../../lib/store';
import SelectApparatusDialog from '../../../components/SelectApparatusDialog';
import Image from 'next/image';

function eventNextOrder(events: ScheduleEvent[]) {
  return max(events.map((event) => event.order + 1)) ?? 0;
}

function ScheduleEventContainer({
  children,
  scheduleEvent,
  date,
  headerComponent,
  onMoveUp,
  onMoveDown,
  onDelete,
}: {
  children: ReactNode;
  scheduleEvent: ScheduleEvent;
  date: Date;
  headerComponent?: ReactNode;
  onMoveUp?: () => void;
  onMoveDown?: () => void;
  onDelete?: () => void;
}) {
  return (
    <Stack gap={2}>
      <Stack
        direction="row"
        gap={2}
        alignItems="center"
        justifyContent="space-between"
      >
        <Stack
          direction="row"
          gap={2}
          alignItems="center"
          divider={<Divider />}
        >
          <Typography variant="h6" component="h1">
            {format(date, 'HH:mm')}
          </Typography>
          <TextField
            label="Durée"
            inputProps={{
              inputMode: 'numeric',
              pattern: '[0-9]*',
            }}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">minutes</InputAdornment>
              ),
            }}
            size="small"
            value={scheduleEvent.durationInMinutes}
            onChange={(event) => {
              const duration = parseInt(event.target.value);
              scheduleEvent.durationInMinutes = isNaN(duration) ? 0 : duration;
            }}
            sx={{
              maxWidth: '130px',
            }}
          />
          {headerComponent}
        </Stack>
        <Stack gap={2} direction="row">
          <IconButton
            size="small"
            disabled={onMoveUp === undefined}
            onClick={onMoveUp}
          >
            <ArrowUpward />
          </IconButton>
          <IconButton
            size="small"
            disabled={onMoveDown === undefined}
            onClick={onMoveDown}
          >
            <ArrowDownward />
          </IconButton>

          <Tooltip
            title={
              onDelete !== undefined
                ? undefined
                : 'Enelever toute les équipes pour pouvoir supprimer la rotation'
            }
          >
            <span>
              <IconButton
                size="small"
                onClick={onDelete}
                disabled={onDelete === undefined}
              >
                <Delete />
              </IconButton>
            </span>
          </Tooltip>
        </Stack>
      </Stack>
      {children}
    </Stack>
  );
}

function ScheduleEventRotationContainer({
  scheduleEventRotation: scheduleEventRotation,
  date,
  onMoveUp,
  onMoveDown,
  onDelete,
  onRemoveApparatus,
}: {
  scheduleEventRotation: ScheduleEventRotation;
  date: Date;
  onMoveUp?: () => void;
  onMoveDown?: () => void;
  onDelete?: () => void;
  onRemoveApparatus: (apparatusUuid: string) => void;
}) {
  const [isSelectApparatusDialogOpen, setIsSelectApparatusDialogOpen] =
    useState(false);

  const apparatuses = getRotationApparatuses(scheduleEventRotation);

  return (
    <>
      <SelectApparatusDialog
        open={isSelectApparatusDialogOpen}
        onClose={() => setIsSelectApparatusDialogOpen(false)}
        onSelect={(apparatusKey) => {
          const order =
            max(
              Object.values(scheduleEventRotation.apparatuses).map(
                (apparatus) => apparatus.order
              )
            ) ?? 0;

          scheduleEventRotation.apparatuses[uuidv4()] = {
            type: apparatusKey,
            order,
            teams: {},
          };
        }}
      />
      <ScheduleEventContainer
        scheduleEvent={scheduleEventRotation}
        date={date}
        headerComponent={
          <Button
            variant="text"
            startIcon={<Add />}
            onClick={() => {
              setIsSelectApparatusDialogOpen(true);
            }}
          >
            Agrès
          </Button>
        }
        onMoveUp={onMoveUp}
        onMoveDown={onMoveDown}
        onDelete={onDelete}
      >
        <ScheduleEventRotationComponent
          apparatuses={apparatuses}
          onRemove={onRemoveApparatus}
        />
      </ScheduleEventContainer>
    </>
  );
}

function ScheduleEventPauseContainer({
  scheduleEventPause: scheduleEventPause,
  date,
  onMoveUp,
  onMoveDown,
  onDelete,
}: {
  scheduleEventPause: ScheduleEventPause;
  date: Date;
  onMoveUp?: () => void;
  onMoveDown?: () => void;
  onDelete?: () => void;
}) {
  return (
    <ScheduleEventContainer
      scheduleEvent={scheduleEventPause}
      date={date}
      onMoveUp={onMoveUp}
      onMoveDown={onMoveDown}
      onDelete={onDelete}
    >
      <ScheduleEventPauseComponent />
    </ScheduleEventContainer>
  );
}

function newScheduleName(schedules: Record<string, Schedule>) {
  const scheduleNames = Object.values(schedules).map(
    (schedule) => schedule.name
  );

  for (let i = 1; i < 100; i++) {
    const name = `Plateau ${i}`;

    if (!scheduleNames.includes(name)) {
      return name;
    }
  }

  return 'Nouveau plateau';
}

export default function SchedulesPage() {
  const { schedules } = useCompetition();
  const [addMenuAnchorEl, setAddMenuAnchorEl] = useState<null | HTMLElement>(
    null
  );

  const [selectedScheduleUuid, setSelectedScheduleUuid] = useState<
    string | undefined
  >(Object.keys(schedules).at(0));

  if (selectedScheduleUuid === undefined) {
    return (
      <Stack
        direction="column"
        padding={4}
        gap={4}
        alignItems="center"
        justifyContent="center"
      >
        <Image
          src="/splash.png"
          alt="Illustration"
          width={583 / 1.5}
          height={700 / 1.5}
        />
        <Typography variant="h6" component="h1">
          Commencez dès maintenant à planifier votre compétition
        </Typography>
        <Button
          variant="contained"
          size="large"
          onClick={() => {
            const uuid = uuidv4();
            schedules[uuid] = {
              name: newScheduleName(schedules),
              startDate: new Date().toString(),
              events: {},
            };
            setSelectedScheduleUuid(uuid);
          }}
        >
          Créer un échéancier
        </Button>
      </Stack>
    );
  }

  const selectedSchedule = schedules[selectedScheduleUuid];

  if (selectedSchedule === undefined) {
    return (
      <Alert
        severity="warning"
        sx={{ margin: 4 }}
        action={
          <Button
            color="inherit"
            size="small"
            onClick={() => {
              setSelectedScheduleUuid(Object.keys(schedules).at(0));
            }}
          >
            Précédent
          </Button>
        }
      >
        {`L'échéancier sélectionné n'existe plus`}
      </Alert>
    );
  }

  const scheduleEvents = sortBy(
    Object.entries(selectedSchedule.events),
    (entry) => entry[1].order
  );

  let nextEventDate = new Date(selectedSchedule.startDate);

  const closeAddMenu = () => {
    setAddMenuAnchorEl(null);
  };

  const addRotation = () => {
    const order = eventNextOrder(Object.values(selectedSchedule.events));

    selectedSchedule.events[uuidv4()] = {
      type: 'rotation',
      apparatuses: {
        [uuidv4()]: {
          type: 'vault',
          order: 0,
          teams: {},
        },
        [uuidv4()]: {
          type: 'unevenBars',
          order: 1,
          teams: {},
        },
        [uuidv4()]: {
          type: 'beam',
          order: 2,
          teams: {},
        },
        [uuidv4()]: {
          type: 'floor',
          order: 3,
          teams: {},
        },
      },
      order,
      durationInMinutes: 60,
    };
  };

  const addPause = () => {
    const order = eventNextOrder(Object.values(selectedSchedule.events));

    selectedSchedule.events[uuidv4()] = {
      type: 'pause',
      order,
      durationInMinutes: 30,
    };
  };

  const addSchedule = () => {
    const uuid = uuidv4();
    schedules[uuid] = {
      name: newScheduleName(schedules),
      startDate: new Date().toString(),
      events: {},
    };
    setSelectedScheduleUuid(uuid);
  };

  return (
    <Stack direction="column">
      <Stack direction="column">
        <Stack
          direction="row"
          gap={2}
          alignItems="center"
          justifyContent="space-between"
        >
          <Tabs
            value={selectedScheduleUuid}
            onChange={(_, newValue) => {
              setSelectedScheduleUuid(newValue);
            }}
            variant="scrollable"
            scrollButtons
            allowScrollButtonsMobile
          >
            {Object.entries(schedules).map(
              ([scheduleUuid, schedule]) =>
                schedule !== undefined && (
                  <Tab
                    key={scheduleUuid}
                    label={schedule.name}
                    value={scheduleUuid}
                    sx={{ minHeight: 60 }}
                  />
                )
            )}
          </Tabs>
          <>
            <Button
              endIcon={<KeyboardArrowDown />}
              variant="contained"
              onClick={(event) => {
                setAddMenuAnchorEl(event.currentTarget);
              }}
              sx={{ mr: 4 }}
            >
              Ajouter
            </Button>
            <Menu
              anchorEl={addMenuAnchorEl}
              open={Boolean(addMenuAnchorEl)}
              onClose={closeAddMenu}
              PaperProps={{
                elevation: 0,
                sx: {
                  overflow: 'visible',
                  filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
                  mt: 1.5,
                  minWidth: 200,
                  '& .MuiAvatar-root': {
                    width: 32,
                    height: 32,
                    ml: -0.5,
                    mr: 1,
                  },
                  '&::before': {
                    content: '""',
                    display: 'block',
                    position: 'absolute',
                    top: 0,
                    right: 14,
                    width: 10,
                    height: 10,
                    bgcolor: 'background.paper',
                    transform: 'translateY(-50%) rotate(45deg)',
                    zIndex: 0,
                  },
                },
              }}
              transformOrigin={{ horizontal: 'right', vertical: 'top' }}
              anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
            >
              <MenuItem
                onClick={() => {
                  addSchedule();
                  closeAddMenu();
                }}
              >
                <ListItemIcon>
                  <EventNote />
                </ListItemIcon>
                <ListItemText>Échéancier</ListItemText>
              </MenuItem>
              <Divider />
              <MenuItem
                onClick={() => {
                  addRotation();
                  closeAddMenu();
                }}
              >
                <ListItemIcon>
                  <CalendarViewWeek />
                </ListItemIcon>
                <ListItemText>Rotation</ListItemText>
              </MenuItem>
              <MenuItem
                onClick={() => {
                  addPause();
                  closeAddMenu();
                }}
              >
                <ListItemIcon>
                  <Pause />
                </ListItemIcon>
                <ListItemText>Pause</ListItemText>
              </MenuItem>
            </Menu>
          </>
        </Stack>
        <Divider />
      </Stack>

      <Stack gap={4} padding={4}>
        <TextField
          label="Nom de l'échéancier"
          value={selectedSchedule.name ?? ''}
          onChange={(e) => {
            selectedSchedule.name = e.target.value;
          }}
        />
        <Stack direction="column" gap={2}>
          <Typography variant="h6" component="h1">
            {"Début de l'échéancier"}
          </Typography>
          <DateTimePicker
            label="Date"
            sx={{
              minWidth: '400px',
            }}
            value={new Date(selectedSchedule.startDate)}
            onChange={(date) => {
              if (date !== null) {
                selectedSchedule.startDate = date.toString();
              }
            }}
            format="EEEE d MMMM yyyy HH:mm"
          />
        </Stack>

        {scheduleEvents.map(([scheduleEventUuid, scheduleEvent], order) => {
          const eventDate = nextEventDate;

          nextEventDate = addMinutes(
            nextEventDate,
            scheduleEvent.durationInMinutes || 0
          );

          const onMoveUp = () => {
            scheduleEvents[order][1].order -= 1;
            scheduleEvents[order - 1][1].order += 1;
          };

          const onMoveDown = () => {
            scheduleEvents[order][1].order += 1;
            scheduleEvents[order + 1][1].order -= 1;
          };

          const onDelete = () => {
            delete selectedSchedule.events[scheduleEventUuid];
          };

          if (scheduleEvent.type === 'rotation') {
            const rotationApparatuses = getRotationApparatuses(scheduleEvent);

            const isEmpty = rotationApparatuses.every(
              ({ apparatus }) => Object.keys(apparatus.teams).length === 0
            );

            return (
              <ScheduleEventRotationContainer
                key={scheduleEventUuid}
                scheduleEventRotation={scheduleEvent}
                date={eventDate}
                onMoveUp={order === 0 ? undefined : onMoveUp}
                onMoveDown={
                  order === Object.keys(selectedSchedule.events).length - 1
                    ? undefined
                    : onMoveDown
                }
                onDelete={!isEmpty ? undefined : onDelete}
                onRemoveApparatus={(apparatusUuid) => {
                  delete scheduleEvent.apparatuses[apparatusUuid];
                }}
              />
            );
          } else if (scheduleEvent.type === 'pause') {
            return (
              <ScheduleEventPauseContainer
                key={scheduleEventUuid}
                scheduleEventPause={scheduleEvent}
                date={eventDate}
                onMoveUp={order === 0 ? undefined : onMoveUp}
                onMoveDown={
                  order === Object.keys(selectedSchedule.events).length - 1
                    ? undefined
                    : onMoveDown
                }
                onDelete={onDelete}
              />
            );
          }
        })}

        <Stack gap={2}>
          <Stack direction="row" gap={4} justifyContent="space-between">
            <Typography variant="h6" component="h1">
              {`${format(nextEventDate, 'HH:mm')} - Fin de l'échéancier`}
            </Typography>
            <Tooltip title={'Doubler cliquez pour supprimer'}>
              <span>
                <Button
                  variant="outlined"
                  color="error"
                  onDoubleClick={() => {
                    delete schedules[selectedScheduleUuid];
                    setSelectedScheduleUuid(Object.keys(schedules).at(0));
                  }}
                  startIcon={<Delete />}
                >
                  Supprimer
                </Button>
              </span>
            </Tooltip>
          </Stack>
          <Typography variant="body1">
            Durée totale de la compétition :{' '}
            {isEqual(nextEventDate, new Date(selectedSchedule.startDate))
              ? '0 minute'
              : formatDuration(
                  intervalToDuration({
                    start: new Date(selectedSchedule.startDate),
                    end: nextEventDate,
                  }),
                  {
                    locale: fr,
                  }
                )}
          </Typography>
        </Stack>
      </Stack>
    </Stack>
  );
}

export const getServerSideProps = withCompetition('schedules');
