import React, { useState } from 'react';
import { Vote, Users } from 'lucide-react';

interface WelcomeScreenProps {
  onCreateRoom: (name: string) => void;
  onJoinRoom: (roomCode: string, name: string) => void;
  error: string | null;
}

const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ 
  onCreateRoom, 
  onJoinRoom,
  error
}) => {
  const [name, setName] = useState('');
  const [roomCode, setRoomCode] = useState('');
  const [mode, setMode] = useState<'join' | 'create'>('join');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim()) {
      return;
    }
    
    if (mode === 'create') {
      onCreateRoom(name.trim());
    } else {
      if (!roomCode.trim()) {
        return;
      }
      onJoinRoom(roomCode.trim().toUpperCase(), name.trim());
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white shadow-lg rounded-2xl px-8 pt-6 pb-8 mb-4 transition-all duration-300">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-blue-600 mb-2">Quick Poll</h1>
            <p className="text-gray-600">Real-time polling made simple</p>
          </div>
          
          <div className="flex rounded-lg overflow-hidden mb-6">
            <button
              className={`flex-1 py-3 px-4 text-center transition-colors duration-200 ${
                mode === 'join' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
              onClick={() => setMode('join')}
            >
              <Users className="inline-block mr-2 h-5 w-5" />
              Join
            </button>
            <button
              className={`flex-1 py-3 px-4 text-center transition-colors duration-200 ${
                mode === 'create' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
              onClick={() => setMode('create')}
            >
              <Vote className="inline-block mr-2 h-5 w-5" />
              Create
            </button>
          </div>
          
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name">
                Your Name
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                id="name"
                type="text"
                placeholder="Enter your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            
            {mode === 'join' && (
              <div className="mb-6">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="room-code">
                  Room Code
                </label>
                <input
                  className="shadow appearance-none border rounded w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent uppercase"
                  id="room-code"
                  type="text"
                  placeholder="Enter room code"
                  value={roomCode}
                  onChange={(e) => setRoomCode(e.target.value)}
                  required={mode === 'join'}
                  maxLength={6}
                />
              </div>
            )}
            
            {error && (
              <div className="mb-4 p-3 bg-red-100 text-red-700 rounded text-sm">
                {error}
              </div>
            )}
            
            <div className="flex items-center justify-center">
              <button
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition-colors duration-200 w-full"
                type="submit"
              >
                {mode === 'create' ? 'Create Poll Room' : 'Join Poll Room'}
              </button>
            </div>
          </form>
        </div>
        
        <p className="text-center text-gray-500 text-xs">
          &copy; 2025 QuickPoll. All rights reserved.
        </p>
      </div>
    </div>
  );
};

export default WelcomeScreen;