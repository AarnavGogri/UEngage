// src/context/AuthContext.tsx

import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, onAuthStateChanged, signOut } from 'firebase/auth';
import { auth } from '../firebase';

interface AuthContextType {
  currentUser: User | null;
  logout: () => Promise<void>; // Add logout to the context type
}

const AuthContext = createContext<AuthContextType>({
  currentUser: null,
  logout: async () => {}, // Add a default logout function
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
    });
    return unsubscribe;
  }, []);

  // Define the logout function
  const logout = () => {
    return signOut(auth);
  };

  return (
    <AuthContext.Provider value={{ currentUser, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// import React, { createContext, useContext, useEffect, useState } from 'react';
// import { User, onAuthStateChanged } from 'firebase/auth';
// import { auth } from '../firebase';

// interface AuthContextType {
//   currentUser: User | null;
// }

// const AuthContext = createContext<AuthContextType>({ currentUser: null });

// export const useAuth = () => useContext(AuthContext);

// export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
//   const [currentUser, setCurrentUser] = useState<User | null>(null);

//   useEffect(() => {
//     const unsubscribe = onAuthStateChanged(auth, (user) => {
//       setCurrentUser(user);
//     });
//     return unsubscribe;
//   }, []);

//   return <AuthContext.Provider value={{ currentUser }}>{children}</AuthContext.Provider>;
// };
