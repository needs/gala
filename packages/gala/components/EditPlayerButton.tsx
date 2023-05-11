import { Chip, Avatar } from "@mui/material";
import { useState } from "react";
import { Player } from "../lib/database";
import { fullName } from "../lib/utils";
import EditPlayerDialog from "./EditPlayerDialog";
import GenderIcon from "./GenderIcon";

export default function EditPlayerButton({
  player,
  onChange,
}: {
  player: Player;
  onChange: (player: Player) => void;
}) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <EditPlayerDialog
        open={open}
        onCancel={() => setOpen(false)}
        onValidate={(player) => {
          onChange(player);
          setOpen(false);
        }}
        player={player}
      />
      <Chip
        avatar={
          <Avatar sx={{ bgcolor: 'transparent' }}>
            <GenderIcon gender={player.gender} />
          </Avatar>
        }
        onClick={() => setOpen(true)}
        label={fullName(player)}
        variant="outlined"
      />
    </>
  );
}
