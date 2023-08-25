import React from 'react';
import {
  Alert,
  Avatar,
  CircularProgress,
  FormControl,
  Icon,
  IconButton,
  InputLabel,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import Head from 'next/head';
import { store } from '../../../lib/store';
import { useSyncedStore } from '@syncedstore/react';
import { withAuthGala } from '../../../lib/auth';
import { trpc } from '../../../utils/trpc';
import { Role } from '@prisma/client';
import { Delete } from '@mui/icons-material';

function capitalizeFirstLetter(string: string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

function extractNameFromEmail(email: string) {
  return email
    .split('@')[0]
    .replace(/[0-9]/g, '')
    .split(/[.-_]+/)
    .map(capitalizeFirstLetter)
    .join(' ');
}

const RoleSelector = ({
  value,
  onChange,
}: {
  value: Role;
  onChange: (value: Role) => void;
}) => {
  return (
    <Select
      value={value}
      variant="standard"
      onChange={(event) => onChange(event.target.value as Role)}
      size="small"
    >
      <MenuItem value="OWNER">Organisateur</MenuItem>
      <MenuItem value="EDITOR">Collaborateur</MenuItem>
      <MenuItem value="READER">Observateur</MenuItem>
    </Select>
  );
};

export default function Index({ galaUuid }: { galaUuid: string }) {
  const { info } = useSyncedStore(store);
  const {
    data: members,
    isLoading: isMembersLoading,
    isError: isMembersError,
  } = trpc.members.list.useQuery({
    uuid: galaUuid,
  });

  console.log('members', members);

  return (
    <>
      <Head>
        <title>Général</title>
      </Head>
      <Stack padding={4} gap={4}>
        <Typography variant="h6" component="h1">
          Information générales
        </Typography>
        <TextField
          label="Nom du GALA"
          value={info.galaName}
          onChange={(e) => {
            info.galaName = e.target.value;
          }}
        />
        <Typography variant="h6" component="h1">
          Membres
        </Typography>
        {isMembersLoading && <CircularProgress />}
        {isMembersError && (
          <Alert severity="error">
            Échec lors du chargement de la liste des membres.
          </Alert>
        )}

        {members !== undefined && (
          <List sx={{ width: '100%', maxWidth: 1000 }} disablePadding>
            {Object.entries(members ?? {}).map(([memberKey, member]) => {
              const name = member.name
                ? member.name
                : extractNameFromEmail(member.email);

              return (
                <ListItem
                  key={member.email}
                >
                  <ListItemAvatar>
                    <Avatar
                      src={`https://ui-avatars.com/api/?${new URLSearchParams({
                        name: member.email,
                        format: 'svg',
                      }).toString()}`}
                    ></Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={name}
                    secondary={`${member.email} - Ajouté le ${new Date(member.joinedAt).toLocaleDateString('fr-FR')}`}
                  />
                                      <Stack direction="row" gap={2}>
                      <RoleSelector value={member.role} onChange={() => ({})} />
                      <IconButton edge="end">
                        <Delete />
                      </IconButton>
                    </Stack>

                </ListItem>
              );
            })}
          </List>
        )}
      </Stack>
    </>
  );
}

export const getServerSideProps = withAuthGala('info');
