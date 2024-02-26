import { ArrowBack } from '@mui/icons-material';
import { Box, Chip, Tooltip } from '@mui/material';
import { useRouter } from 'next/router';

export default function LoginButton() {
  const router = useRouter();
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', textAlign: 'center' }}>
      <Tooltip title="S'authentifier">
        <Chip
          label="Login"
          icon={<ArrowBack fontSize="small" />}
          onClick={() => {
            router.push('/login');
          }}
        />
      </Tooltip>
    </Box>
  );
}
