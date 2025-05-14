import React from 'react';
import { Box, Typography, Container } from '@mui/material';

const Settings: React.FC = () => {
  return (
    <Container maxWidth="lg">
      <Box sx={{ py: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Settings
        </Typography>
        <Typography variant="body1">
          User settings and preferences coming soon...
        </Typography>
      </Box>
    </Container>
  );
};

export default Settings; 