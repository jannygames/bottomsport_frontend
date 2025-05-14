import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Box, Typography, CircularProgress, Button } from '@mui/material';
import apiClient from '../api/client';
import { useAuth } from '../contexts/AuthContext';

const PaymentSuccess: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [error, setError] = useState<string>('');

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
        await apiClient.post('/api/Payment/confirm', {
          paymentIntentId,
          userId: user?.id
        });

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
    navigate('/');
  };

  if (status === 'loading') {
    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }}>
        <CircularProgress />
        <Typography variant="h6" sx={{ mt: 2 }}>
          Confirming your payment...
        </Typography>
      </Box>
    );
  }

  if (status === 'error') {
    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }}>
        <Typography variant="h6" color="error" sx={{ mb: 2 }}>
          {error}
        </Typography>
        <Button variant="contained" onClick={handleReturnHome}>
          Return to Home
        </Button>
      </Box>
    );
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }}>
      <Typography variant="h4" sx={{ mb: 2 }}>
        Payment Successful!
      </Typography>
      <Typography variant="body1" sx={{ mb: 4 }}>
        Your balance has been updated.
      </Typography>
      <Button variant="contained" onClick={handleReturnHome}>
        Return to Home
      </Button>
    </Box>
  );
};

export default PaymentSuccess; 