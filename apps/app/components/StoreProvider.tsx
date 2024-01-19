import { ReactNode, useEffect, useState } from 'react';
import { initStore } from '../lib/store';
import { Box, CircularProgress } from '@mui/material';
import { useCookies } from 'react-cookie';
import { useRouter } from 'next/router';

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
  const router = useRouter();

  useEffect(() => {
    if (
      typeof window !== 'undefined' &&
      competitionUuid !== undefined &&
      sessionCookie !== undefined
    ) {
      return initStore(
        competitionUuid,
        sessionCookie,
        () => setStoreLoaded(true),
        () => setStoreLoaded(false),
        () => router.push('/login')
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
