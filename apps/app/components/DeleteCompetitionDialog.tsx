import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from '@mui/material';
import { useRouter } from 'next/router';
import { trpc } from '../utils/trpc';

export default function DeleteCompetitionDialog({
  isOpen,
  onClose,
  competitionUuid,
}: {
  isOpen: boolean;
  onClose: () => void;
  competitionUuid: string;
}) {
  const router = useRouter();
  const { mutateAsync: deleteCompetition } = trpc.delete.useMutation();

  return (
    <Dialog open={isOpen} onClose={onClose}>
      <DialogTitle id="alert-dialog-title">
        {'Supprimer définitivement la compétition ?'}
      </DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          {
            'Attention, une fois supprimée, il est impossible de récupérer la compétition.'
          }
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} autoFocus>
          Annuler
        </Button>
        <Button
          onClick={() => {
            deleteCompetition({ uuid: competitionUuid }).then(() => {
              router.push('/');
            });
          }}
          color="error"
        >
          Supprimer
        </Button>
      </DialogActions>
    </Dialog>
  );
}
