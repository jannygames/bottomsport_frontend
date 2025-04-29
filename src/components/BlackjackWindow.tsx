// src/pages/BlackjackWindow.tsx
import React, { useState, useEffect } from 'react';
import {
    Box, Container, Typography, Button, Card, CardContent,
    TextField, Dialog, DialogTitle, DialogContent, DialogActions,
    Paper, Divider, Snackbar, Alert, Stack
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

const BlackjackWindow: React.FC = () => {
    const navigate = useNavigate();
    const { user } = useAuth();

    const [rooms, setRooms] = useState<Room[]>([]);
    const [openCreateDialog, setOpenCreateDialog] = useState(false);
    const [openEditDialog, setOpenEditDialog] = useState(false);
    const [newRoom, setNewRoom] = useState({ title: '', minBet: 0, maxBet: 0 });
    const [editRoom, setEditRoom] = useState<Room | null>(null);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [roomToDelete, setRoomToDelete] = useState<Room | null>(null);
    const [snackbar, setSnackbar] = useState({
        open: false,
        message: '',
        severity: 'success' as 'success' | 'error'
    });

    useEffect(() => {
        fetchRooms();
    }, []);

    const fetchRooms = async () => {
        try {
            const { data } = await apiClient.get<Room[]>('/api/Room');
            setRooms(data);
        } catch (err: unknown) {
            console.error('Error fetching rooms:', err);
        }
    };

    const handleCreateRoom = async () => {
        if (!user) return;

        try {
            await apiClient.post('/api/Room', {
                title: newRoom.title,
                minBet: newRoom.minBet,
                maxBet: newRoom.maxBet,
                userId: user.id
            });

            setOpenCreateDialog(false);
            setNewRoom({ title: '', minBet: 0, maxBet: 0 });
            setSnackbar({ open: true, message: 'Room created successfully!', severity: 'success' });
            fetchRooms();
        } catch (err: unknown) {
            console.error('Error creating room:', err);
            setSnackbar({ open: true, message: 'Failed to create room', severity: 'error' });
        }
    };

    const handleDeleteRoom = async () => {
        if (!roomToDelete) return;

        try {
            await apiClient.delete(`/api/Room/${roomToDelete.id}`);
            setDeleteDialogOpen(false);
            setRoomToDelete(null);
            setSnackbar({ open: true, message: 'Room deleted successfully!', severity: 'success' });
            fetchRooms();
        } catch (err: unknown) {
            console.error('Error deleting room:', err);
            setSnackbar({ open: true, message: 'Failed to delete room', severity: 'error' });
        }
    };

    const handleEditRoom = async () => {
        if (!editRoom) return;

        try {
            await apiClient.put(`/api/Room/update/${editRoom.id}`, {
                title: editRoom.title,
                minBet: editRoom.minBet,
                maxBet: editRoom.maxBet
            });

            setOpenEditDialog(false);
            setEditRoom(null);
            setSnackbar({ open: true, message: 'Room updated successfully!', severity: 'success' });
            fetchRooms();
        } catch (err: unknown) {
            console.error('Error updating room:', err);
            setSnackbar({ open: true, message: 'Failed to update room', severity: 'error' });
        }
    };

    const openDeleteConfirmation = (room: Room) => {
        setRoomToDelete(room);
        setDeleteDialogOpen(true);
    };

    const openEditRoomDialog = (room: Room) => {
        setEditRoom(room);
        setOpenEditDialog(true);
    };

    const closeSnackbar = () => {
        setSnackbar({ ...snackbar, open: false });
    };

    return (
        <Container maxWidth="lg" sx={{ mt: 4 }}>
            {/* Top Header */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 4 }}>
                <Typography variant="h4">Blackjack Rooms</Typography>
                <Button variant="contained" onClick={() => setOpenCreateDialog(true)}>
                    Create Room
                </Button>
            </Box>

            {/* Rooms Grid */}
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
                {rooms.length === 0 ? (
                    <Paper sx={{ p: 3, textAlign: 'center', width: '100%' }}>
                        <Typography>No rooms available. Create one!</Typography>
                    </Paper>
                ) : (
                    rooms.map((room) => (
                        <Card key={room.id} sx={{ width: 300, flexGrow: 1 }}>
                            <CardContent>
                                <Typography variant="h6">{room.title}</Typography>
                                <Divider sx={{ my: 1 }} />
                                <Typography>Min Bet: ${room.minBet}</Typography>
                                <Typography>Max Bet: ${room.maxBet}</Typography>
                                <Typography>Status: {room.roomStatus}</Typography>
                                <Typography>
                                    Created: {new Date(room.creationDate).toLocaleDateString()}
                                </Typography>
                                <Stack direction="row" spacing={1} sx={{ mt: 2 }}>
                                    <Button
                                        fullWidth
                                        variant="contained"
                                        onClick={() => navigate(`/blackjack/room/${room.id}`)}
                                    >
                                        Join
                                    </Button>
                                    {user && user.id === room.roomCreator && (
                                        <>
                                            <Button
                                                fullWidth
                                                variant="outlined"
                                                onClick={() => openEditRoomDialog(room)}
                                            >
                                                Edit
                                            </Button>
                                            <Button
                                                fullWidth
                                                variant="outlined"
                                                color="error"
                                                onClick={() => openDeleteConfirmation(room)}
                                            >
                                                Delete
                                            </Button>
                                        </>
                                    )}
                                </Stack>
                            </CardContent>
                        </Card>
                    ))
                )}
            </Box>

            {/* Create Room Dialog */}
            <Dialog open={openCreateDialog} onClose={() => setOpenCreateDialog(false)}>
                <DialogTitle>Create New Room</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        fullWidth
                        margin="dense"
                        label="Room Title"
                        value={newRoom.title}
                        onChange={(e) => setNewRoom({ ...newRoom, title: e.target.value })}
                    />
                    <TextField
                        fullWidth
                        margin="dense"
                        type="number"
                        label="Minimum Bet"
                        value={newRoom.minBet}
                        onChange={(e) => setNewRoom({ ...newRoom, minBet: +e.target.value })}
                    />
                    <TextField
                        fullWidth
                        margin="dense"
                        type="number"
                        label="Maximum Bet"
                        value={newRoom.maxBet}
                        onChange={(e) => setNewRoom({ ...newRoom, maxBet: +e.target.value })}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenCreateDialog(false)}>Cancel</Button>
                    <Button variant="contained" onClick={handleCreateRoom}>
                        Create
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Edit Room Dialog */}
            <Dialog open={openEditDialog} onClose={() => setOpenEditDialog(false)}>
                <DialogTitle>Edit Room</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        fullWidth
                        margin="dense"
                        label="Room Title"
                        value={editRoom?.title || ''}
                        onChange={(e) =>
                            setEditRoom(editRoom ? { ...editRoom, title: e.target.value } : null)
                        }
                    />
                    <TextField
                        fullWidth
                        margin="dense"
                        type="number"
                        label="Minimum Bet"
                        value={editRoom?.minBet || 0}
                        onChange={(e) =>
                            setEditRoom(editRoom ? { ...editRoom, minBet: +e.target.value } : null)
                        }
                    />
                    <TextField
                        fullWidth
                        margin="dense"
                        type="number"
                        label="Maximum Bet"
                        value={editRoom?.maxBet || 0}
                        onChange={(e) =>
                            setEditRoom(editRoom ? { ...editRoom, maxBet: +e.target.value } : null)
                        }
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenEditDialog(false)}>Cancel</Button>
                    <Button variant="contained" onClick={handleEditRoom}>
                        Save Changes
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Delete Room Confirmation Dialog */}
            <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
                <DialogTitle>Confirm Deletion</DialogTitle>
                <DialogContent>
                    <Typography>
                        Are you sure you want to delete the room "{roomToDelete?.title}"?
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
                    <Button variant="contained" color="error" onClick={handleDeleteRoom}>
                        Delete
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Snackbar */}
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
