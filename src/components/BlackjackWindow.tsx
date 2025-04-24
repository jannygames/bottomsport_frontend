import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Button,
  Card,
  CardContent,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
  Paper,
  Divider,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import apiClient from '../api/client';

interface Room {
  id: number;
  title: string;
  roomCreator: number;
  minBet: number;
  maxBet: number;
  roomStatus: string;
  creationDate: string;
}

interface CreateRoomRequest {
  title: string;
  minBet: number;
  maxBet: number;
}

const BlackjackWindow: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [rooms, setRooms] = useState<Room[]>([]);
  const [openCreateDialog, setOpenCreateDialog] = useState(false);
  const [newRoom, setNewRoom] = useState<CreateRoomRequest>({
    title: '',
    minBet: 0,
    maxBet: 0,
  });

  useEffect(() => {
    fetchRooms();
  }, []);

  const fetchRooms = async () => {
    try {
      console.log('Fetching rooms...');
      const response = await apiClient.get('/api/Room');
      console.log('Response status:', response.status);
      console.log('Fetched rooms:', response.data);
      setRooms(response.data);
    } catch (error) {
      console.error('Error fetching rooms:', error);
    }
  };

  const handleCreateRoom = async () => {
    try {
      console.log('Creating room with data:', newRoom);
      const response = await apiClient.post('/api/Room', newRoom);
      console.log('Create room response:', response.data);

      setOpenCreateDialog(false);
      setNewRoom({ title: '', minBet: 0, maxBet: 0 });
      await fetchRooms();
    } catch (error: any) {
      console.error('Error creating room:', error);
      if (error.response) {
        console.error('Error response:', error.response.data);
      }
    }
  };

  const handleJoinRoom = (roomId: number) => {
    navigate(`/blackjack/room/${roomId}`);
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4" component="h1">
          Blackjack Rooms
        </Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={() => setOpenCreateDialog(true)}
        >
          Create Room
        </Button>
      </Box>

      <Grid container spacing={3}>
        {rooms.length === 0 ? (
          <Grid xs={12}>
            <Paper sx={{ p: 3, textAlign: 'center' }}>
              <Typography variant="h6" color="text.secondary">
                No rooms available. Create a new room to start playing!
              </Typography>
            </Paper>
          </Grid>
        ) : (
          rooms.map((room) => (
            <Grid xs={12} sm={6} md={4} key={room.id}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    {room.title}
                  </Typography>
                  <Divider sx={{ my: 1 }} />
                  <Typography variant="body2" color="text.secondary">
                    Min Bet: ${room.minBet}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Max Bet: ${room.maxBet}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Status: {room.roomStatus}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Created: {new Date(room.creationDate).toLocaleDateString()}
                  </Typography>
                  <Button
                    variant="contained"
                    fullWidth
                    sx={{ mt: 2 }}
                    onClick={() => handleJoinRoom(room.id)}
                  >
                    Join Room
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          ))
        )}
      </Grid>

      <Dialog open={openCreateDialog} onClose={() => setOpenCreateDialog(false)}>
        <DialogTitle>Create New Room</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Room Title"
            fullWidth
            value={newRoom.title}
            onChange={(e) => setNewRoom({ ...newRoom, title: e.target.value })}
          />
          <TextField
            margin="dense"
            label="Minimum Bet"
            type="number"
            fullWidth
            value={newRoom.minBet}
            onChange={(e) => setNewRoom({ ...newRoom, minBet: Number(e.target.value) })}
          />
          <TextField
            margin="dense"
            label="Maximum Bet"
            type="number"
            fullWidth
            value={newRoom.maxBet}
            onChange={(e) => setNewRoom({ ...newRoom, maxBet: Number(e.target.value) })}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenCreateDialog(false)}>Cancel</Button>
          <Button onClick={handleCreateRoom} variant="contained">
            Create
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default BlackjackWindow; 