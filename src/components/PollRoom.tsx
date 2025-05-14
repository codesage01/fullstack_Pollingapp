import React from 'react';
import { Poll } from '../types';
import CountdownTimer from './CountdownTimer';
import PollOption from './PollOption';
import { Share2, Copy } from 'lucide-react';

interface PollRoomProps {
  poll: Poll;
  roomCode: string;
  timeRemaining: number;
  hasVoted: boolean;
  votedFor: number | null;
  onVote: (optionId: number) => void;
  userName: string;
}

const PollRoom: React.FC<PollRoomProps> = ({
  poll,
  roomCode,
  timeRemaining,
  hasVoted,
  votedFor,
  onVote,
  userName
}) => {
  const copyRoomCode = () => {
    navigator.clipboard.writeText(roomCode);
    alert('Room code copied to clipboard!');
  };
  
  // Calculate total votes
  const totalVotes = poll.options.reduce((sum, option) => sum + option.votes, 0);
  
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white shadow-lg rounded-2xl px-6 pt-6 pb-8 mb-4">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold text-gray-800">Live Poll</h2>
            
            <div className="flex items-center">
              <span 
                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  poll.active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}
              >
                {poll.active ? 'Active' : 'Ended'}
              </span>
            </div>
          </div>
          
          <div className="mb-6">
            <CountdownTimer seconds={timeRemaining} isActive={poll.active} />
          </div>
          
          <div className="flex justify-between items-center mb-2">
            <div className="flex items-center space-x-2">
              <div className="bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-1 rounded">
                Room: {roomCode}
              </div>
              <button 
                onClick={copyRoomCode}
                className="text-gray-500 hover:text-gray-700 transition-colors"
                title="Copy room code"
              >
                <Copy size={16} />
              </button>
            </div>
            
            <div className="text-sm text-gray-500">
              {totalVotes} {totalVotes === 1 ? 'vote' : 'votes'}
            </div>
          </div>
          
          <div className="mb-6">
            <h3 className="text-xl font-bold text-center text-gray-800 mb-4">
              {poll.question}
            </h3>
            
            <div className="space-y-4">
              {poll.options.map(option => (
                <PollOption
                  key={option.id}
                  option={option}
                  totalVotes={totalVotes}
                  hasVoted={hasVoted}
                  isSelected={votedFor === option.id}
                  isActive={poll.active}
                  onVote={() => onVote(option.id)}
                />
              ))}
            </div>
          </div>
          
          <div className="text-center text-sm text-gray-600">
            {hasVoted 
              ? `You voted for ${poll.options.find(o => o.id === votedFor)?.text}`
              : poll.active 
                ? 'Click an option to cast your vote'
                : 'This poll has ended'}
          </div>
          
          <div className="mt-6 pt-4 border-t border-gray-200">
            <div className="flex justify-between items-center">
              <div className="text-sm text-gray-500">
                Logged in as <span className="font-medium">{userName}</span>
              </div>
              
              <button 
                className="inline-flex items-center text-blue-600 hover:text-blue-800"
                onClick={copyRoomCode}
              >
                <Share2 size={16} className="mr-1" />
                <span className="text-sm">Share</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PollRoom;