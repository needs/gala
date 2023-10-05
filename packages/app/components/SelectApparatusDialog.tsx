import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Stack,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import {
  ApparatusKey,
  getApparatusIconPath,
  getApparatusName,
} from '../lib/store';
import Image from 'next/image';

export default function SelectApparatusDialog({
  apparatuses,
  open,
  onSelect,
  onClose,
}: {
  apparatuses: ApparatusKey[];
  open: boolean;
  onSelect: (apparatus: ApparatusKey) => void;
  onClose: () => void;
}) {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Selectionner un agrès</DialogTitle>
      <DialogContent>
        <Stack direction="column" spacing={2}>
          <List
            sx={{
              width: 360,
              height: 300,
              bgcolor: 'background.paper',
              overflowY: 'auto',
            }}
            dense
            disablePadding
          >
            {apparatuses.map((apparatuseKey) => {
              return (
                <ListItemButton
                  key={apparatuseKey}
                  onClick={() => onSelect(apparatuseKey)}
                >
                  <ListItemIcon>
                    <Image
                      src={getApparatusIconPath(apparatuseKey)}
                      alt={getApparatusName(apparatuseKey)}
                      width={24}
                      height={24}
                    />
                  </ListItemIcon>
                  <ListItemText primary={getApparatusName(apparatuseKey)} />
                </ListItemButton>
              );
            })}
          </List>
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Fermer</Button>
      </DialogActions>
    </Dialog>
  );
}
