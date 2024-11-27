import React, { useState } from 'react';
import { Send } from 'lucide-react';
import { Party, Player } from '../types/game';
import { questions } from '../data/questions';
import { GuessingPhase } from './GuessingPhase';
import { Timer } from './Timer';

interface PlayerViewProps {
  party: Party;
  currentPlayer: Player;
  onSubmitAnswer: (answer: string) => void;
  onSubmitGuess: (guessedPlayerId: string) => void;
}

export function PlayerView({ 
  party, 
  currentPlayer, 
  onSubmitAnswer,
  onSubmitGuess 
}: PlayerViewProps) {
  const [answer, setAnswer] = useState('');
  const currentQuestion = questions[party.currentQuestion];
  const isGuessingPhase = party.phase === 'guessing' || party.phase === 'reveal';

  const handleSubmit = () => {
    if (answer.trim()) {
      onSubmitAnswer(answer.trim());
      setAnswer('');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-6 flex flex-col">
      <div className="max-w-2xl mx-auto w-full flex-1 flex flex-col">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-sm font-medium text-gray-600">Party Code</h2>
            <p className="text-2xl font-bold text-gray-800">{party.code}</p>
          </div>
          {party.timerRunning && (
            <Timer
              duration={isGuessingPhase ? 10 : 30}
              onComplete={() => {}}
              isRunning={party.timerRunning}
              variant={isGuessingPhase ? 'secondary' : 'primary'}
            />
          )}
        </div>

        <div className="flex-1 flex flex-col items-center justify-center">
          {isGuessingPhase ? (
            <GuessingPhase
              party={party}
              currentPlayer={currentPlayer}
              onSubmitGuess={onSubmitGuess}
            />
          ) : (
            <div className="bg-white rounded-xl shadow-lg p-8 w-full mb-8">
              <h3 className="text-xl font-semibold text-center mb-6">
                {currentQuestion}
              </h3>

              {currentPlayer.hasSubmitted ? (
                <div className="text-center text-gray-600">
                  <p className="text-lg mb-2">Answer submitted!</p>
                  <p>Waiting for other players...</p>
                </div>
              ) : (
                <div className="space-y-4">
                  <textarea
                    value={answer}
                    onChange={(e) => setAnswer(e.target.value)}
                    placeholder="Type your answer here..."
                    className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 h-32 resize-none"
                  />
                  <button
                    onClick={handleSubmit}
                    disabled={!answer.trim()}
                    className={`w-full flex items-center justify-center gap-2 py-3 rounded-lg text-white transition-colors ${
                      answer.trim()
                        ? 'bg-blue-600 hover:bg-blue-700'
                        : 'bg-gray-400 cursor-not-allowed'
                    }`}
                  >
                    Submit Answer
                    <Send size={20} />
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}