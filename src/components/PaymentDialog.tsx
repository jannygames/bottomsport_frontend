import React, { useState, useEffect, useRef } from 'react';
import { 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  Button, 
  TextField, 
  Typography, 
  Box, 
  CircularProgress,
  Snackbar,
  Alert
} from '@mui/material';
import { loadStripe } from '@stripe/stripe-js';
import { 
  Elements, 
  PaymentElement, 
  useStripe, 
  useElements
} from '@stripe/react-stripe-js';
import apiClient from '../api/client';

// Initialize Stripe
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || '');

// Define the same event name used for balance updates
const BALANCE_UPDATE_EVENT = 'BALANCE_UPDATE_EVENT';

interface PaymentDialogProps {
  open: boolean;
  onClose: () => void;
  userId: number;
  onSuccess: () => void;
}

const PaymentForm = ({ onSuccess, onClose, userId }: { onSuccess: () => void; onClose: () => void; userId: number }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [amount, setAmount] = useState<number>(5);
  const [error, setError] = useState<string>('');
  const [processing, setProcessing] = useState(false);
  const amountRef = useRef(amount);
  const [notification, setNotification] = useState<{
    open: boolean;
    message: string;
    severity: 'success' | 'error';
  }>({
    open: false,
    message: '',
    severity: 'success'
  });

  // Update the ref whenever amount changes
  useEffect(() => {
    amountRef.current = amount;
  }, [amount]);

  const closeNotification = () => {
    setNotification({...notification, open: false});
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    
    if (!stripe || !elements) {
      setError('Stripe not loaded');
      return;
    }

    if (amount < 5) {
      setError('Minimum amount is $5');
      return;
    }

    setProcessing(true);
    setError('');

    try {
      // Step 1: Trigger form validation and wallet collection
      const { error: submitError } = await elements.submit();
      if (submitError) {
        console.error('Elements submission error:', submitError);
        setError(submitError.message || 'Payment validation failed');
        setProcessing(false);
        return;
      }

      // Step 2: Create a PaymentIntent on the server with automatic_payment_methods enabled
      const amountInCents = Math.round(amount * 100);
      console.log(`Creating payment intent for $${amount} (${amountInCents} cents)`);
      
      const response = await apiClient.post('/api/Payment/create-intent', { 
        amount: amountInCents,
        userId 
      });

      const { clientSecret } = response.data;
      console.log(`Received client secret: ${clientSecret.substring(0, 20)}...`);

      // Step 3: Confirm the payment using the Elements instance
      const { error: confirmError, paymentIntent } = await stripe.confirmPayment({
        elements,
        clientSecret,
        confirmParams: {
          return_url: `${window.location.origin}/payment-success?payment_amount=${amount}`,
        },
        redirect: 'if_required'
      });

      if (confirmError) {
        setError(confirmError.message || 'An error occurred');
        console.error('Payment error:', confirmError);
        setNotification({
          open: true,
          message: confirmError.message || 'Payment failed',
          severity: 'error'
        });
      } else if (paymentIntent && paymentIntent.status === 'succeeded') {
        console.log('Payment succeeded:', paymentIntent);
        
        // Step 4: Notify the backend about the successful payment
        const confirmResponse = await apiClient.post('/api/Payment/confirm', { 
          paymentIntentId: paymentIntent.id 
        });
        
        console.log('Payment confirmation response:', confirmResponse.data);
        
        if (confirmResponse.data.success === true || confirmResponse.data.message) {
          // Either response format is acceptable
          const newBalance = confirmResponse.data.balance || 'Unknown';
          console.log('Balance updated:', newBalance);
          
          // Show success notification
          setNotification({
            open: true,
            message: `Successfully added $${amount.toFixed(2)} to your balance!`,
            severity: 'success'
          });
          
          // Dispatch a custom event to update balance in other components (e.g., Navbar)
          if (typeof newBalance === 'number') {
            const event = new CustomEvent(BALANCE_UPDATE_EVENT, {
              detail: { 
                balance: newBalance,
                amount: amount 
              }
            });
            document.dispatchEvent(event);
          }
          
          // Wait for notification to be visible before closing
          setTimeout(() => {
            onSuccess();
            onClose();
          }, 2000);
        } else {
          setError('Failed to update balance. Please contact support.');
          setNotification({
            open: true,
            message: 'Failed to update balance',
            severity: 'error'
          });
        }
      } else {
        setError('Payment not completed. Please try again.');
        setNotification({
          open: true,
          message: 'Payment not completed',
          severity: 'error'
        });
      }
    } catch (err) {
      console.error('Payment error:', err);
      setError('An error occurred while processing your payment');
      setNotification({
        open: true,
        message: 'An error occurred while processing your payment',
        severity: 'error'
      });
    } finally {
      setProcessing(false);
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit}>
        <Box sx={{ mb: 2 }}>
          <TextField
            fullWidth
            label="Amount ($)"
            type="number"
            value={amount}
            onChange={(e) => setAmount(Number(e.target.value))}
            inputProps={{ min: 5, step: 1 }}
            error={!!error}
            helperText={error || 'Minimum amount is $5'}
            sx={{ mb: 2 }}
            disabled={processing}
          />
          <PaymentElement />
        </Box>
        <Button
          type="submit"
          variant="contained"
          fullWidth
          disabled={!stripe || !elements || processing}
          sx={{ mt: 2, position: 'relative' }}
        >
          {processing ? (
            <>
              <CircularProgress 
                size={24} 
                sx={{ 
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  marginTop: '-12px',
                  marginLeft: '-12px',
                }} 
              />
              Processing...
            </>
          ) : `Pay $${amount.toFixed(2)}`}
        </Button>
      </form>
      
      <Snackbar
        open={notification.open}
        autoHideDuration={6000}
        onClose={closeNotification}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={closeNotification}
          severity={notification.severity}
          variant="filled"
          sx={{ width: '100%' }}
        >
          {notification.message}
        </Alert>
      </Snackbar>
    </>
  );
};

const PaymentDialog: React.FC<PaymentDialogProps> = ({ open, onClose, userId, onSuccess }) => {
  const [error, setError] = useState<string>('');

  // Reset state when dialog closes
  useEffect(() => {
    if (!open) {
      setError('');
    }
  }, [open]);

  // Use a custom close handler to ensure we reset the state
  const handleClose = () => {
    onClose();
  };

  // Generate a unique key for the Elements component to force re-render when the dialog opens/closes
  const elementsKey = `elements-${open ? 'open' : 'closed'}-${Date.now()}`;

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ color: 'black' }}>Top Up Balance</DialogTitle>
      <DialogContent>
        {error ? (
          <Typography color="error" sx={{ py: 2, textAlign: 'center' }}>
            {error}
          </Typography>
        ) : (
          <Elements key={elementsKey} stripe={stripePromise} options={{ 
            mode: 'payment',
            currency: 'usd',
            amount: 500, // Default initial amount (5.00 USD)
            appearance: { theme: 'stripe' },
            loader: 'auto'
          }}>
            <PaymentForm onSuccess={onSuccess} onClose={handleClose} userId={userId} />
          </Elements>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default PaymentDialog; 