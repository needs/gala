import { Stack, Typography } from '@mui/material';
import { withAuthGala } from '../../../lib/auth';

export default function TimelinePage() {
  return (
    <Stack direction="column" padding={4} gap={4}>
      <Stack
        direction="row"
        gap={2}
        alignItems="center"
        justifyContent="space-between"
      >
        <Typography variant="h6" component="h1">
          Échéancier
        </Typography>
      </Stack>
    </Stack>
  );
}

export const getServerSideProps = withAuthGala('timeline');
