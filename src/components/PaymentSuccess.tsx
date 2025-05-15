import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { 
  Box, 
  Typography, 
  CircularProgress, 
  Button, 
  Paper, 
  Alert,
  AlertTitle,
  Divider
} from '@mui/material';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import apiClient from '../api/client';
import { useAuth } from '../contexts/AuthContext';

// Define the same event name used for balance updates
const BALANCE_UPDATE_EVENT = 'BALANCE_UPDATE_EVENT';

const PaymentSuccess: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [error, setError] = useState<string>('');
  const [paymentAmount, setPaymentAmount] = useState<number | null>(null);
  const [newBalance, setNewBalance] = useState<number | null>(null);

  useEffect(() => {
    const confirmPayment = async () => {
      try {
        const paymentIntentId = searchParams.get('payment_intent');
        const redirectStatus = searchParams.get('redirect_status');

        if (!paymentIntentId || redirectStatus !== 'succeeded') {
          setStatus('error');
          setError('Payment was not successful');
          return;
        }

        // Confirm the payment on the backend
        const response = await apiClient.post('/api/Payment/confirm', {
          paymentIntentId,
          userId: user?.id
        });

        // If we have the payment amount and new balance, store them
        if (response.data.balance) {
          setNewBalance(response.data.balance);
          
          // Dispatch a custom event to update balance in other components (e.g., Navbar)
          const event = new CustomEvent(BALANCE_UPDATE_EVENT, {
            detail: { balance: response.data.balance }
          });
          document.dispatchEvent(event);
        }
        
        // Try to get the payment amount from the URL parameters or response
        const amount = searchParams.get('payment_amount');
        if (amount) {
          setPaymentAmount(parseFloat(amount));
        }

        setStatus('success');
      } catch (err) {
        console.error('Error confirming payment:', err);
        setStatus('error');
        setError('Failed to confirm payment');
      }
    };

    confirmPayment();
  }, [searchParams, user?.id]);

  const handleReturnHome = () => {
    // Redirect to home with payment success info in URL params
    if (paymentAmount) {
      navigate(`/?payment_success=true&payment_amount=${paymentAmount}`);
    } else {
      navigate('/');
    }
  };

  if (status === 'loading') {
    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }}>
        <CircularProgress size={60} thickness={4} />
        <Typography variant="h6" sx={{ mt: 3 }}>
          Confirming your payment...
        </Typography>
      </Box>
    );
  }

  if (status === 'error') {
    return (
      <Paper 
        elevation={3} 
        sx={{ 
          maxWidth: 500, 
          mx: 'auto', 
          mt: 8, 
          p: 4, 
          textAlign: 'center',
          borderTop: '4px solid #f44336',
          borderRadius: 2
        }}
      >
        <ErrorOutlineIcon sx={{ fontSize: 64, color: '#f44336', mb: 2 }} />
        <Typography variant="h5" sx={{ mb: 2, fontWeight: 'bold' }}>
          Payment Error
        </Typography>
        <Alert severity="error" sx={{ mb: 3, mx: 'auto', textAlign: 'left' }}>
          <AlertTitle>Error</AlertTitle>
          {error}
        </Alert>
        <Divider sx={{ my: 3 }} />
        <Button 
          variant="contained" 
          onClick={handleReturnHome} 
          size="large"
          sx={{ px: 4 }}
        >
          Return to Home
        </Button>
      </Paper>
    );
  }

  return (
    <Paper 
      elevation={3} 
      sx={{ 
        maxWidth: 500, 
        mx: 'auto', 
        mt: 8, 
        p: 4, 
        textAlign: 'center',
        borderTop: '4px solid #4caf50',
        borderRadius: 2,
        animation: 'fadeIn 0.5s ease-in-out'
      }}
    >
      <CheckCircleOutlineIcon sx={{ fontSize: 64, color: '#4caf50', mb: 2 }} />
      <Typography variant="h5" sx={{ mb: 2, fontWeight: 'bold' }}>
        Payment Successful!
      </Typography>
      <Alert severity="success" sx={{ mb: 3, mx: 'auto', textAlign: 'left' }}>
        <AlertTitle>Success</AlertTitle>
        {paymentAmount ? 
          `You've successfully added $${paymentAmount.toFixed(2)} to your account.` : 
          'Your payment has been processed successfully.'
        }
      </Alert>
      {newBalance && (
        <Typography variant="body1" sx={{ mb: 2, fontWeight: 'medium' }}>
          Your new balance: <strong>${newBalance.toFixed(2)}</strong>
        </Typography>
      )}
      <Divider sx={{ my: 3 }} />
      <Button 
        variant="contained" 
        onClick={handleReturnHome} 
        size="large"
        color="success"
        sx={{ px: 4 }}
      >
        Return to Home
      </Button>
    </Paper>
  );
};

export default PaymentSuccess; 