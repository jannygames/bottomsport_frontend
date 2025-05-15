import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  CircularProgress,
  Alert,
  Typography,
  Box,
  Divider
} from '@mui/material';
import { cashoutFunds, getUserBalance } from '../api/client';

interface CashoutDialogProps {
  open: boolean;
  onClose: () => void;
  userId: number;
  onSuccess: () => void;
}

const CashoutDialog: React.FC<CashoutDialogProps> = ({ open, onClose, userId, onSuccess }) => {
  const [amount, setAmount] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);
  const [currentBalance, setCurrentBalance] = useState<number>(0);
  const [fetchingBalance, setFetchingBalance] = useState<boolean>(false);

  // Fetch the user's current balance when the dialog opens
  useEffect(() => {
    if (open && userId) {
      fetchUserBalance();
    }
  }, [open, userId]);

  const fetchUserBalance = async () => {
    setFetchingBalance(true);
    try {
      const balance = await getUserBalance(userId);
      setCurrentBalance(balance);
    } catch (err) {
      console.error('Error fetching balance:', err);
    } finally {
      setFetchingBalance(false);
    }
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Only allow valid decimal inputs
    const value = e.target.value;
    if (value === '' || /^\d+(\.\d{0,2})?$/.test(value)) {
      setAmount(value);
      setError(null);
    }
  };

  const validateCashout = (): boolean => {
    // Reset error
    setError(null);
    
    // Check if amount is provided
    if (!amount || amount.trim() === '') {
      setError('Please enter an amount');
      return false;
    }
    
    const amountValue = parseFloat(amount);
    
    // Check if amount is a valid number greater than zero
    if (isNaN(amountValue) || amountValue <= 0) {
      setError('Amount must be greater than zero');
      return false;
    }
    
    // Check if amount is not more than current balance
    if (amountValue > currentBalance) {
      setError(`Amount exceeds your current balance of $${currentBalance.toFixed(2)}`);
      return false;
    }
    
    // Add any other validation rules here
    
    return true;
  };

  const handleCashout = async () => {
    // Validate input
    if (!validateCashout()) {
      return;
    }

    setLoading(true);
    
    try {
      await cashoutFunds({
        userId,
        amount: parseFloat(amount)
      });

      setSuccess(true);
      setAmount('');
      onSuccess(); // Update balance in parent component
      
      // Close dialog after short delay to show success message
      setTimeout(() => {
        onClose();
        setSuccess(false);
      }, 2000);
      
    } catch (err: any) {
      console.error('Cashout error:', err);
      setError(err.message || 'Failed to process cashout');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (!loading) {
      setAmount('');
      setError(null);
      setSuccess(false);
      onClose();
    }
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        Cashout Funds
        <Typography variant="subtitle2" color="text.secondary">
          Withdraw money from your account
        </Typography>
      </DialogTitle>
      <Divider />
      <DialogContent>
        {success ? (
          <Alert severity="success" sx={{ mt: 2 }}>
            Cashout successful! Your balance has been updated.
          </Alert>
        ) : (
          <Box sx={{ mt: 2 }}>
            <Box sx={{ mb: 3, p: 2, bgcolor: 'background.paper', borderRadius: 1, border: '1px solid #e0e0e0' }}>
              <Typography variant="subtitle2" gutterBottom>
                Current Balance
              </Typography>
              <Typography variant="h5" color="primary">
                {fetchingBalance ? <CircularProgress size={20} /> : `$${currentBalance.toFixed(2)}`}
              </Typography>
            </Box>
            
            <Typography variant="body1" gutterBottom>
              Enter the amount you want to cashout:
            </Typography>
            <TextField
              autoFocus
              margin="dense"
              label="Cashout Amount"
              type="text"
              fullWidth
              variant="outlined"
              value={amount}
              onChange={handleAmountChange}
              disabled={loading || fetchingBalance}
              error={!!error}
              helperText={error}
              InputProps={{
                startAdornment: <Typography variant="body1" sx={{ mr: 1 }}>$</Typography>
              }}
            />
            <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
              The amount will be deducted from your account balance.
            </Typography>
            {parseFloat(amount) > 0 && (
              <Box sx={{ mt: 2, p: 2, bgcolor: '#f5f5f5', borderRadius: 1 }}>
                <Typography variant="body2">
                  New balance after cashout: <strong>${(currentBalance - (parseFloat(amount) || 0)).toFixed(2)}</strong>
                </Typography>
              </Box>
            )}
          </Box>
        )}
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 3 }}>
        <Button 
          onClick={handleClose} 
          disabled={loading}
          variant="outlined"
        >
          Cancel
        </Button>
        <Button
          onClick={handleCashout}
          variant="contained"
          color="primary"
          disabled={loading || success || !amount || parseFloat(amount) <= 0 || parseFloat(amount) > currentBalance || fetchingBalance}
        >
          {loading ? <CircularProgress size={24} /> : 'Cashout'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CashoutDialog; 