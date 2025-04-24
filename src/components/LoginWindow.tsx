import React, { useState } from 'react';
import {
  Box,
  Container,
  TextField,
  Button,
  Stack,
  Typography,
  Alert,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import logo from '../assets/logo.png';

const LoginWindow: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
        if (!username || !password) {
            throw new Error('Please enter both username and password.');
        }

        console.log('LoginWindow - Submitting form with username:', username);
        await login(username, password);
        console.log('LoginWindow - Login successful, navigating to home');
        navigate('/home');
    } catch (error: any) {
        console.error('LoginWindow - Login error:', error);
        setError(error.message || 'Login failed. Please check your credentials and try again.');
        
        // Log additional error details if available
        if (error.response) {
            console.error('Error response:', error.response);
        }
    } finally {
        setIsLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        bgcolor: 'background.default',
      }}
    >
      <Container maxWidth="sm">
        <Stack spacing={4} alignItems="center">
          <Box
            component="img"
            src={logo}
            alt="BottomSport"
            sx={{ height: 80, width: 'auto' }}
          />

          {error && (
            <Alert severity="error" sx={{ width: '100%' }}>
              {error}
            </Alert>
          )}

          <Box
            component="form"
            onSubmit={handleSubmit}
            sx={{
              width: '100%',
              p: 4,
              bgcolor: 'white',
              borderRadius: 2,
              boxShadow: 1,
            }}
          >
            <Stack spacing={3}>
              <Typography variant="h5" textAlign="center">
                Login
              </Typography>

              <TextField
                fullWidth
                label="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                autoComplete="username"
              />

              <TextField
                fullWidth
                type="password"
                label="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
              />

              <Button
                type="submit"
                fullWidth
                variant="contained"
                disabled={isLoading}
                sx={{
                  bgcolor: 'primary.dark',
                  '&:hover': { bgcolor: 'primary.main' },
                  py: 1.5,
                }}
              >
                {isLoading ? 'Logging in...' : 'Login'}
              </Button>

              <Button
                fullWidth
                variant="outlined"
                onClick={() => navigate('/register')}
                sx={{
                  borderColor: 'grey.300',
                  color: 'grey.700',
                }}
              >
                Don't have an account?
              </Button>
            </Stack>
          </Box>
        </Stack>
      </Container>
    </Box>
  );
};

export default LoginWindow;
