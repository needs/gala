import { Button, IconButton } from "@mui/material";
import { useState } from "react";
import SelectIconDialog, { Icon } from "./SelectIconDialog";
import * as Muicon from '@mui/icons-material';

export default function SelectIconButton({
  size,
  icon,
  onIcon,
}: {
  size?: 'small' | 'medium' | 'large'
  icon: Icon | undefined;
  onIcon: (icon: Icon) => void;
}) {
  const [open, setOpen] = useState(false);

  const renderIcon = () => {
    if (icon === undefined) {
      return <Muicon.ImageSearch sx={{ opacity: 0}} />;
    } else {
      const Element = Muicon[icon];
      return <Element />;
    }
  }

  return (
    <>
      <SelectIconDialog
        open={open}
        onClose={() => setOpen(false)}
        icon={icon}
        onChange={(icon) => { onIcon(icon); setOpen(false) }}
      />
      <Button onClick={() => setOpen(true)} size={size} sx={{ p: 2}} variant="outlined">
        {renderIcon()}
      </Button>
    </>
  );
}
