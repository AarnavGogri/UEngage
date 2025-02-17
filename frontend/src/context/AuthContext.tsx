import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { onAuthStateChanged, User, signOut } from 'firebase/auth';
import { auth } from '../firebase';

interface AuthContextProps {
  currentUser: User | null;
  logout: () => Promise<void>;
}

interface AuthProviderProps {
  children: ReactNode;
}

// Create the context
const AuthContext = createContext<AuthContextProps | undefined>(undefined);

// Custom hook to use AuthContext
export const useAuth = (): AuthContextProps => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// ✅ Corrected version of AuthProvider
export function AuthProvider({ children }: AuthProviderProps): JSX.Element {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const logout = async () => {
    await signOut(auth);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <AuthContext.Provider value={{ currentUser, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
