export interface Player {
  id: string;
  name: string;
  isAdmin: boolean;
  hasSubmitted: boolean;
  hasGuessed: boolean;
}

// in game.ts
export interface Party {
  code: string;
  players: { [key: string]: Player }; // Change this from Player[] to an object
  currentQuestion: number;
  answers: Answer[];
  isActive: boolean;
  timerRunning: boolean;
  phase: GamePhase;
  currentAnswerIndex: number;
  guesses: Guess[];
  gameStarted: boolean;
  isPaused: boolean;
}

export interface Answer {
  playerId: string;
  content: string;
}

export interface Guess {
  guessingPlayerId: string;
  guessedPlayerId: string;
  answerId: number;
}

export interface GameState {
  party: Party | null;
  currentPlayer: Player | null;
}

export type GamePhase = 'lobby' | 'answering' | 'guessing' | 'reveal';