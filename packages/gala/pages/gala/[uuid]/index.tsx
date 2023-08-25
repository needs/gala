import React, { useEffect, useState } from 'react';
import {
  Alert,
  Avatar,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  FormControl,
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
import { Delete, Email } from '@mui/icons-material';

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
  showLabel,
  onChange,
}: {
  value: Role;
  showLabel?: boolean;
  onChange: (value: Role) => void;
}) => {
  return (
    <FormControl variant="standard">
      {showLabel && <InputLabel>Rôle</InputLabel>}
      <Select
        value={value}
        variant="standard"
        onChange={(event) => onChange(event.target.value as Role)}
      >
        <MenuItem value="OWNER">Organisateur</MenuItem>
        <MenuItem value="EDITOR">Collaborateur</MenuItem>
        <MenuItem value="READER">Observateur</MenuItem>
      </Select>
    </FormControl>
  );
};

const InviteMemberDialog = ({
  open,
  galaUuid,
  onClose,
  onInvited,
}: {
  open: boolean;
  galaUuid: string;
  onClose: () => void;
  onInvited: () => void;
}) => {
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<Role>('OWNER');
  const { mutateAsync: addMember, isError } = trpc.members.add.useMutation();

  useEffect(() => {
    if (open) {
      setEmail('');
      setRole('OWNER');
    }
  }, [open]);

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Ajouter un membre</DialogTitle>
      <DialogContent>
        <DialogContentText>
          {
            "Un email sera envoyé à l'adresse indiquée pour inviter la personne à rejoindre le GALA."
          }
        </DialogContentText>
        <Stack direction="column" gap={2}>
          {isError && (
            <Alert severity="error">
              {"Échec de l'envoie de l'invitation.  Veuillez réessayer."}
            </Alert>
          )}

          <TextField
            autoFocus
            margin="dense"
            label="Email"
            type="text"
            fullWidth
            variant="standard"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
          />
          <RoleSelector
            showLabel
            value={role}
            onChange={(role) => setRole(role)}
          />
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button
          startIcon={<Email />}
          onClick={() => {
            addMember({
              uuid: galaUuid,
              email,
              role,
            }).then(() => {
              onInvited();
            });
          }}
        >
          Inviter
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default function Index({ galaUuid }: { galaUuid: string }) {
  const { info } = useSyncedStore(store);

  const {
    data: members,
    isLoading: isMembersLoading,
    isError: isMembersError,
    refetch: refetchMembers,
  } = trpc.members.list.useQuery({
    uuid: galaUuid,
  });

  const [inviteMemberDialogOpen, setInviteMemberDialogOpen] = useState(false);

  return (
    <>
      <Head>
        <title>Général</title>
      </Head>
      <InviteMemberDialog
        galaUuid={galaUuid}
        open={inviteMemberDialogOpen}
        onClose={() => {
          setInviteMemberDialogOpen(false);
        }}
        onInvited={() => {
          setInviteMemberDialogOpen(false);
          refetchMembers();
        }}
      />
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
        <Stack direction="row" gap={2} justifyContent="space-between">
          <Typography variant="h6" component="h1">
            Membres
          </Typography>
          <Button
            variant="contained"
            startIcon={<Email />}
            onClick={() => setInviteMemberDialogOpen(true)}
          >
            Inviter
          </Button>
        </Stack>

        {isMembersLoading && <CircularProgress />}

        {isMembersError && (
          <Alert severity="error">
            Échec lors du chargement de la liste des membres.
          </Alert>
        )}

        {members !== undefined && (
          <List sx={{ width: '100%' }} disablePadding>
            {Object.entries(members ?? {}).map(([memberKey, member]) => {
              const name = member.name
                ? member.name
                : extractNameFromEmail(member.email);

              return (
                <ListItem key={member.email}>
                  <ListItemAvatar>
                    <Avatar
                      src={`https://ui-avatars.com/api/?${new URLSearchParams({
                        name,
                        format: 'svg',
                        background: 'random',
                      }).toString()}`}
                    ></Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={name}
                    secondary={`${member.email} - Ajouté le ${new Date(
                      member.joinedAt
                    ).toLocaleDateString('fr-FR')}`}
                  />
                  <Stack direction="row" gap={2} alignItems="center">
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
