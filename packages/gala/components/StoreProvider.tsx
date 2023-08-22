import { ReactNode, useEffect, useState } from 'react';
import { initStore } from '../lib/store';
import { Box, CircularProgress } from '@mui/material';
import { auth } from '../lib/firebase';

const StoreProvider = ({
  children,
  galaUuid,
}: {
  children: ReactNode;
  galaUuid?: string;
}) => {
  const [storeLoaded, setStoreLoaded] = useState(false);

  useEffect(() => {
    const init = async () => {
      if (typeof window !== 'undefined' && galaUuid !== undefined) {
        const token = await auth.currentUser?.getIdToken() ?? "";

        return initStore(
          galaUuid,
          token,
          () => setStoreLoaded(true),
          () => setStoreLoaded(false)
        );
      }
    };
    init();
  }, [galaUuid]);

  if (galaUuid !== undefined && !storeLoaded) {
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
