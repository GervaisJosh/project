import React from 'react';
import { Pause, Play } from 'lucide-react';

interface PauseButtonProps {
  isPaused: boolean;
  onTogglePause: () => void;
}

export function PauseButton({ isPaused, onTogglePause }: PauseButtonProps) {
  return (
    <button
      onClick={onTogglePause}
      className="fixed bottom-6 left-6 flex items-center gap-2 px-6 py-3 rounded-full text-white shadow-lg transition-all bg-purple-600 hover:bg-purple-700"
    >
      {isPaused ? (
        <>
          <Play size={20} />
          Resume Game
        </>
      ) : (
        <>
          <Pause size={20} />
          Pause Game
        </>
      )}
    </button>
  );
}