import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  CircularProgress,
  Box,
  Alert
} from '@mui/material';
import apiClient from '../api/client';

interface LeaderboardEntry {
  username: string;
  betAmount: number;
  winAmount: number;
  maxMultiplier: number;
}

const MissionCrossableLeaderboard: React.FC = () => {
  const [leaderboardData, setLeaderboardData] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchLeaderboardData();
  }, []);

  const fetchLeaderboardData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await apiClient.get('/api/Game/leaderboard');
      setLeaderboardData(response.data);
    } catch (err: any) {
      console.error('Error fetching leaderboard data:', err);
      setError('Failed to load leaderboard data');
      // If API fails, you can set some sample data for development
      setLeaderboardData([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ py: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom sx={{ textAlign: 'center', mb: 4 }}>
          Mission Crossable Leaderboard
        </Typography>
        
        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}
        
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
            <CircularProgress />
          </Box>
        ) : (
          <TableContainer component={Paper} sx={{ boxShadow: 3 }}>
            <Table>
              <TableHead sx={{ bgcolor: 'primary.main' }}>
                <TableRow>
                  <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Rank</TableCell>
                  <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Username</TableCell>
                  <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Bet Amount</TableCell>
                  <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Win Amount</TableCell>
                  <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Max Multiplier</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {leaderboardData.length > 0 ? (
                  leaderboardData.map((entry, index) => (
                    <TableRow 
                      key={index}
                      sx={index < 3 ? { bgcolor: index === 0 ? '#FFD700' : index === 1 ? '#C0C0C0' : '#CD7F32', opacity: 0.7 } : {}}
                    >
                      <TableCell>{index + 1}</TableCell>
                      <TableCell>{entry.username}</TableCell>
                      <TableCell>${entry.betAmount.toFixed(2)}</TableCell>
                      <TableCell>${entry.winAmount.toFixed(2)}</TableCell>
                      <TableCell>x{entry.maxMultiplier.toFixed(2)}</TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} align="center">
                      No leaderboard data available
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Box>
    </Container>
  );
};

export default MissionCrossableLeaderboard; 