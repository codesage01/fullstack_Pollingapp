import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

// In-memory store for poll rooms
const rooms = new Map();

// Generate a random 6-character room code
const generateRoomCode = () => {
  return Math.random().toString(36).substring(2, 8).toUpperCase();
};

// Generate a default poll question
const generateDefaultPoll = () => {
  return {
    question: 'Which do you prefer?',
    options: [
      { id: 1, text: 'Cats', votes: 0 },
      { id: 2, text: 'Dogs', votes: 0 }
    ],
    timeLimit: 60, // 60 seconds
    startTime: Date.now(),
    active: true,
    voters: {}
  };
};

io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  // Create a new poll room
  socket.on('create-room', (userData) => {
    const roomCode = generateRoomCode();
    const poll = generateDefaultPoll();
    
    rooms.set(roomCode, {
      host: socket.id,
      poll,
      users: { [socket.id]: userData.name }
    });

    socket.join(roomCode);
    socket.emit('room-created', { roomCode, poll });
    
    // Start the timer for this room
    const timer = setTimeout(() => {
      if (rooms.has(roomCode)) {
        const room = rooms.get(roomCode);
        room.poll.active = false;
        io.to(roomCode).emit('poll-ended', { poll: room.poll });
      }
    }, poll.timeLimit * 1000);
    
    // Store the timer reference
    rooms.get(roomCode).timer = timer;

    console.log(`Room created: ${roomCode} by ${userData.name}`);
  });

  // Join an existing poll room
  socket.on('join-room', (data) => {
    const { roomCode, name } = data;
    
    if (!rooms.has(roomCode)) {
      socket.emit('error', { message: 'Room not found' });
      return;
    }
    
    const room = rooms.get(roomCode);
    room.users[socket.id] = name;
    
    socket.join(roomCode);
    socket.emit('room-joined', { 
      roomCode,
      poll: room.poll,
      // Calculate remaining time
      timeRemaining: Math.max(0, 
        room.poll.timeLimit - Math.floor((Date.now() - room.poll.startTime) / 1000))
    });
    
    console.log(`${name} joined room: ${roomCode}`);
  });

  // Submit a vote
  socket.on('submit-vote', (data) => {
    const { roomCode, optionId } = data;
    
    if (!rooms.has(roomCode)) {
      socket.emit('error', { message: 'Room not found' });
      return;
    }
    
    const room = rooms.get(roomCode);
    
    // Check if poll is still active
    if (!room.poll.active) {
      socket.emit('error', { message: 'Poll has ended' });
      return;
    }
    
    // Check if user has already voted
    if (room.poll.voters[socket.id]) {
      socket.emit('error', { message: 'You have already voted' });
      return;
    }
    
    // Record the vote
    const option = room.poll.options.find(opt => opt.id === optionId);
    if (option) {
      option.votes += 1;
      room.poll.voters[socket.id] = optionId;
      
      // Broadcast updated results to all clients in the room
      io.to(roomCode).emit('vote-update', { poll: room.poll });
      console.log(`Vote registered in room ${roomCode} for option ${optionId}`);
    }
  });
  
  // Handle disconnection
  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
    
    // Remove user from their rooms
    rooms.forEach((room, roomCode) => {
      if (room.users[socket.id]) {
        delete room.users[socket.id];
        
        // If room is empty, clean it up
        if (Object.keys(room.users).length === 0) {
          if (room.timer) {
            clearTimeout(room.timer);
          }
          rooms.delete(roomCode);
          console.log(`Room ${roomCode} deleted (empty)`);
        }
      }
    });
  });
});

const PORT = process.env.PORT || 3001;
httpServer.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});