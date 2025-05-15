import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Button,
  Card,
  CardContent,
  CardMedia,
  Snackbar,
  Alert,
  AlertTitle
} from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import blackjackImage from '../assets/blackjack.png';
import missionImage from '../assets/mission.png';

// Define the same event name used for balance updates
const BALANCE_UPDATE_EVENT = 'BALANCE_UPDATE_EVENT';

interface NotificationState {
  open: boolean;
  message: string;
  severity: 'success' | 'error' | 'info';
  title?: string;
}

const HomeWindow: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [notification, setNotification] = useState<NotificationState>({
    open: false,
    message: '',
    severity: 'info'
  });

  // Check for payment notification from query params
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const paymentSuccess = params.get('payment_success');
    const paymentAmount = params.get('payment_amount');
    const paymentError = params.get('payment_error');
    
    if (paymentSuccess === 'true' && paymentAmount) {
      setNotification({
        open: true,
        message: `Successfully added $${parseFloat(paymentAmount).toFixed(2)} to your balance!`,
        severity: 'success',
        title: 'Payment Successful'
      });
      
      // Clean up the URL
      navigate('/', { replace: true });
    } else if (paymentError) {
      setNotification({
        open: true,
        message: decodeURIComponent(paymentError),
        severity: 'error',
        title: 'Payment Failed'
      });
      
      // Clean up the URL
      navigate('/', { replace: true });
    }
  }, [location.search, navigate]);

  // Listen for balance update events
  useEffect(() => {
    const handleBalanceUpdate = (event: CustomEvent) => {
      const newBalance = event.detail?.balance;
      const amount = event.detail?.amount;
      
      if (newBalance !== undefined) {
        setNotification({
          open: true,
          message: amount 
            ? `Successfully added $${amount.toFixed(2)} to your balance!` 
            : 'Your balance has been updated.',
          severity: 'success',
          title: 'Balance Updated'
        });
      }
    };

    // Add event listener
    document.addEventListener(
      BALANCE_UPDATE_EVENT, 
      handleBalanceUpdate as EventListener
    );

    // Clean up
    return () => {
      document.removeEventListener(
        BALANCE_UPDATE_EVENT, 
        handleBalanceUpdate as EventListener
      );
    };
  }, []);

  const handleCloseNotification = () => {
    setNotification({ ...notification, open: false });
  };

  return (
    <Box sx={{ 
      minHeight: 'calc(100vh - 64px)', // Subtract navbar height
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      py: 4
    }}>
      <Container maxWidth="lg">
        <Box sx={{ 
          display: 'flex', 
          gap: 4, 
          justifyContent: 'center',
          flexWrap: 'wrap',
          width: '100%'
        }}>
          <Card sx={{ 
            maxWidth: 400, 
            minWidth: 300,
            display: 'flex',
            flexDirection: 'column'
          }}>
            <CardContent>
              <Typography variant="h5" gutterBottom>
                Blackjack
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Classic card game against the dealer.
              </Typography>
            </CardContent>
            <Box sx={{ 
              width: '100%', 
              height: 200, 
              overflow: 'hidden',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <img 
                src={blackjackImage} 
                alt="Blackjack" 
                style={{ 
                  width: '100%', 
                  height: '100%', 
                  objectFit: 'cover' 
                }}
                onError={(e) => {
                  console.error('Error loading blackjack image');
                  const target = e.target as HTMLImageElement;
                  target.style.display = 'none';
                }}
              />
            </Box>
            <CardContent>
              <Typography variant="body2" color="text.secondary" paragraph>
                A classic card game where players compete against the dealer to reach 21 without going over.
              </Typography>
              <Button
                variant="contained"
                fullWidth
                onClick={() => navigate('/blackjack')}
                sx={{
                  bgcolor: 'primary.dark',
                  '&:hover': { bgcolor: 'primary.main' }
                }}
              >
                Play
              </Button>
            </CardContent>
          </Card>

          <Card sx={{ 
            maxWidth: 400, 
            minWidth: 300,
            display: 'flex',
            flexDirection: 'column'
          }}>
            <CardContent>
              <Typography variant="h5" gutterBottom>
                Mission Crossable
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Strategic survival gambling challenge.
              </Typography>
            </CardContent>
            <Box sx={{ 
              width: '100%', 
              height: 200, 
              overflow: 'hidden',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <img 
                src={missionImage} 
                alt="Mission Crossable" 
                style={{ 
                  width: '100%', 
                  height: '100%', 
                  objectFit: 'cover' 
                }}
                onError={(e) => {
                  console.error('Error loading mission image');
                  const target = e.target as HTMLImageElement;
                  target.style.display = 'none';
                }}
              />
            </Box>
            <CardContent>
              <Typography variant="body2" color="text.secondary" paragraph>
                A strategic gambling game where players navigate challenges, risking bets to survive and win rewards.
              </Typography>
              <Button
                variant="contained"
                fullWidth
                onClick={() => navigate('/mission-crossable')}
                sx={{
                  bgcolor: 'primary.dark',
                  '&:hover': { bgcolor: 'primary.main' }
                }}
              >
                Play
              </Button>
            </CardContent>
          </Card>
        </Box>
        
        {/* Snackbar for notifications */}
        <Snackbar
          open={notification.open}
          autoHideDuration={6000}
          onClose={handleCloseNotification}
          anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
          sx={{ mt: 2 }}
        >
          <Alert
            onClose={handleCloseNotification}
            severity={notification.severity}
            variant="filled"
            sx={{ width: '100%' }}
          >
            {notification.title && (
              <AlertTitle>{notification.title}</AlertTitle>
            )}
            {notification.message}
          </Alert>
        </Snackbar>
      </Container>
    </Box>
  );
};

export default HomeWindow; 