import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import LoginWindow from './components/LoginWindow';
import RegisterWindow from './components/RegisterWindow';
import HomeWindow from './components/HomeWindow';
import { useAuth } from './contexts/AuthContext';
import './App.css';

// Protected Route component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? children : <Navigate to="/login" />;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<LoginWindow />} />
          <Route path="/register" element={<RegisterWindow />} />
          <Route
            path="/home"
            element={
              <ProtectedRoute>
                <HomeWindow />
              </ProtectedRoute>
            }
          />
          <Route path="/" element={<Navigate to="/home" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
