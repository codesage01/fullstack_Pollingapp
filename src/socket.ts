import { io, Socket } from 'socket.io-client';
import {
  RoomCreatedEvent,
  RoomJoinedEvent,
  VoteUpdateEvent,
  ErrorEvent,
  UserData
} from './types';

// Create a singleton socket instance
const SOCKET_URL = 'http://localhost:3001';
let socket: Socket;

export const getSocket = (): Socket => {
  if (!socket) {
    socket = io(SOCKET_URL);
    console.log('Socket connection initialized');
  }
  return socket;
};

// Socket event emitters
export const createRoom = (userData: UserData): void => {
  getSocket().emit('create-room', userData);
};

export const joinRoom = (roomCode: string, name: string): void => {
  getSocket().emit('join-room', { roomCode, name });
};

export const submitVote = (roomCode: string, optionId: number): void => {
  getSocket().emit('submit-vote', { roomCode, optionId });
};

// Socket event listeners
export const onRoomCreated = (callback: (data: RoomCreatedEvent) => void): void => {
  getSocket().on('room-created', callback);
};

export const onRoomJoined = (callback: (data: RoomJoinedEvent) => void): void => {
  getSocket().on('room-joined', callback);
};

export const onVoteUpdate = (callback: (data: VoteUpdateEvent) => void): void => {
  getSocket().on('vote-update', callback);
};

export const onPollEnded = (callback: (data: VoteUpdateEvent) => void): void => {
  getSocket().on('poll-ended', callback);
};

export const onError = (callback: (data: ErrorEvent) => void): void => {
  getSocket().on('error', callback);
};

// Cleanup function to remove listeners
export const cleanupSocketListeners = (): void => {
  const socket = getSocket();
  socket.off('room-created');
  socket.off('room-joined');
  socket.off('vote-update');
  socket.off('poll-ended');
  socket.off('error');
};