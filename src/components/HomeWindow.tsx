import React from 'react';
import {
  Box,
  Container,
  Typography,
  Button,
  AppBar,
  Toolbar,
  Card,
  CardContent,
  CardMedia,
  IconButton,
  Menu,
  MenuItem,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import blackjackImage from '../assets/blackjack.png';
import missionImage from '../assets/mission.png';
import logo from '../assets/logo.png';
import { useAuth } from '../contexts/AuthContext';

const HomeWindow: React.FC = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static" sx={{ bgcolor: 'white', boxShadow: 1 }}>
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1, color: 'black' }}>
            <Box component="img" src={logo} alt="BottomSport" sx={{ height: 40 }} />
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
            <Button color="inherit" sx={{ color: 'black' }}>Home</Button>
            <Button color="inherit" sx={{ color: 'black' }}>Blackjack</Button>
            <Button color="inherit" sx={{ color: 'black' }}>Mission Crossable</Button>
            <Button color="inherit" sx={{ color: 'black' }}>Settings</Button>
            <IconButton onClick={handleMenuOpen} sx={{ color: 'black' }}>
              <AccountCircleIcon />
            </IconButton>
            <Typography variant="body1" sx={{ color: 'black' }}>
              Welcome, {user?.username}!
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

      <Container maxWidth="lg" sx={{ mt: 8 }}>
        <Box sx={{ display: 'flex', gap: 4, justifyContent: 'center' }}>
          <Card sx={{ maxWidth: 400 }}>
            <CardContent>
              <Typography variant="h5" gutterBottom>
                Blackjack
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Classic card game against the dealer.
              </Typography>
            </CardContent>
            <CardMedia
              component="img"
              height="200"
              image={blackjackImage}
              alt="Blackjack"
            />
            <CardContent>
              <Typography variant="body2" color="text.secondary" paragraph>
                A classic card game where players compete against the dealer to reach 21 without going over.
              </Typography>
              <Button
                variant="contained"
                fullWidth
                sx={{
                  bgcolor: 'primary.dark',
                  '&:hover': { bgcolor: 'primary.main' }
                }}
              >
                Play
              </Button>
            </CardContent>
          </Card>

          <Card sx={{ maxWidth: 400 }}>
            <CardContent>
              <Typography variant="h5" gutterBottom>
                Mission Crossable
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Strategic survival gambling challenge.
              </Typography>
            </CardContent>
            <CardMedia
              component="img"
              height="200"
              image={missionImage}
              alt="Mission Crossable"
            />
            <CardContent>
              <Typography variant="body2" color="text.secondary" paragraph>
                A strategic gambling game where players navigate challenges, risking bets to survive and win rewards.
              </Typography>
              <Button
                variant="contained"
                fullWidth
                sx={{
                  bgcolor: 'primary.dark',
                  '&:hover': { bgcolor: 'primary.main' }
                }}
              >
                Play
              </Button>
            </CardContent>
          </Card>
        </Box>
      </Container>
    </Box>
  );
};

export default HomeWindow; 