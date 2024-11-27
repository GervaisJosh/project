import React from 'react';
import { Party, Player } from '../types/game';

interface GuessingPhaseProps {
  party: Party;
  currentPlayer: Player;
  onSubmitGuess: (guessedPlayerId: string) => void;
}

export function GuessingPhase({ party, currentPlayer, onSubmitGuess }: GuessingPhaseProps) {
  const currentAnswer = party.answers[party.currentAnswerIndex];
  const otherPlayers = party.players.filter(p => !p.isAdmin && p.id !== currentPlayer.id);
  const hasGuessed = currentPlayer.hasGuessed;

  if (!currentAnswer) return null;

  return (
    <div className="bg-white rounded-xl shadow-lg p-8 w-full mb-8">
      <div className="text-center mb-8">
        <h3 className="text-xl font-semibold mb-4">Who wrote this answer?</h3>
        <p className="text-2xl font-bold text-gray-800 p-6 bg-gray-50 rounded-lg">
          "{currentAnswer.content}"
        </p>
      </div>

      {party.phase === 'reveal' ? (
        <div className="text-center">
          <p className="text-lg mb-2">
            Answer was written by:{' '}
            <span className="font-bold">
              {party.players.find(p => p.id === currentAnswer.playerId)?.name}
            </span>
          </p>
          <p className="text-gray-600">Waiting for next answer...</p>
        </div>
      ) : hasGuessed ? (
        <div className="text-center text-gray-600">
          <p className="text-lg">Guess submitted!</p>
          <p>Waiting for other players...</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4">
          {otherPlayers.map((player) => (
            <button
              key={player.id}
              onClick={() => onSubmitGuess(player.id)}
              className="p-4 text-lg font-medium text-gray-700 bg-gray-50 rounded-lg hover:bg-blue-50 hover:text-blue-700 transition-colors"
            >
              {player.name}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}