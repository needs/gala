import { Box, CircularProgress } from '@mui/material';

export default function Loading() {
  return (
    <Box display="flex" width="100%" padding={4} alignItems="center" justifyContent="center">
      <CircularProgress />
    </Box>
  );
}
