import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Paper,
  Box,
  Grid,
  CircularProgress,
  Alert,
  Card,
  CardContent,
  Divider
} from '@mui/material';
import { 
  PieChart, 
  Pie, 
  Cell, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from 'recharts';
import apiClient from '../api/client';
import { useAuth } from '../contexts/AuthContext';

interface GameStats {
  totalGames: number;
  wins: number;
  losses: number;
  winRate: number;
  totalBet: number;
  biggestBet: number;
  biggestWin: number;
  smallestWin: number;
  averageMultiplier: number;
  gameHistory: {
    gameNum: number;
    date: string;
    betAmount: number;
    winAmount: number;
    multiplier: number;
    result: string;
  }[];
}

const MissionCrossableStats: React.FC = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState<GameStats | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user?.id) {
      fetchUserStats();
    }
  }, [user]);

  const fetchUserStats = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await apiClient.get(`/api/Game/stats/${user?.id}`);
      setStats(response.data);
    } catch (err: any) {
      console.error('Error fetching user stats:', err);
      setError('Failed to load user statistics');
      // Provide empty stats object for development
      setStats(null);
    } finally {
      setLoading(false);
    }
  };

  // Data for the pie chart
  const getPieData = () => {
    if (!stats) return [];
    return [
      { name: 'Wins', value: stats.wins },
      { name: 'Losses', value: stats.losses }
    ];
  };

  // Data for the bar chart
  const getBarData = () => {
    if (!stats || !stats.gameHistory) return [];
    
    // Return only the 10 most recent games
    return stats.gameHistory
      .slice(0, 10)
      .map(game => ({
        gameNum: game.gameNum,
        betAmount: game.betAmount,
        winAmount: game.winAmount,
        result: game.result
      }));
  };

  // Colors for the pie chart
  const COLORS = ['#4CAF50', '#F44336'];

  return (
    <Container maxWidth="lg">
      <Box sx={{ py: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom sx={{ textAlign: 'center', mb: 4 }}>
        {user?.username ? user.username.charAt(0).toUpperCase() + user.username.slice(1).toLowerCase() + '\'s' : ''} Mission Crossable Statistics
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
        ) : !stats ? (
          <Alert severity="info" sx={{ mb: 3 }}>
            You haven't played any Mission Crossable games yet.
          </Alert>
        ) : (
          <>
            {/* Summary Stats */}
            <Grid container spacing={3} sx={{ mb: 4 }}>
              <Grid item xs={12} md={4}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>Performance</Typography>
                    <Divider sx={{ mb: 2 }} />
                    <Typography variant="body1">Total Games: {stats.totalGames}</Typography>
                    <Typography variant="body1">Wins: {stats.wins}</Typography>
                    <Typography variant="body1">Losses: {stats.losses}</Typography>
                    <Typography variant="body1" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
                      Win Rate: {(stats.winRate * 100).toFixed(2)}%
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              
              <Grid item xs={12} md={4}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>Financial Summary</Typography>
                    <Divider sx={{ mb: 2 }} />
                    <Typography variant="body1">Total Bet: ${stats.totalBet.toFixed(2)}</Typography>
                    <Typography variant="body1">Biggest Bet: ${stats.biggestBet.toFixed(2)}</Typography>
                    <Typography variant="body1" sx={{ color: 'success.main' }}>
                      Biggest Win: ${stats.biggestWin.toFixed(2)}
                    </Typography>
                    <Typography variant="body1">
                      Smallest Win: ${stats.smallestWin.toFixed(2)}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              
              <Grid item xs={12} md={4}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>Game Details</Typography>
                    <Divider sx={{ mb: 2 }} />
                    <Typography variant="body1">
                      Average Multiplier: x{stats.averageMultiplier.toFixed(2)}
                    </Typography>
                    <Typography variant="body1">
                      Last Game: {stats.gameHistory[0]?.date}
                    </Typography>
                    <Typography variant="body1" sx={{ 
                      color: stats.gameHistory[0]?.result === 'win' ? 
                        'success.main' : 'error.main' 
                    }}>
                      Last Result: {stats.gameHistory[0]?.result.toUpperCase()}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
            
            {/* Win/Loss Chart */}
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Paper sx={{ p: 3, height: '100%' }}>
                  <Typography variant="h6" gutterBottom>Win/Loss Ratio</Typography>
                  <Box sx={{ height: 300 }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={getPieData()}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          {getPieData().map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  </Box>
                </Paper>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <Paper sx={{ p: 3, height: '100%' }}>
                  <Typography variant="h6" gutterBottom>Recent Games Performance</Typography>
                  <Box sx={{ height: 300 }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={getBarData()}
                        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="gameNum" label={{ value: 'Game Number', position: 'insideBottom', offset: -5 }} />
                        <YAxis label={{ value: 'Amount ($)', angle: -90, position: 'insideLeft' }} />
                        <Tooltip />
                        <Legend />
                        <Bar name="Bet Amount" dataKey="betAmount" fill="#8884d8" />
                        <Bar name="Win Amount" dataKey="winAmount" fill="#82ca9d" />
                      </BarChart>
                    </ResponsiveContainer>
                  </Box>
                </Paper>
              </Grid>
            </Grid>
            
            {/* Game History Table - We'll skip this for now as it would make the component too large */}
          </>
        )}
      </Box>
    </Container>
  );
};

export default MissionCrossableStats; 