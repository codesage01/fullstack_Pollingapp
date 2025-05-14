import React from 'react';
import { PollOption } from '../types';
import { CheckCircle } from 'lucide-react';

interface PollOptionProps {
  option: PollOption;
  totalVotes: number;
  hasVoted: boolean;
  isSelected: boolean;
  isActive: boolean;
  onVote: () => void;
}

const PollOptionComponent: React.FC<PollOptionProps> = ({
  option,
  totalVotes,
  hasVoted,
  isSelected,
  isActive,
  onVote
}) => {
  const percentage = totalVotes > 0 ? Math.round((option.votes / totalVotes) * 100) : 0;
  
  return (
    <div className="relative">
      <button
        onClick={onVote}
        disabled={hasVoted || !isActive}
        className={`
          relative w-full rounded-lg p-4 transition-all duration-200
          ${hasVoted 
            ? isSelected 
              ? 'bg-blue-100 border-2 border-blue-500'
              : 'bg-gray-100 border border-gray-300'
            : isActive
              ? 'border border-gray-300 hover:border-blue-500 hover:bg-blue-50 cursor-pointer'
              : 'bg-gray-100 border border-gray-300 cursor-not-allowed opacity-75'
          }
        `}
      >
        <div className="relative z-10 flex justify-between items-center">
          <span className="font-medium mr-2">{option.text}</span>
          
          {(hasVoted || !isActive) && (
            <div className="flex items-center">
              <span className="font-bold text-lg">{percentage}%</span>
              {isSelected && (
                <CheckCircle className="ml-2 text-blue-600" size={18} />
              )}
            </div>
          )}
        </div>
        
        {/* Progress bar (only visible after voting or when poll ended) */}
        {(hasVoted || !isActive) && (
          <div className="absolute left-0 top-0 h-full bg-gradient-to-r from-blue-200 to-purple-200 rounded-lg opacity-40 transition-all duration-1000"
            style={{ width: `${percentage}%` }}>
          </div>
        )}
      </button>
      
      {(hasVoted || !isActive) && (
        <div className="mt-1 text-sm text-gray-600 flex justify-between">
          <span>{option.votes} {option.votes === 1 ? 'vote' : 'votes'}</span>
        </div>
      )}
    </div>
  );
};

export default PollOptionComponent;