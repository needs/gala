import { ReactNode, useEffect, useState } from 'react';
import { initStore } from '../lib/store';
import { Box, CircularProgress } from '@mui/material';
import { useCookies } from 'react-cookie';

const StoreProvider = ({
  children,
  galaUuid,
}: {
  children: ReactNode;
  galaUuid?: string;
}) => {
  const [storeLoaded, setStoreLoaded] = useState(false);
  const [cookies] = useCookies(['session']);
  const sessionCookie = cookies.session;

  useEffect(() => {
    const init = async () => {
      if (typeof window !== 'undefined' && galaUuid !== undefined && sessionCookie !== undefined) {

        return initStore(
          galaUuid,
          sessionCookie,
          () => setStoreLoaded(true),
          () => setStoreLoaded(false)
        );
      }
    };
    init();
  }, [galaUuid, sessionCookie]);

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
