import { User } from 'firebase/auth';
import nookies from 'nookies';
import { createContext, useContext, useEffect, useState } from 'react';
import { getFirebaseAppAuth } from '../lib/firebase';

const AuthContext = createContext<{ user: User | null, idToken: string | null }>({
  user: null,
  idToken: null,
});

export const useAuth = () => {
  return useContext(AuthContext);
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [idToken, setIdToken] = useState<string | null>(null);

  // Write token as a cookie so that it can be used server-side.
  useEffect(() => {
    const auth = getFirebaseAppAuth();

    return auth.onIdTokenChanged(async (user) => {
      if (!user) {
        setUser(null);
        setIdToken(null);
        nookies.destroy(undefined, 'token');
      } else {
        const idToken = await user.getIdToken();
        setUser(user);
        setIdToken(idToken);
        nookies.set(undefined, 'token', idToken, { path: '/' });
      }
    });
  }, []);

  // Force refresh the token every 10 minutes.
  useEffect(() => {
    const handle = setInterval(async () => {
      const auth = getFirebaseAppAuth();
      const user = auth.currentUser;
      if (user !== null) {
        await user.getIdToken(true);
      }
    }, 10 * 60 * 1000);

    return () => clearInterval(handle);
  }, []);

  return (
    <AuthContext.Provider value={{ user, idToken }}>{children}</AuthContext.Provider>
  );
}
