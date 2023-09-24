import { Add } from '@mui/icons-material';
import { IconButton } from '@mui/material';
import { useState } from 'react';
import EditPlayerDialog from './EditPlayerDialog';
import { addPlayer, defaultPlayer } from '../lib/player';
import { Team, useCompetition } from '../lib/store';

export default function AddPlayerButton({ team }: { team?: Team }) {
  const { players } = useCompetition();
  const [playerKey, setPlayerKey] = useState<string | undefined>(undefined);
  const [open, setOpen] = useState(false);
  const player = playerKey !== undefined ? players[playerKey] : undefined;

  return (
    <>
      {player !== undefined && (
        <EditPlayerDialog
          open={open}
          onClose={() => setOpen(false)}
          player={player}
        />
      )}
      <IconButton
        onClick={() => {
          const playerKey = addPlayer(players, defaultPlayer);
          if (team !== undefined) {
            team.members[playerKey] = true;
          }
          setPlayerKey(playerKey);
          setOpen(true);
        }}
        size="small"
      >
        <Add />
      </IconButton>
    </>
  );
}
