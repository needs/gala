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
import {
  HocuspocusProvider,
  onAwarenessUpdateParameters,
} from '@hocuspocus/provider';
import { useSyncedStore } from '@syncedstore/react';
import { trpc } from '../utils/trpc';
import { getUserName } from '../lib/avatar';

const context = createContext<{
  store: Store | undefined;
  provider: HocuspocusProvider | undefined;
  undoManager: UndoManager | undefined;
  awareness: onAwarenessUpdateParameters | undefined;
}>({
  store: undefined,
  provider: undefined,
  undoManager: undefined,
  awareness: undefined,
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
  const [awareness, setAwereness] = useState<
    onAwarenessUpdateParameters | undefined
  >(undefined);
  const [loadedCompetitionUuid, setLoadedCompetitionUuid] = useState<
    string | undefined
  >(undefined);

  const [cookies] = useCookies(['session']);
  const sessionCookie = cookies.session;
  const router = useRouter();

  const { data: user } = trpc.user.useQuery(null);

  useEffect(() => {
    if (
      competitionUuid !== undefined &&
      sessionCookie !== undefined &&
      user !== undefined && provider === undefined
    ) {
      const name = getUserName(user.email, user.name);
      const { store, provider, undoManager } = initStore(
        competitionUuid,
        sessionCookie,
        name,
        () => setStoreLoaded(true),
        () => {
          provider.destroy();
          router.push('/login');

          setStore(undefined);
          setProvider(undefined);
          setUndoManager(undefined);
          setAwereness(undefined);
          setLoadedCompetitionUuid(undefined);
          setStoreLoaded(false);
        },
        (awareness) => {
          setAwereness(awareness);
        }
      );

      setStore(store);
      setProvider(provider);
      setUndoManager(undoManager);
      setLoadedCompetitionUuid(competitionUuid);
    }
  }, [competitionUuid, provider, router, sessionCookie, user]);

  useEffect(() => {
    if (loadedCompetitionUuid !== undefined && competitionUuid !== loadedCompetitionUuid) {
      setStore(undefined);
      setProvider(undefined);
      setUndoManager(undefined);
      setAwereness(undefined);
      setLoadedCompetitionUuid(undefined);
      setStoreLoaded(false);
    }
  }, [competitionUuid, loadedCompetitionUuid]);

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
    return (
      <context.Provider
        value={{
          store,
          provider,
          undoManager,
          awareness,
        }}
      >
        {children}
      </context.Provider>
    );
  }
};

function useContextData() {
  const { store, provider, undoManager, awareness } = useContext(context);

  if (
    store === undefined ||
    provider === undefined ||
    undoManager === undefined ||
    awareness === undefined
  ) {
    throw new Error('useContext must be used inside StoreProvider');
  }

  return {
    store,
    provider,
    undoManager,
    awareness,
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

export function useAwareness() {
  const { awareness } = useContextData();
  return awareness;
}

export default StoreProvider;
