import { ReactNode, useEffect, useState } from 'react';
import { initStore } from '../lib/store';
import { Box, CircularProgress } from '@mui/material';

const StoreProvider = ({ children, disabled }: { children: ReactNode, disabled?: boolean }) => {
  const [storeLoaded, setStoreLoaded] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined' && !disabled) {
      return initStore(
        () => setStoreLoaded(true),
        () => setStoreLoaded(false)
      );
    }
  }, [disabled]);

  if (!disabled && !storeLoaded) {
    return (
      <Box
        display="flex"
        width="100vw"
        height="100vh"
        padding={4}
        alignItems="center"
        justifyContent="center"
      >
        <CircularProgress />
      </Box>
    );
  } else {
    return <>{children}</>;
  }
};

export default StoreProvider;
