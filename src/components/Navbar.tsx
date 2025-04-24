import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  Button,
  IconButton,
  Menu,
  MenuItem,
} from '@mui/material';
import logo from '../assets/logo.png';

const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    logout();
    handleMenuClose();
    navigate('/login');
  };

  if (!user) return null;

  return (
    <AppBar position="static" sx={{ bgcolor: 'white', boxShadow: 1 }}>
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1, color: 'black' }}>
          <Box component="img" src={logo} alt="BottomSport" sx={{ height: 40 }} />
        </Typography>
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
          <Button 
            color="inherit" 
            sx={{ color: 'black' }}
            onClick={() => navigate('/')}
          >
            Home
          </Button>
          <Button 
            color="inherit" 
            sx={{ color: 'black' }}
            onClick={() => navigate('/blackjack')}
          >
            Blackjack
          </Button>
          <Button 
            color="inherit" 
            sx={{ color: 'black' }}
            onClick={() => navigate('/mission-crossable')}
          >
            Mission Crossable
          </Button>
          <Button 
            color="inherit" 
            sx={{ color: 'black' }}
            onClick={() => navigate('/settings')}
          >
            Settings
          </Button>
          <IconButton 
            onClick={handleMenuOpen} 
            sx={{ color: 'black' }}
          >
            <AccountCircleIcon />
          </IconButton>
          <Typography variant="body1" sx={{ color: 'black' }}>
            Welcome, {user.username}!
          </Typography>
        </Box>
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
        >
          <MenuItem onClick={handleLogout}>Logout</MenuItem>
        </Menu>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar; 