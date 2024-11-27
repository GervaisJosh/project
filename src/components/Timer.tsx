import React, { useEffect, useState } from 'react';

interface TimerProps {
  duration: number;
  onComplete: () => void;
  isRunning: boolean;
  variant?: 'primary' | 'secondary';
}

export function Timer({ duration, onComplete, isRunning, variant = 'primary' }: TimerProps) {
  const [timeLeft, setTimeLeft] = useState(duration);
  const circumference = 2 * Math.PI * 40;
  const progress = (timeLeft / duration) * circumference;
  
  const color = variant === 'primary' ? '#3b82f6' : '#8b5cf6';

  useEffect(() => {
    setTimeLeft(duration);
  }, [duration]);

  useEffect(() => {
    if (!isRunning) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          onComplete();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isRunning, onComplete]);

  return (
    <div className="relative w-20 h-20">
      <svg className="transform -rotate-90 w-20 h-20">
        <circle
          cx="40"
          cy="40"
          r="36"
          stroke="#e5e7eb"
          strokeWidth="8"
          fill="none"
        />
        <circle
          cx="40"
          cy="40"
          r="36"
          stroke={color}
          strokeWidth="8"
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={circumference - progress}
          className="transition-all duration-200"
        />
      </svg>
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-xl font-bold">
        {timeLeft}
      </div>
    </div>
  );
}