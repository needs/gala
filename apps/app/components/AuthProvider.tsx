import { User } from 'firebase/auth';
import nookies from 'nookies';
import { createContext, useEffect, useState } from 'react';
import { getFirebaseAppAuth } from '../lib/firebase';

const AuthContext = createContext<{ user: User | null }>({
  user: null,
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  // Write token as a cookie so that it can be used server-side.
  useEffect(() => {
    const auth = getFirebaseAppAuth();

    return auth.onIdTokenChanged(async (user) => {
      if (!user) {
        setUser(null);
        nookies.set(undefined, 'token', '', { path: '/' });
      } else {
        const token = await user.getIdToken();
        setUser(user);
        nookies.set(undefined, 'token', token, { path: '/' });
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
    <AuthContext.Provider value={{ user }}>{children}</AuthContext.Provider>
  );
}
