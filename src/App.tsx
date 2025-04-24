import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Login from './components/LoginWindow';
import Register from './components/RegisterWindow';
import Navbar from './components/Navbar';
import HomeWindow from './components/HomeWindow';
import BlackjackWindow from './components/BlackjackWindow';
import './App.css';

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  return <>{children}</>;
};

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <div className="min-h-screen bg-gray-50">
          <Navbar />
          <main className="pt-16">
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/" element={
                <ProtectedRoute>
                  <HomeWindow />
                </ProtectedRoute>
              } />
              <Route path="/home" element={
                <ProtectedRoute>
                  <HomeWindow />
                </ProtectedRoute>
              } />
              <Route path="/blackjack" element={
                <ProtectedRoute>
                  <BlackjackWindow />
                </ProtectedRoute>
              } />
              <Route path="/blackjack/room/:roomId" element={
                <ProtectedRoute>
                  <div>Blackjack Game Room</div>
                </ProtectedRoute>
              } />
              <Route path="/mission-crossable" element={
                <ProtectedRoute>
                  <div>Mission Crossable Page</div>
                </ProtectedRoute>
              } />
              <Route path="/settings" element={
                <ProtectedRoute>
                  <div>Settings Page</div>
                </ProtectedRoute>
              } />
            </Routes>
          </main>
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
