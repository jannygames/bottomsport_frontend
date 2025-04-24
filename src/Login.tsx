import React from 'react';
import {
  Box,
  Container,
  TextField,
  Checkbox,
  FormControlLabel,
  Button,
  Stack,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import viteLogo from '/public/vite.svg';

const Login: React.FC = () => {
  const navigate = useNavigate();

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
      <Container maxWidth="md">
        <Stack spacing={4} alignItems="center" sx={{ width: '100%' }}>
          <Box
            component="img"
            src={viteLogo}
            alt="Logo"
            sx={{ height: 80, width: 'auto' }}
          />
          
          <Box 
            component="form" 
            sx={{ 
              width: '100%',
              maxWidth: '1200px'
            }} 
            noValidate
          >
            <Stack spacing={3}>
              <TextField
                fullWidth
                id="email"
                label="Email"
                name="email"
                type="email"
                autoComplete="email"
                required
                variant="outlined"
                placeholder="Value"
                sx={{ '& .MuiOutlinedInput-root': { fontSize: '1.1rem' } }}
              />

              <TextField
                fullWidth
                id="password"
                label="Password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                variant="outlined"
                placeholder="Value"
                sx={{ '& .MuiOutlinedInput-root': { fontSize: '1.1rem' } }}
              />

              <FormControlLabel
                control={<Checkbox id="remember-me" name="remember-me" />}
                label="Remember me"
                sx={{ '& .MuiFormControlLabel-label': { fontSize: '1.1rem' } }}
              />

              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{
                  bgcolor: 'grey.800',
                  '&:hover': {
                    bgcolor: 'grey.700',
                  },
                  fontSize: '1.1rem',
                  py: 1.5
                }}
              >
                Login
              </Button>

              <Button
                fullWidth
                variant="outlined"
                color="inherit"
                onClick={() => navigate('/register')}
                sx={{
                  borderColor: 'grey.300',
                  color: 'grey.700',
                  fontSize: '1.1rem',
                  py: 1.5
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

export default Login;
