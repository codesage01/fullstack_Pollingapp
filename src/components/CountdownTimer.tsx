import React, { useEffect, useState } from 'react';
import { Timer } from 'lucide-react';

interface CountdownTimerProps {
  seconds: number;
  isActive: boolean;
}

const CountdownTimer: React.FC<CountdownTimerProps> = ({ seconds, isActive }) => {
  const [progress, setProgress] = useState(100);
  
  // Calculate progress percentage
  useEffect(() => {
    if (seconds <= 0 || !isActive) {
      setProgress(0);
      return;
    }
    
    // 60 seconds is 100%, current seconds is x%
    const newProgress = (seconds / 60) * 100;
    setProgress(newProgress);
  }, [seconds, isActive]);
  
  // Format time as MM:SS
  const formatTime = (totalSeconds: number): string => {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };
  
  // Determine color based on time remaining
  const getColorClass = (): string => {
    if (progress > 60) return 'text-green-600';
    if (progress > 30) return 'text-yellow-600';
    return 'text-red-600';
  };
  
  return (
    <div className="flex items-center justify-center space-x-2">
      <div className="relative w-full h-2 bg-gray-200 rounded-full overflow-hidden">
        <div 
          className={`absolute left-0 top-0 h-full transition-all duration-1000 ease-linear ${
            progress > 60 
              ? 'bg-green-500' 
              : progress > 30 
                ? 'bg-yellow-500' 
                : 'bg-red-500'
          }`}
          style={{ width: `${progress}%` }}
        ></div>
      </div>
      
      <div className={`flex items-center space-x-1 font-mono ${getColorClass()}`}>
        <Timer size={16} />
        <span className="text-sm font-bold">{formatTime(seconds)}</span>
      </div>
    </div>
  );
};

export default CountdownTimer;