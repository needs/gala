import { ReactNode, useEffect, useState } from 'react';
import { Competition, initStore, store } from '../lib/store';
import { Box, CircularProgress } from '@mui/material';
import { useCookies } from 'react-cookie';
import { useSyncedStore } from '@syncedstore/react';

const StoreProvider = ({
  children,
  competitionUuid,
}: {
  children: ReactNode;
  competitionUuid?: string;
}) => {
  const [storeLoaded, setStoreLoaded] = useState(false);
  const [cookies] = useCookies(['session']);
  const sessionCookie = cookies.session;

  useEffect(() => {
    const init = async () => {
      if (
        typeof window !== 'undefined' &&
        competitionUuid !== undefined &&
        sessionCookie !== undefined
      ) {
        return initStore(
          competitionUuid,
          sessionCookie,
          () => setStoreLoaded(true),
          () => setStoreLoaded(false)
        );
      }
    };
    init();
  }, [competitionUuid, sessionCookie]);

  if (competitionUuid !== undefined && !storeLoaded) {
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
