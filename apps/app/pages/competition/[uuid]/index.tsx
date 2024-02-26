import React, { useEffect, useState } from 'react';
import {
  Alert,
  Avatar,
  Box,
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
  Tooltip,
  Typography,
} from '@mui/material';
import Head from 'next/head';

import { withCompetition } from '../../../lib/auth';
import { trpc } from '../../../utils/trpc';
import { Role } from '@prisma/client';
import { Delete, Email } from '@mui/icons-material';
import { avatarUrl, getUserName } from '../../../lib/avatar';
import { useCompetition } from '../../../components/StoreProvider';
import DeleteCompetitionDialog from '../../../components/DeleteCompetitionDialog';

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
        <MenuItem value="OWNER">
          <ListItemText primary="Organisateur" secondary="Accès total" />
        </MenuItem>
        <MenuItem value="EDITOR">
          <ListItemText
            primary="Collaborateur"
            secondary="Accès total sauf gestion des droits"
          />
        </MenuItem>
        <MenuItem value="READER">
          <ListItemText primary="Observateur" secondary="Lecture seule" />
        </MenuItem>
      </Select>
    </FormControl>
  );
};

const InviteMemberDialog = ({
  open,
  competitionUuid,
  onClose,
  onInvited,
}: {
  open: boolean;
  competitionUuid: string;
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
            "Un email sera envoyé à l'adresse indiquée pour inviter la personne à rejoindre la compétition."
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
              uuid: competitionUuid,
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

function MembersListSection({ competitionUuid }: { competitionUuid: string }) {
  const {
    data: members,
    isLoading: isMembersLoading,
    isError: isMembersError,
    refetch: refetchMembers,
  } = trpc.members.list.useQuery({
    uuid: competitionUuid,
  });

  const { mutateAsync: removeMember } = trpc.members.remove.useMutation();
  const { mutateAsync: updateMemberRole } =
    trpc.members.updateRole.useMutation();
  const [inviteMemberDialogOpen, setInviteMemberDialogOpen] = useState(false);

  return (
    <Stack gap={4}>
      <Stack direction="row" gap={2} justifyContent="space-between">
        <InviteMemberDialog
          competitionUuid={competitionUuid}
          open={inviteMemberDialogOpen}
          onClose={() => {
            setInviteMemberDialogOpen(false);
          }}
          onInvited={() => {
            setInviteMemberDialogOpen(false);
            refetchMembers();
          }}
        />

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
            const name = getUserName(member.email, member.name);
            const joinedAt = new Date(member.joinedAt);

            return (
              <ListItem key={member.email}>
                <ListItemAvatar>
                  <Avatar src={avatarUrl(name)} />
                </ListItemAvatar>
                <ListItemText
                  primary={name}
                  secondary={`${
                    member.email
                  } - Ajouté le ${joinedAt.toLocaleDateString(
                    'fr-FR'
                  )} à ${joinedAt.toLocaleTimeString('fr-FR', {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}`}
                />
                <Stack direction="row" gap={2} alignItems="center">
                  <RoleSelector
                    value={member.role}
                    onChange={(role) => {
                      updateMemberRole({
                        uuid: competitionUuid,
                        email: member.email,
                        role,
                      }).then(() => {
                        refetchMembers();
                      });
                    }}
                  />
                  <Tooltip title="Double cliquez pour supprimer">
                    <IconButton
                      edge="end"
                      onDoubleClick={() => {
                        removeMember({
                          uuid: competitionUuid,
                          email: member.email,
                        }).then(() => {
                          refetchMembers();
                        });
                      }}
                    >
                      <Delete />
                    </IconButton>
                  </Tooltip>
                </Stack>
              </ListItem>
            );
          })}
        </List>
      )}
    </Stack>
  );
}

function DeleteCompetitionSection({ competitionUuid }: { competitionUuid: string }) {
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);

  return (
    <Stack gap={4}>
      <Typography variant="h6" component="h1">
        Supprimer la compétition
      </Typography>
      <Stack direction="column" gap={2}>
        <Typography variant="body1">
          Attention, une fois supprimée, il est impossible de récupérer la
          compétition.
        </Typography>
        <Box>
          <Button
            variant="contained"
            color="error"
            onClick={() => setOpenDeleteDialog(true)}
          >
            Supprimer
          </Button>
          <DeleteCompetitionDialog
            isOpen={openDeleteDialog}
            onClose={() => setOpenDeleteDialog(false)}
            competitionUuid={competitionUuid}
          />
        </Box>
      </Stack>
    </Stack>
  );
}

export default function Index({
  competitionUuid,
}: {
  competitionUuid: string;
}) {
  const { info } = useCompetition();
  const { data: user } = trpc.user.useQuery({ competitionUuid });

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
          label="Nom de la compétition"
          value={info.name}
          onChange={(e) => {
            info.name = e.target.value;
          }}
        />

        {user !== undefined && user.role !== Role.READER && (
          <MembersListSection competitionUuid={competitionUuid} />
        )}

        {user !== undefined && user.role === Role.OWNER && (
          <DeleteCompetitionSection competitionUuid={competitionUuid} />
        )}
      </Stack>
    </>
  );
}

export const getServerSideProps = withCompetition('info');
