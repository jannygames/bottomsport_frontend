import React, { useState, useEffect, useRef } from 'react';
import { Dialog, DialogTitle, DialogContent, Button, TextField, Typography, Box, CircularProgress } from '@mui/material';
import { loadStripe } from '@stripe/stripe-js';
import { 
  Elements, 
  PaymentElement, 
  useStripe, 
  useElements,
  AddressElement
} from '@stripe/react-stripe-js';
import apiClient from '../api/client';

// Initialize Stripe
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || '');

// API base URL
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5251';

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

  // Update the ref whenever amount changes
  useEffect(() => {
    amountRef.current = amount;
  }, [amount]);

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
          return_url: `${window.location.origin}/payment-success`,
        },
        redirect: 'if_required'
      });

      if (confirmError) {
        setError(confirmError.message || 'An error occurred');
        console.error('Payment error:', confirmError);
      } else if (paymentIntent && paymentIntent.status === 'succeeded') {
        console.log('Payment succeeded:', paymentIntent);
        
        // Step 4: Notify the backend about the successful payment
        const confirmResponse = await apiClient.post('/api/Payment/confirm', { 
          paymentIntentId: paymentIntent.id 
        });
        
        console.log('Payment confirmation response:', confirmResponse.data);
        
        if (confirmResponse.data.success === true || confirmResponse.data.message) {
          // Either response format is acceptable
          console.log('Balance updated:', confirmResponse.data.balance || 'Unknown');
          onSuccess();
          onClose();
        } else {
          setError('Failed to update balance. Please contact support.');
        }
      } else {
        setError('Payment not completed. Please try again.');
      }
    } catch (err) {
      console.error('Payment error:', err);
      setError('An error occurred while processing your payment');
    } finally {
      setProcessing(false);
    }
  };

  return (
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