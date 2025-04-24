import React, { useState } from 'react';
import {
  Box,
  Container,
  TextField,
  Checkbox,
  FormControlLabel,
  Button,
  Stack,
  Grid,
  FormHelperText,
  Alert,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import viteLogo from '/public/vite.svg';
import { registerUser } from '../api/client';

interface FormData {
  name: string;
  surname: string;
  email: string;
  password: string;
  repeatPassword: string;
  terms: boolean;
}

interface FormErrors {
  name?: string;
  surname?: string;
  email?: string;
  password?: string;
  repeatPassword?: string;
  terms?: string;
  submit?: string;
}

const Register: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<FormData>({
    name: '',
    surname: '',
    email: '',
    password: '',
    repeatPassword: '',
    terms: false,
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    // Clear error when user starts typing
    if (errors[name as keyof FormErrors]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const validateForm = () => {
    const newErrors: FormErrors = {};

    // Check empty fields
    if (!formData.name) newErrors.name = 'Name is required';
    if (!formData.surname) newErrors.surname = 'Surname is required';
    if (!formData.email) newErrors.email = 'Email is required';
    if (!formData.password) newErrors.password = 'Password is required';
    if (!formData.repeatPassword) newErrors.repeatPassword = 'Please confirm your password';
    if (!formData.terms) newErrors.terms = 'You must agree to the terms of service';

    // Email validation
    if (formData.email && !validateEmail(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    // Password match validation
    if (formData.password && formData.repeatPassword && formData.password !== formData.repeatPassword) {
      newErrors.repeatPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      setIsSubmitting(true);
      try {
        // Create username from email (before @ symbol)
        const username = formData.email.split('@')[0];
        
        await registerUser({
          username,
          password: formData.password
        });

        // Registration successful
        navigate('/login', { 
          state: { 
            message: 'Registration successful! Please log in.' 
          }
        });
      } catch (error: any) {
        setErrors(prev => ({
          ...prev,
          submit: error.toString()
        }));
      } finally {
        setIsSubmitting(false);
      }
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
      <Container maxWidth="md">
        <Stack spacing={4} alignItems="center" sx={{ width: '100%' }}>
          <Box
            component="img"
            src={viteLogo}
            alt="Logo"
            sx={{ height: 80, width: 'auto' }}
          />
          
          {errors.submit && (
            <Alert severity="error" sx={{ width: '100%' }}>
              {errors.submit}
            </Alert>
          )}

          <Box 
            component="form" 
            onSubmit={handleSubmit}
            sx={{ 
              width: '100%',
              maxWidth: '600px'
            }} 
            noValidate
          >
            <Stack spacing={3}>
              <Box sx={{ display: 'flex', gap: 2 }}>
                <Box sx={{ flex: 1 }}>
                  <TextField
                    fullWidth
                    id="name"
                    label="Name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    autoComplete="given-name"
                    required
                    variant="outlined"
                    placeholder="Value"
                    error={!!errors.name}
                    helperText={errors.name}
                    sx={{ '& .MuiOutlinedInput-root': { fontSize: '1.1rem' } }}
                  />
                </Box>
                <Box sx={{ flex: 1 }}>
                  <TextField
                    fullWidth
                    id="surname"
                    label="Surname"
                    name="surname"
                    value={formData.surname}
                    onChange={handleChange}
                    autoComplete="family-name"
                    required
                    variant="outlined"
                    placeholder="Value"
                    error={!!errors.surname}
                    helperText={errors.surname}
                    sx={{ '& .MuiOutlinedInput-root': { fontSize: '1.1rem' } }}
                  />
                </Box>
              </Box>

              <TextField
                fullWidth
                id="email"
                label="Email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                autoComplete="email"
                required
                variant="outlined"
                placeholder="Value"
                error={!!errors.email}
                helperText={errors.email}
                sx={{ '& .MuiOutlinedInput-root': { fontSize: '1.1rem' } }}
              />

              <TextField
                fullWidth
                id="password"
                label="Password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                autoComplete="new-password"
                required
                variant="outlined"
                placeholder="Value"
                error={!!errors.password}
                helperText={errors.password}
                sx={{ '& .MuiOutlinedInput-root': { fontSize: '1.1rem' } }}
              />

              <TextField
                fullWidth
                id="repeatPassword"
                label="Repeat Password"
                name="repeatPassword"
                type="password"
                value={formData.repeatPassword}
                onChange={handleChange}
                autoComplete="new-password"
                required
                variant="outlined"
                placeholder="Value"
                error={!!errors.repeatPassword}
                helperText={errors.repeatPassword}
                sx={{ '& .MuiOutlinedInput-root': { fontSize: '1.1rem' } }}
              />

              <Box>
                <FormControlLabel
                  control={
                    <Checkbox 
                      id="terms" 
                      name="terms" 
                      checked={formData.terms}
                      onChange={handleChange}
                      required 
                    />
                  }
                  label="I agree with terms of service"
                  sx={{ '& .MuiFormControlLabel-label': { fontSize: '1.1rem' } }}
                />
                {errors.terms && (
                  <FormHelperText error>{errors.terms}</FormHelperText>
                )}
              </Box>

              <Button
                type="submit"
                fullWidth
                variant="contained"
                disabled={isSubmitting}
                sx={{
                  bgcolor: 'grey.800',
                  '&:hover': {
                    bgcolor: 'grey.700',
                  },
                  fontSize: '1.1rem',
                  py: 1.5
                }}
              >
                {isSubmitting ? 'Registering...' : 'Register'}
              </Button>

              <Button
                fullWidth
                variant="outlined"
                color="inherit"
                onClick={() => navigate('/login')}
                sx={{
                  borderColor: 'grey.300',
                  color: 'grey.700',
                  fontSize: '1.1rem',
                  py: 1.5
                }}
              >
                Already have an account?
              </Button>
            </Stack>
          </Box>
        </Stack>
      </Container>
    </Box>
  );
};

export default Register;
