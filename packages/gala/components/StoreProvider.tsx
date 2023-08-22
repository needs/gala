import { ReactNode, useEffect, useId, useState } from 'react';
import { initStore } from '../lib/store';
import { Box, CircularProgress } from '@mui/material';
import { auth } from '../lib/firebase';
import { useIdToken } from 'react-firebase-hooks/auth';

const StoreProvider = ({
  children,
  galaUuid,
}: {
  children: ReactNode;
  galaUuid?: string;
}) => {
  const [storeLoaded, setStoreLoaded] = useState(false);
  const [user, loadingUser] = useIdToken(auth);

  useEffect(() => {
    const init = async () => {
      if (typeof window !== 'undefined' && galaUuid !== undefined && !loadingUser) {
        const token = await user?.getIdToken() ?? "";

        return initStore(
          galaUuid,
          token,
          () => setStoreLoaded(true),
          () => setStoreLoaded(false)
        );
      }
    };
    init();
  }, [galaUuid, loadingUser, user]);

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
