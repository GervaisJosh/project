import React from 'react';
import { Timer } from './Timer';
import { PauseButton } from './PauseButton';
import { Party, Player } from '../types/game';
import { questions } from '../data/questions';
import { ArrowRight } from 'lucide-react';

interface AdminViewProps {
  party: Party;
  onNextQuestion: () => void;
  onNextPhase: () => void;
  onTogglePause: () => void;
}

export function AdminView({ 
  party, 
  onNextQuestion, 
  onNextPhase,
  onTogglePause 
}: AdminViewProps) {
  const players = Object.values(party.players);
  const allSubmitted = players.every((p) => p.hasSubmitted || p.isAdmin);
  const allGuessed = players.every((p) => p.hasGuessed || p.isAdmin);
  const currentQuestion = questions[party.currentQuestion];
  const isGuessingPhase = party.phase === 'guessing' || party.phase === 'reveal';
  const currentAnswer = party.answers[party.currentAnswerIndex];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-6">
      <div className="max-w-3xl mx-auto">
        <div className="flex justify-between items-start mb-8">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">
              Party Code: {party.code}
            </h2>
            <p className="text-gray-600">
              Players: {players.filter((p) => !p.isAdmin).length}
            </p>
          </div>
          {party.timerRunning && !party.isPaused && (
            <Timer
              duration={isGuessingPhase ? 10 : 30}
              onComplete={onNextPhase}
              isRunning={party.timerRunning && !party.isPaused}
              variant={isGuessingPhase ? 'secondary' : 'primary'}
            />
          )}
        </div>

        {party.isPaused && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-8">
            <p className="text-yellow-800 font-medium text-center">Game Paused</p>
          </div>
        )}

        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <h3 className="text-xl font-semibold mb-4">{currentQuestion}</h3>
          {isGuessingPhase && currentAnswer && (
            <div className="mt-4 p-4 bg-gray-50 rounded-lg">
              <p className="text-lg font-medium">Current Answer:</p>
              <p className="text-xl mt-2">"{currentAnswer.content}"</p>
              {party.phase === 'reveal' && (
                <p className="mt-4 text-blue-600">
                  Written by: {Object.values(party.players).find(p => p.id === currentAnswer.playerId)?.name}
                </p>
              )}
            </div>
          )}
        </div>

        <PauseButton isPaused={party.isPaused} onTogglePause={onTogglePause} />

        <button
          onClick={isGuessingPhase ? onNextPhase : onNextQuestion}
          disabled={(isGuessingPhase ? !allGuessed : !allSubmitted) || party.isPaused}
          className={`fixed bottom-6 right-6 flex items-center gap-2 px-6 py-3 rounded-full text-white shadow-lg transition-all ${
            ((isGuessingPhase ? allGuessed : allSubmitted) && !party.isPaused)
              ? 'bg-blue-600 hover:bg-blue-700'
              : 'bg-gray-400 cursor-not-allowed'
          }`}
        >
          {isGuessingPhase ? 'Next Answer' : 'Start Guessing'}
          <ArrowRight size={20} />
        </button>
      </div>
    </div>
  );
}