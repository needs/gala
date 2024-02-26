import { Box, Typography } from '@mui/material';

export default function ScheduleEventPause() {
  return (
    <Box
      paddingY={2}
      paddingX={4}
      borderRadius={2}
      sx={{
        backgroundImage: 'url("/background-pause.svg")',
        backgroundRepeat: 'no-repeat',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <Typography variant="h6" component="h2" color="ActiveBorder">
        Pause
      </Typography>
    </Box>
  );
}
