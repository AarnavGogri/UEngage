// src/App.tsx

import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';

import NavBar from './components/NavBar';
import Home from './pages/Home';
import Clubs from './pages/Clubs';
import Login from './pages/Login';
import Profile from './pages/Profile';
import CreateClub from './pages/CreateClub';
import Events from './pages/Events';


const PrivateRoute: React.FC<{ children: JSX.Element }> = ({ children }) => {
  const { currentUser } = useAuth();
  return currentUser ? children : <Navigate to="/login" />;
};

const App: React.FC = () => (
  <AuthProvider>
    <Router>
      <NavBar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/clubs" element={<Clubs />} />
        <Route path="/login" element={<Login />} />
        <Route path="/events" element={<Events />} />
        <Route
          path="/profile"
          element={
            <PrivateRoute>
              <Profile />
            </PrivateRoute>
          }
        />
        <Route
          path="/create-club"
          element={
            <PrivateRoute>
              <CreateClub />
            </PrivateRoute>
          }
        />
      </Routes>
    </Router>
  </AuthProvider>
);

export default App;
