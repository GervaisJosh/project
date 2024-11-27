import React from 'react';
import { Users, Play, Crown } from 'lucide-react';
import { Party, Player } from '../types/game';

interface LobbyScreenProps {
  party: Party;
  currentPlayer: Player;
  onStartGame: () => void;
}

export function LobbyScreen({ party, currentPlayer, onStartGame }: LobbyScreenProps) {
  const playerCount = party.players.filter(p => !p.isAdmin).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-6 flex flex-col">
      <div className="max-w-2xl mx-auto w-full flex-1">
        <div className="bg-white rounded-xl shadow-lg p-8">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Party Lobby</h2>
            <div className="flex items-center justify-center gap-2 text-gray-600">
              <Users size={20} />
              <span>{playerCount} {playerCount === 1 ? 'player' : 'players'} joined</span>
            </div>
            <div className="mt-4 p-3 bg-blue-50 rounded-lg">
              <p className="text-blue-800 font-medium">Party Code: {party.code}</p>
            </div>
          </div>

          <div className="space-y-4 mb-8">
            <h3 className="text-lg font-semibold text-gray-700 mb-4">Players:</h3>
            {party.players.map((player) => (
              <div
                key={player.id}
                className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg"
              >
                {player.isAdmin ? (
                  <Crown className="text-yellow-500" size={20} />
                ) : (
                  <Users className="text-gray-400" size={20} />
                )}
                <span className="font-medium text-gray-700">{player.name}</span>
                {player.isAdmin && (
                  <span className="text-sm text-gray-500 ml-2">(Host)</span>
                )}
              </div>
            ))}
          </div>

          {currentPlayer.isAdmin ? (
            <button
              onClick={onStartGame}
              disabled={playerCount < 2}
              className={`w-full flex items-center justify-center gap-2 py-3 rounded-lg text-white transition-colors ${
                playerCount < 2
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-blue-600 hover:bg-blue-700'
              }`}
            >
              <Play size={20} />
              Start Game
            </button>
          ) : (
            <div className="text-center text-gray-600">
              <p className="text-lg">Waiting for the host to start the game...</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}