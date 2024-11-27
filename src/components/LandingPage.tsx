import React, { useState } from 'react';
import { Users, PartyPopper } from 'lucide-react';
import { generatePartyCode, isValidPartyCode } from '../utils/partyCode';

interface LandingPageProps {
  onJoinParty: (name: string, code: string, isAdmin: boolean) => void;
}

export function LandingPage({ onJoinParty }: LandingPageProps) {
  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const [error, setError] = useState('');

  const handleCreateParty = () => {
    if (!name.trim()) {
      setError('Please enter your name');
      return;
    }
    const newCode = generatePartyCode();
    onJoinParty(name, newCode, true);
  };

  const handleJoinParty = () => {
    if (!name.trim()) {
      setError('Please enter your name');
      return;
    }
    if (!isValidPartyCode(code)) {
      setError('Invalid party code');
      return;
    }
    onJoinParty(name, code, false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Friendsgiving Party Game
          </h1>
          <p className="text-gray-600">Join the fun with friends!</p>
        </div>

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Your Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter your name"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Party Code
            </label>
            <input
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value.toUpperCase())}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter 6-digit code"
              maxLength={6}
            />
          </div>

          <button
            onClick={handleJoinParty}
            className="w-full bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors flex items-center justify-center gap-2"
          >
            <Users size={20} />
            Join Party
          </button>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">Or</span>
            </div>
          </div>

          <button
            onClick={handleCreateParty}
            className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
          >
            <PartyPopper size={20} />
            Create New Party
          </button>

          {error && (
            <p className="text-red-500 text-sm text-center">{error}</p>
          )}
        </div>
      </div>
    </div>
  );
}