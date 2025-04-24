import React from 'react';
import {
  Box,
  Container,
  Typography,
  Button,
  Card,
  CardContent,
  CardMedia,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import blackjackImage from '../assets/blackjack.png';
import missionImage from '../assets/mission.png';

const HomeWindow: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Box sx={{ 
      minHeight: 'calc(100vh - 64px)', // Subtract navbar height
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      py: 4
    }}>
      <Container maxWidth="lg">
        <Box sx={{ 
          display: 'flex', 
          gap: 4, 
          justifyContent: 'center',
          flexWrap: 'wrap',
          width: '100%'
        }}>
          <Card sx={{ 
            maxWidth: 400, 
            minWidth: 300,
            display: 'flex',
            flexDirection: 'column'
          }}>
            <CardContent>
              <Typography variant="h5" gutterBottom>
                Blackjack
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Classic card game against the dealer.
              </Typography>
            </CardContent>
            <Box sx={{ 
              width: '100%', 
              height: 200, 
              overflow: 'hidden',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <img 
                src={blackjackImage} 
                alt="Blackjack" 
                style={{ 
                  width: '100%', 
                  height: '100%', 
                  objectFit: 'cover' 
                }}
                onError={(e) => {
                  console.error('Error loading blackjack image');
                  const target = e.target as HTMLImageElement;
                  target.style.display = 'none';
                }}
              />
            </Box>
            <CardContent>
              <Typography variant="body2" color="text.secondary" paragraph>
                A classic card game where players compete against the dealer to reach 21 without going over.
              </Typography>
              <Button
                variant="contained"
                fullWidth
                onClick={() => navigate('/blackjack')}
                sx={{
                  bgcolor: 'primary.dark',
                  '&:hover': { bgcolor: 'primary.main' }
                }}
              >
                Play
              </Button>
            </CardContent>
          </Card>

          <Card sx={{ 
            maxWidth: 400, 
            minWidth: 300,
            display: 'flex',
            flexDirection: 'column'
          }}>
            <CardContent>
              <Typography variant="h5" gutterBottom>
                Mission Crossable
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Strategic survival gambling challenge.
              </Typography>
            </CardContent>
            <Box sx={{ 
              width: '100%', 
              height: 200, 
              overflow: 'hidden',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <img 
                src={missionImage} 
                alt="Mission Crossable" 
                style={{ 
                  width: '100%', 
                  height: '100%', 
                  objectFit: 'cover' 
                }}
                onError={(e) => {
                  console.error('Error loading mission image');
                  const target = e.target as HTMLImageElement;
                  target.style.display = 'none';
                }}
              />
            </Box>
            <CardContent>
              <Typography variant="body2" color="text.secondary" paragraph>
                A strategic gambling game where players navigate challenges, risking bets to survive and win rewards.
              </Typography>
              <Button
                variant="contained"
                fullWidth
                onClick={() => navigate('/mission-crossable')}
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