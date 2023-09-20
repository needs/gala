import { Box } from '@mui/material';
import { ReactNode } from 'react';

// Insppired by https://codepen.io/leon-ho/pen/AEOvWP
export default function TvFrame({ children, height, width }: { children: ReactNode, height: number, width: number }) {
  return (
    <Box className="tv-frame-monitor" sx={{ height, width }}>
      {children}
    </Box>
  );
}
