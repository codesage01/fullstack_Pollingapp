import React, { useEffect } from 'react';
import WelcomeScreen from './components/WelcomeScreen';
import PollRoom from './components/PollRoom';
import { usePoll } from './hooks/usePoll';

function App() {
  const {
    user,
    roomCode,
    poll,
    timeRemaining,
    hasVoted,
    votedFor,
    error,
    createPollRoom,
    joinPollRoom,
    castVote,
    reset
  } = usePoll();
  
  // Set page title based on state
  useEffect(() => {
    if (roomCode && poll) {
      document.title = `Poll: ${poll.question} (${roomCode})`;
    } else {
      document.title = 'Quick Poll - Real-time Polling';
    }
  }, [roomCode, poll]);

  // Render different views based on application state
  if (!user || !roomCode || !poll) {
    return (
      <WelcomeScreen 
        onCreateRoom={createPollRoom}
        onJoinRoom={joinPollRoom}
        error={error}
      />
    );
  }

  return (
    <PollRoom
      poll={poll}
      roomCode={roomCode}
      timeRemaining={timeRemaining}
      hasVoted={hasVoted}
      votedFor={votedFor}
      onVote={castVote}
      userName={user.name}
    />
  );
}

export default App;