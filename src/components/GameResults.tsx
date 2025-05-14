import React from 'react';
import { Paper, Typography, Button, Box, Divider, Chip } from '@mui/material';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import LocalAtmIcon from '@mui/icons-material/LocalAtm';
import DirectionsRunIcon from '@mui/icons-material/DirectionsRun';
import StarIcon from '@mui/icons-material/Star';

interface GameResultsProps {
  isCollision: boolean;
  winnings: number;
  betAmount: number;
  multiplier: number;
  lanesCompleted: number;
  onPlayAgain: () => void;
}

const GameResults: React.FC<GameResultsProps> = ({ 
  isCollision, 
  winnings, 
  betAmount, 
  multiplier,
  lanesCompleted,
  onPlayAgain 
}) => {
  // Determine if player achieved a personal best multiplier
  const isPersonalBest = multiplier > 5.0; // This could be dynamic based on stored user data
  
  return (
    <Paper 
      elevation={3} 
      sx={{ 
        p: 3, 
        mt: 3, 
        textAlign: 'center',
        border: isCollision ? '2px solid #DC3545' : '2px solid #28A745',
        borderRadius: 2,
        maxWidth: '600px',
        mx: 'auto',
        background: isCollision 
          ? 'linear-gradient(to bottom, #fff, #ffebee)'
          : 'linear-gradient(to bottom, #fff, #e8f5e9)'
      }}
    >
      {isCollision ? (
        <Box>
          <Typography variant="h4" gutterBottom color="error">
            Game Over!
          </Typography>
          
          <Box sx={{ position: 'relative', my: 2 }}>
            <img 
              src="/assets/chicken-collision.png" 
              alt="Collision" 
              style={{ 
                maxWidth: '120px', 
                margin: '0 auto', 
                display: 'block',
                opacity: 0.8 
              }}
              onError={(e) => {
                // Fallback if image not found
                e.currentTarget.style.display = 'none';
              }}
            />
          </Box>
          
          <Typography variant="h6" color="error" gutterBottom>
            Your chicken got hit! You lost ${betAmount.toFixed(2)}
          </Typography>
          
          <Divider sx={{ my: 2 }} />
          
          <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2, flexWrap: 'wrap', gap: 2 }}>
            <Chip 
              icon={<DirectionsRunIcon />} 
              label={`${lanesCompleted} Lanes Completed`} 
              color="primary" 
              variant="outlined"
            />
            <Chip 
              icon={<LocalAtmIcon />} 
              label={`Final Multiplier: x${multiplier.toFixed(2)}`} 
              color="secondary" 
              variant="outlined" 
            />
          </Box>
          
          <Typography variant="body2" sx={{ my: 2, color: 'text.secondary' }}>
            Better luck next time! Try a different difficulty or play it safe by cashing out earlier.
          </Typography>
        </Box>
      ) : (
        <Box>
          <Typography variant="h4" gutterBottom color="success">
            Congratulations!
          </Typography>
          
          <Box sx={{ position: 'relative', my: 2 }}>
            {isPersonalBest && (
              <Box sx={{ 
                position: 'absolute', 
                top: -15, 
                right: '30%',
                transform: 'rotate(15deg)',
                animation: 'pulse 2s infinite'
              }}>
                <StarIcon sx={{ color: '#FFD700', fontSize: 40 }} />
              </Box>
            )}
            
            <img 
              src="/assets/chicken-winner.png" 
              alt="Winner" 
              style={{ 
                maxWidth: '120px', 
                margin: '0 auto', 
                display: 'block' 
              }}
              onError={(e) => {
                // Fallback if image not found
                e.currentTarget.style.display = 'none';
              }}
            />
          </Box>
          
          <Typography variant="h5" color="success" gutterBottom>
            Cash out successful!
          </Typography>
          
          <Typography variant="h4" sx={{ my: 2 }}>
            <LocalAtmIcon sx={{ verticalAlign: 'middle', mr: 1 }} />
            ${winnings.toFixed(2)}
          </Typography>
          
          <Divider sx={{ my: 2 }} />
          
          <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2, flexWrap: 'wrap', gap: 2 }}>
            <Chip 
              icon={<DirectionsRunIcon />} 
              label={`${lanesCompleted} Lanes Completed`} 
              color="primary" 
            />
            <Chip 
              icon={<EmojiEventsIcon />} 
              label={`x${multiplier.toFixed(2)} Multiplier`} 
              color="secondary" 
              variant={isPersonalBest ? "filled" : "outlined"}
            />
          </Box>
          
          {isPersonalBest && (
            <Typography variant="body1" sx={{ mb: 2, fontWeight: 'bold', color: '#F57C00' }}>
              New personal best multiplier!
            </Typography>
          )}
          
          <Typography variant="body2" sx={{ mb: 2, color: 'text.secondary' }}>
            Great timing on cashing out! You bet ${betAmount.toFixed(2)} and won ${winnings.toFixed(2)}.
          </Typography>
        </Box>
      )}
      
      <Box sx={{ mt: 3 }}>
        <Button 
          variant="contained" 
          color="primary"
          size="large"
          onClick={onPlayAgain}
          sx={{ 
            minWidth: 200,
            fontSize: '1.1rem',
            transition: 'all 0.2s',
            '&:hover': {
              transform: 'translateY(-2px)',
              boxShadow: 3
            }
          }}
        >
          Play Again
        </Button>
      </Box>
    </Paper>
  );
};

export default GameResults; 