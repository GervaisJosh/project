import React, { useState, useEffect } from 'react';
import { LandingPage } from './components/LandingPage';
import { LobbyScreen } from './components/LobbyScreen';
import { AdminView } from './components/AdminView';
import { PlayerView } from './components/PlayerView';
import { Party, Player, GameState } from './types/game';
import { partyStore } from './utils/partyStore';

const App = () => {
  const [gameState, setGameState] = useState<GameState>({
    party: null,
    currentPlayer: null
  });

  useEffect(() => {
    const partyCode = gameState.party?.code;
    if (!partyCode) {
      console.warn('[App] gameState.party is null, skipping subscription');
      return;
    }
  
    console.log(`[App] Subscribing to updates for party code: ${partyCode}`);
    const handlePartyUpdate = (updatedParty: Party) => {
      console.log(`[App] Received party update:`, updatedParty);
      setGameState(prev => ({
        ...prev,
        party: updatedParty
      }));
    };
  
    partyStore.subscribe(partyCode, handlePartyUpdate);
  
    return () => {
      console.log(`[App] Unsubscribing from updates for party code: ${partyCode}`);
      partyStore.unsubscribe(partyCode, handlePartyUpdate);
    };
  }, [gameState.party?.code]);

  const handleJoinParty = async (name: string, code: string, isAdmin: boolean) => {
    const player: Player = {
      id: crypto.randomUUID(),
      name,
      isAdmin,
      hasSubmitted: false,
      hasGuessed: false
    };
  
    const existingParty = await partyStore.getParty(code);
    if (existingParty && !isAdmin) {
      console.log(`[App] Adding player ${player.name} to party ${code}`);
      partyStore.addPlayer(code, player);
      setGameState({ party: existingParty, currentPlayer: player });
    } else {
      const newParty: Party = {
        code,
        players: { [player.id]: player }, // Initialize with an object instead of array
        currentQuestion: 0,
        answers: [],
        isActive: false,
        timerRunning: false,
        phase: 'lobby',
        currentAnswerIndex: 0,
        guesses: [],
        gameStarted: false,
        isPaused: false
      };
      console.log(`[App] Creating new party with code: ${code}`);
      partyStore.createParty(newParty);
      setGameState({ party: newParty, currentPlayer: player });
    }
  };

  const handleStartGame = () => {
    if (!gameState.party) return;

    const updatedParty: Party = {
      ...gameState.party,
      gameStarted: true,
      isActive: true,
      timerRunning: true,
      phase: 'answering'
    };

    console.log(`[App] Starting game for party: ${gameState.party.code}`);
    partyStore.updateParty(updatedParty.code, updatedParty);
  };

  const handleNextQuestion = () => {
    if (!gameState.party) return;

    const updatedParty: Party = {
      ...gameState.party,
      currentQuestion: gameState.party.currentQuestion + 1,
      answers: [],
      phase: 'answering',
      timerRunning: true
    };

    console.log(`[App] Moving to next question for party: ${gameState.party.code}`);
    partyStore.updateParty(updatedParty.code, updatedParty);
  };

  const handleTogglePause = () => {
    if (!gameState.party) return;

    const updatedParty: Party = {
      ...gameState.party,
      isPaused: !gameState.party.isPaused,
      timerRunning: gameState.party.isPaused
    };

    console.log(`[App] Toggling pause for party: ${gameState.party.code}`);
    partyStore.updateParty(updatedParty.code, updatedParty);
  };

  if (!gameState.party || !gameState.currentPlayer) {
    return <LandingPage onJoinParty={handleJoinParty} />;
  }

  if (!gameState.party.gameStarted) {
    return (
      <LobbyScreen
        party={gameState.party}
        currentPlayer={gameState.currentPlayer}
        onStartGame={handleStartGame}
      />
    );
  }

  if (gameState.currentPlayer.isAdmin) {
    return (
      <AdminView
        party={gameState.party}
        onNextQuestion={handleNextQuestion}
        onNextPhase={() => console.log('Next phase triggered')}
        onTogglePause={handleTogglePause}
      />
    );
  }

  return (
    <PlayerView
      party={gameState.party}
      currentPlayer={gameState.currentPlayer}
      onSubmitAnswer={(answer) => {
        if (!gameState.party) return;

        console.log(`[PlayerView] Player submitted answer:`, answer);
        const updatedParty: Party = {
          ...gameState.party,
          answers: [...gameState.party.answers, { playerId: gameState.currentPlayer!.id, content: answer }]
        };
        partyStore.updateParty(updatedParty.code, updatedParty);
      }}
      onSubmitGuess={(guess) => {
        if (!gameState.party) return;

        console.log(`[PlayerView] Player guessed:`, guess);
        const updatedParty: Party = {
          ...gameState.party,
          guesses: [...gameState.party.guesses, { 
            guessingPlayerId: gameState.currentPlayer!.id, 
            guessedPlayerId: guess, 
            answerId: gameState.party.currentAnswerIndex 
          }]
        };
        partyStore.updateParty(updatedParty.code, updatedParty);
      }}
    />
  );
};

export default App;