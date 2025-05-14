import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Login from './components/LoginWindow';
import Register from './components/RegisterWindow';
import Navbar from './components/Navbar';
import HomeWindow from './components/HomeWindow';
import BlackjackWindow from './components/BlackjackWindow';
import MissionCrossable from './components/MissionCrossable';
import Settings from './components/Settings';
import PaymentSuccess from './components/PaymentSuccess';
import './App.css';

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  return <>{children}</>;
};

const PrivateRoute: React.FC<{ element: React.ReactElement }> = ({ element }) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? element : <Navigate to="/login" />;
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gray-50">
          <Navbar />
          <main className="pt-16">
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/" element={<PrivateRoute element={<HomeWindow />} />} />
              <Route path="/home" element={<PrivateRoute element={<HomeWindow />} />} />
              <Route path="/blackjack" element={<PrivateRoute element={<BlackjackWindow />} />} />
              <Route path="/blackjack/room/:roomId" element={
                <ProtectedRoute>
                  <div>Blackjack Game Room</div>
                </ProtectedRoute>
              } />
              <Route path="/mission-crossable" element={<PrivateRoute element={<MissionCrossable />} />} />
              <Route path="/settings" element={<PrivateRoute element={<Settings />} />} />
              <Route path="/payment-success" element={<PrivateRoute element={<PaymentSuccess />} />} />
            </Routes>
          </main>
        </div>
      </Router>
    </AuthProvider>
  );
};

export default App;
