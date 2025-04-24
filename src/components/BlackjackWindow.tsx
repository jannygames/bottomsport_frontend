import React, { useState, useEffect } from 'react';
import {
  Box, Container, Typography, Button, Card, CardContent,
  TextField, Dialog, DialogTitle, DialogContent, DialogActions,
  Grid, Paper, Divider, Snackbar, Alert, Stack
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import apiClient, { deleteRoom } from '../api/client';

// ─────────────────────────── TYPES ────────────────────────────
// what the server sends back (snake_case)
interface RoomDto {
  id:            number;
  title:         string;
  room_creator:  number;
  min_bet:       number;
  max_bet:       number;
  room_status:   string;
  creation_date: string;
}

// what the UI wants to render (camelCase)
interface Room {
  id:            number;
  title:         string;
  roomCreator:   number;
  minBet:        number;
  maxBet:        number;
  roomStatus:    string;
  creationDate:  string;
}

interface CreateRoomRequest {
  title:  string;
  minBet: number;
  maxBet: number;
}

// helper: dto → ui
const mapRoom = (r: RoomDto): Room => ({
  id:           r.id,
  title:        r.title,
  roomCreator:  r.room_creator,
  minBet:       r.min_bet,
  maxBet:       r.max_bet,
  roomStatus:   r.room_status,
  creationDate: r.creation_date,
});

// ──────────────────────── COMPONENT ───────────────────────────
const BlackjackWindow: React.FC = () => {
  const navigate = useNavigate();
  const { user }  = useAuth();

  const [rooms, setRooms]               = useState<Room[]>([]);
  const [openCreateDialog, setOpen]     = useState(false);
  const [newRoom, setNewRoom]           = useState<CreateRoomRequest>({
    title: '', minBet: 0, maxBet: 0,
  });
  
  // New state for delete confirmation
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [roomToDelete, setRoomToDelete] = useState<Room | null>(null);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error'
  });

  // initial load
  useEffect(() => { fetchRooms(); }, []);

  // ---------------- API -----------------
  const fetchRooms = async () => {
    try {
      const { data } = await apiClient.get<RoomDto[]>('/api/Room');
      setRooms(data.map(mapRoom));
    } catch (err) {
      console.error('Error fetching rooms:', err);
    }
  };

  const handleCreateRoom = async () => {
    if (!user) { console.error('No user logged in'); return; }

    try {
      await apiClient.post('/api/Room', {
        title:   newRoom.title,
        min_bet: newRoom.minBet,   // ★ snake_case keys
        max_bet: newRoom.maxBet,   // ★
        UserId:  user.id,          // backend keeps this PascalCase
      });

      setOpen(false);
      setNewRoom({ title: '', minBet: 0, maxBet: 0 });
      fetchRooms();
    } catch (err: any) {
      console.error('Error creating room:', err?.response?.data ?? err);
    }
  };

  // New function to handle room deletion
  const handleDeleteRoom = async () => {
    if (!roomToDelete) return;
    
    try {
      await deleteRoom(roomToDelete.id);
      setDeleteDialogOpen(false);
      setRoomToDelete(null);
      setSnackbar({
        open: true,
        message: 'Room deleted successfully',
        severity: 'success'
      });
      fetchRooms(); // Refresh the room list
    } catch (err: any) {
      console.error('Error deleting room:', err);
      setSnackbar({
        open: true,
        message: err?.response?.data?.message || 'Failed to delete room',
        severity: 'error'
      });
    }
  };

  const openDeleteConfirmation = (room: Room) => {
    setRoomToDelete(room);
    setDeleteDialogOpen(true);
  };
  
  const closeSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  // ---------------- RENDER -----------------
  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Box sx={{ display:'flex', justifyContent:'space-between', mb:4 }}>
        <Typography variant="h4">Blackjack Rooms</Typography>
        <Button variant="contained" onClick={() => setOpen(true)}>Create Room</Button>
      </Box>

      <Box sx={{ mt:4 }}>
        <Grid container spacing={3}>
          {rooms.length === 0 ? (
            <Grid sx={{ gridColumn: 'span 12' }}>
              <Paper sx={{ p:3, textAlign:'center' }}>
                <Typography>No rooms available. Create a new room to start playing!</Typography>
              </Paper>
            </Grid>
          ) : rooms.map(room => (
            <Grid key={room.id} sx={{ gridColumn: { xs: 'span 12', sm: 'span 6', md: 'span 4' } }}>
              <Card>
                <CardContent>
                  <Typography variant="h6">{room.title}</Typography>
                  <Divider sx={{ my:1 }} />
                  <Typography>Min Bet: ${room.minBet}</Typography>
                  <Typography>Max Bet: ${room.maxBet}</Typography>
                  <Typography>Status: {room.roomStatus}</Typography>
                  <Typography>
                    Created: {new Date(room.creationDate).toLocaleDateString()}
                  </Typography>
                  <Stack direction="row" spacing={1} sx={{ mt: 2 }}>
                    <Button fullWidth
                            variant="contained"
                            onClick={() => navigate(`/blackjack/room/${room.id}`)}>
                      Join Room
                    </Button>
                    {user && user.id === room.roomCreator && (
                      <Button 
                        variant="outlined"
                        color="error"
                        onClick={() => openDeleteConfirmation(room)}>
                        Delete
                      </Button>
                    )}
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* ─────────── Create-room dialog ─────────── */}
      <Dialog open={openCreateDialog} onClose={() => setOpen(false)}>
        <DialogTitle>Create New Room</DialogTitle>
        <DialogContent>
          <TextField autoFocus fullWidth margin="dense" label="Room Title"
                     value={newRoom.title}
                     onChange={e => setNewRoom({ ...newRoom, title: e.target.value })}/>
          <TextField fullWidth margin="dense" type="number" label="Minimum Bet"
                     value={newRoom.minBet}
                     onChange={e => setNewRoom({ ...newRoom, minBet: +e.target.value })}/>
          <TextField fullWidth margin="dense" type="number" label="Maximum Bet"
                     value={newRoom.maxBet}
                     onChange={e => setNewRoom({ ...newRoom, maxBet: +e.target.value })}/>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleCreateRoom}>Create</Button>
        </DialogActions>
      </Dialog>

      {/* ─────────── Delete confirmation dialog ─────────── */}
      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete the room "{roomToDelete?.title}"?
            This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button variant="contained" color="error" onClick={handleDeleteRoom}>
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      
      <Snackbar
        open={snackbar.open}
        autoHideDuration={5000}
        onClose={closeSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          onClose={closeSnackbar} 
          severity={snackbar.severity}
          variant="filled"
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default BlackjackWindow;
