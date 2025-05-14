// Socket.io event types
export interface RoomCreatedEvent {
  roomCode: string;
  poll: Poll;
}

export interface RoomJoinedEvent {
  roomCode: string;
  poll: Poll;
  timeRemaining: number;
}

export interface VoteUpdateEvent {
  poll: Poll;
}

export interface ErrorEvent {
  message: string;
}

// Poll data types
export interface PollOption {
  id: number;
  text: string;
  votes: number;
}

export interface Poll {
  question: string;
  options: PollOption[];
  timeLimit: number;
  startTime: number;
  active: boolean;
  voters: Record<string, number>;
}

// User data
export interface UserData {
  name: string;
}

// Application state
export interface AppState {
  user: UserData | null;
  roomCode: string | null;
  poll: Poll | null;
  timeRemaining: number;
  hasVoted: boolean;
  votedFor: number | null;
  error: string | null;
}