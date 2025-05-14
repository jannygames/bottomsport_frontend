import React, { createContext, useContext, useState, ReactNode } from 'react';
import { loginUser, logoutUser, getUserBalance } from '../api/client';

// Define the same event name used in MissionCrossable and Navbar
const BALANCE_UPDATE_EVENT = 'BALANCE_UPDATE_EVENT';

// Create a custom event to update balance across components
const createBalanceUpdateEvent = (newBalance: number) => {
  return new CustomEvent(BALANCE_UPDATE_EVENT, { 
    detail: { balance: newBalance },
    bubbles: true
  });
};

interface User {
  id: number;
  username: string;
  role: string;
}

interface AuthContextType {
  user: User | null;
  login: (username: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshBalance: () => Promise<void>;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  const login = async (username: string, password: string) => {
    try {
      console.log('AuthContext login - Username:', username);
      const userData = await loginUser({ username, password });
      console.log('AuthContext login - User data:', userData);
      setUser(userData);
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await logoutUser();
      setUser(null);
    } catch (error) {
      console.error('Logout failed:', error);
      throw error;
    }
  };

  const refreshBalance = async () => {
    if (!user?.id) return;
    
    try {
      const newBalance = await getUserBalance(user.id);
      // Dispatch the event to update balance in all components
      document.dispatchEvent(createBalanceUpdateEvent(newBalance));
      console.log('Balance refreshed globally:', newBalance);
      return newBalance;
    } catch (error) {
      console.error('Failed to refresh balance:', error);
    }
  };

  const value = {
    user,
    login,
    logout,
    refreshBalance,
    isAuthenticated: !!user,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext; 