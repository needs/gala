import {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useState,
} from 'react';
import {
  Competition,
  Store,
  defaultCompetition,
  initStore,
} from '../lib/store';
import { Box, CircularProgress } from '@mui/material';
import { useCookies } from 'react-cookie';
import { useRouter } from 'next/router';
import { UndoManager } from 'yjs';
import { HocuspocusProvider } from '@hocuspocus/provider';
import { useSyncedStore } from '@syncedstore/react';

const context = createContext<{
  store: Store | undefined;
  provider: HocuspocusProvider | undefined;
  undoManager: UndoManager | undefined;
}>({
  store: undefined,
  provider: undefined,
  undoManager: undefined,
});

const StoreProvider = ({
  children,
  competitionUuid,
}: {
  children: ReactNode;
  competitionUuid?: string;
}) => {
  const [storeLoaded, setStoreLoaded] = useState(false);
  const [store, setStore] = useState<Store | undefined>(undefined);
  const [provider, setProvider] = useState<HocuspocusProvider | undefined>(
    undefined
  );
  const [undoManager, setUndoManager] = useState<UndoManager | undefined>(
    undefined
  );

  const [cookies] = useCookies(['session']);
  const sessionCookie = cookies.session;
  const router = useRouter();

  useEffect(() => {
    if (
      competitionUuid !== undefined &&
      sessionCookie !== undefined
    ) {
      const { store, provider, undoManager } = initStore(
        competitionUuid,
        sessionCookie,
        () => setStoreLoaded(true),
        () => setStoreLoaded(false)
      );

      setStore(store);
      setProvider(provider);
      setUndoManager(undoManager);

      return () => {
        provider.destroy();
        router.push('/login');

        setStore(undefined);
        setProvider(undefined);
        setUndoManager(undefined);
        setStoreLoaded(false);
      };
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [competitionUuid, sessionCookie]);

  if (
    competitionUuid !== undefined && !storeLoaded
  ) {
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
    return (
      <context.Provider
        value={{
          store,
          provider,
          undoManager,
        }}
      >
        {children}
      </context.Provider>
    );
  }
};

function useContextData() {
  const {
    store,
    provider,
    undoManager,
  } = useContext(context);

  if (store === undefined || provider === undefined || undoManager === undefined) {
    throw new Error('useContext must be used inside StoreProvider');
  }

  return {
    store,
    provider,
    undoManager,
  };
}

export function useCompetition(): Competition {
  const { store } = useContextData();
  const { competition } = useSyncedStore(store);

  const missingEntries = Object.fromEntries(
    Object.entries(defaultCompetition).filter(([key]) => !(key in competition))
  );

  return Object.assign(competition, missingEntries) as Competition;
}

export function useUndoManager() {
  const { undoManager } = useContextData();
  return undoManager;
}

export default StoreProvider;
