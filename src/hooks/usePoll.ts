import { useState, useEffect, useCallback } from 'react';
import { AppState, Poll } from '../types';
import { useLocalStorage } from './useLocalStorage';
import {
  getSocket,
  createRoom,
  joinRoom,
  submitVote,
  onRoomCreated,
  onRoomJoined,
  onVoteUpdate,
  onPollEnded,
  onError,
  cleanupSocketListeners
} from '../socket';

// Initial state for the poll application
const initialState: AppState = {
  user: null,
  roomCode: null,
  poll: null,
  timeRemaining: 0,
  hasVoted: false,
  votedFor: null,
  error: null
};

export const usePoll = () => {
  // Use local storage to persist state
  const [persistedData, setPersistedData] = useLocalStorage<{
    user: AppState['user'],
    roomCode: AppState['roomCode'],
    hasVoted: AppState['hasVoted'],
    votedFor: AppState['votedFor']
  }>('poll-data', {
    user: null,
    roomCode: null,
    hasVoted: false,
    votedFor: null
  });

  // Initialize state with persisted data
  const [state, setState] = useState<AppState>({
    ...initialState,
    user: persistedData.user,
    roomCode: persistedData.roomCode,
    hasVoted: persistedData.hasVoted,
    votedFor: persistedData.votedFor
  });

  // Timer for countdown
  const [timerInterval, setTimerInterval] = useState<number | null>(null);

  // Update persisted data when relevant state changes
  useEffect(() => {
    setPersistedData({
      user: state.user,
      roomCode: state.roomCode,
      hasVoted: state.hasVoted,
      votedFor: state.votedFor
    });
  }, [state.user, state.roomCode, state.hasVoted, state.votedFor, setPersistedData]);

  // Set up socket listeners
  useEffect(() => {
    // Initialize socket connection
    getSocket();

    // Set up event listeners
    onRoomCreated((data) => {
      setState(prev => ({
        ...prev,
        roomCode: data.roomCode,
        poll: data.poll,
        timeRemaining: data.poll.timeLimit,
        error: null
      }));
    });

    onRoomJoined((data) => {
      setState(prev => ({
        ...prev,
        roomCode: data.roomCode,
        poll: data.poll,
        timeRemaining: data.timeRemaining,
        error: null
      }));
    });

    onVoteUpdate((data) => {
      setState(prev => ({
        ...prev,
        poll: data.poll
      }));
    });

    onPollEnded((data) => {
      setState(prev => ({
        ...prev,
        poll: data.poll
      }));

      // Clear the countdown interval when poll ends
      if (timerInterval) {
        clearInterval(timerInterval);
        setTimerInterval(null);
      }
    });

    onError((data) => {
      setState(prev => ({
        ...prev,
        error: data.message
      }));

      // Clear error after 5 seconds
      setTimeout(() => {
        setState(prev => ({ ...prev, error: null }));
      }, 5000);
    });

    // Cleanup listeners on unmount
    return () => {
      cleanupSocketListeners();
      if (timerInterval) {
        clearInterval(timerInterval);
      }
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Start countdown timer when poll is active
  useEffect(() => {
    if (state.poll?.active && state.timeRemaining > 0 && !timerInterval) {
      const interval = setInterval(() => {
        setState(prev => {
          const newTimeRemaining = Math.max(0, prev.timeRemaining - 1);
          
          // When timer reaches 0, clear the interval
          if (newTimeRemaining === 0 && timerInterval) {
            clearInterval(timerInterval);
            setTimerInterval(null);
          }
          
          return {
            ...prev,
            timeRemaining: newTimeRemaining
          };
        });
      }, 1000);
      
      // @ts-ignore - Window.setInterval returns number in browser
      setTimerInterval(interval);
      
      return () => {
        clearInterval(interval);
        setTimerInterval(null);
      };
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.poll, state.timeRemaining]);

  // Action handlers
  const createPollRoom = useCallback((name: string) => {
    const userData = { name };
    setState(prev => ({ ...prev, user: userData }));
    createRoom(userData);
  }, []);

  const joinPollRoom = useCallback((roomCode: string, name: string) => {
    setState(prev => ({ ...prev, user: { name } }));
    joinRoom(roomCode, name);
  }, []);

  const castVote = useCallback((optionId: number) => {
    if (!state.roomCode) return;
    
    submitVote(state.roomCode, optionId);
    
    setState(prev => ({
      ...prev,
      hasVoted: true,
      votedFor: optionId
    }));
  }, [state.roomCode]);

  const reset = useCallback(() => {
    setState(initialState);
    setPersistedData({
      user: null,
      roomCode: null,
      hasVoted: false,
      votedFor: null
    });
    if (timerInterval) {
      clearInterval(timerInterval);
      setTimerInterval(null);
    }
  }, [setPersistedData, timerInterval]);

  return {
    ...state,
    createPollRoom,
    joinPollRoom,
    castVote,
    reset
  };
};