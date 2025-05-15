import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  Button,
  IconButton,
  Menu,
  MenuItem,
  Snackbar,
  Alert,
} from '@mui/material';
import logo from '../assets/logo.png';
import PaymentDialog from './PaymentDialog';
import CashoutDialog from './CashoutDialog';
import { getUserBalance } from '../api/client';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5251';

// Define the same event name used in MissionCrossable
const BALANCE_UPDATE_EVENT = 'BALANCE_UPDATE_EVENT';

const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [isPaymentDialogOpen, setIsPaymentDialogOpen] = useState(false);
  const [isCashoutDialogOpen, setIsCashoutDialogOpen] = useState(false);
  const [balance, setBalance] = useState<number>(0);
  const [notification, setNotification] = useState<{type: 'success' | 'error', message: string} | null>(null);

  useEffect(() => {
    if (user) {
      fetchBalance();
    }
  }, [user]);

  // Add event listener for balance updates from other components
  useEffect(() => {
    const handleBalanceUpdate = (event: CustomEvent) => {
      const newBalance = event.detail?.balance;
      if (newBalance !== undefined && typeof newBalance === 'number') {
        console.log('Navbar received balance update:', newBalance);
        setBalance(newBalance);
      }
    };

    // Add event listener
    document.addEventListener(BALANCE_UPDATE_EVENT, handleBalanceUpdate as EventListener);

    // Clean up
    return () => {
      document.removeEventListener(BALANCE_UPDATE_EVENT, handleBalanceUpdate as EventListener);
    };
  }, []);

  const fetchBalance = async () => {
    if (user) {
      try {
        const newBalance = await getUserBalance(user.id);
        setBalance(newBalance);
      } catch (error) {
        console.error('Error fetching balance:', error);
      }
    }
  };

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    logout();
    handleMenuClose();
    navigate('/login');
  };

  const handlePaymentSuccess = () => {
    fetchBalance();
    setNotification({
      type: 'success',
      message: 'Payment successful! Your balance has been updated.'
    });
  };
  
  const handleCashoutSuccess = () => {
    fetchBalance();
    setNotification({
      type: 'success',
      message: 'Cashout successful! Your balance has been updated.'
    });
  };
  
  const handleCloseNotification = () => {
    setNotification(null);
  };

  if (!user) return null;

  return (
    <>
      <AppBar position="absolute" sx={{ bgcolor: 'white', boxShadow: 1 }}>
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1, color: 'black' }}>
            <Box component="img" src={logo} alt="BottomSport" sx={{ height: 40 }} onClick={() => navigate('/')} />
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
            <Button 
              color="inherit" 
              sx={{ color: 'black' }}
              onClick={() => navigate('/')}
            >
              Home
            </Button>
            <Button 
              color="inherit" 
              sx={{ color: 'black' }}
              onClick={() => navigate('/blackjack')}
            >
              Blackjack
            </Button>
            <Button 
              color="inherit" 
              sx={{ color: 'black' }}
              onClick={() => navigate('/mission-crossable')}
            >
              Mission Crossable
            </Button>
            <Button 
              color="inherit" 
              sx={{ color: 'black' }}
              onClick={() => navigate('/mission-leaderboard')}
            >
              MC Leaderboard
            </Button>
            <Button 
              color="inherit" 
              sx={{ color: 'black' }}
              onClick={() => navigate('/mission-stats')}
            >
              MC Statistics
            </Button>
            <Button 
              color="inherit" 
              sx={{ color: 'black' }}
              onClick={() => navigate('/settings')}
            >
              Settings
            </Button>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Typography variant="body1" sx={{ color: 'black' }}>
                Balance: <span className="balance-amount">${balance.toFixed(2)}</span>
              </Typography>
              <Box sx={{ display: 'flex', gap: 1 }}>
                <Button
                  variant="contained"
                  size="small"
                  onClick={() => setIsPaymentDialogOpen(true)}
                  sx={{ bgcolor: 'primary.main', '&:hover': { bgcolor: 'primary.dark' } }}
                >
                  Top Up
                </Button>
                <Button
                  variant="outlined"
                  size="small"
                  onClick={() => setIsCashoutDialogOpen(true)}
                  sx={{ 
                    borderColor: 'secondary.main', 
                    color: 'secondary.main',
                    '&:hover': { 
                      bgcolor: 'secondary.light',
                      borderColor: 'secondary.dark'
                    } 
                  }}
                >
                  Cashout
                </Button>
              </Box>
            </Box>
            <IconButton 
              onClick={handleMenuOpen} 
              sx={{ color: 'black' }}
            >
              <AccountCircleIcon />
            </IconButton>
            <Typography variant="body1" sx={{ color: 'black' }}>
              Welcome, {user.username}!
            </Typography>
          </Box>
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
          >
            <MenuItem onClick={handleLogout}>Logout</MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>
      
      {user && (
        <>
          <PaymentDialog
            open={isPaymentDialogOpen}
            onClose={() => setIsPaymentDialogOpen(false)}
            userId={user.id}
            onSuccess={handlePaymentSuccess}
          />
          <CashoutDialog
            open={isCashoutDialogOpen}
            onClose={() => setIsCashoutDialogOpen(false)}
            userId={user.id}
            onSuccess={handleCashoutSuccess}
          />
        </>
      )}
      
      <Snackbar 
        open={!!notification} 
        autoHideDuration={5000} 
        onClose={handleCloseNotification}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert 
          onClose={handleCloseNotification} 
          severity={notification?.type || 'success'} 
          variant="filled"
          elevation={6}
        >
          {notification?.message || ''}
        </Alert>
      </Snackbar>
    </>
  );
};

export default Navbar; 