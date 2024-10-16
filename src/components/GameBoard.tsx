import React from 'react';
import { checkGuess } from '../utils/gameLogic';

interface GameBoardProps {
  guesses: string[];
  currentGuess: string;
  secretWord: string;
}

const GameBoard: React.FC<GameBoardProps> = ({ guesses, currentGuess, secretWord }) => {
  if (!secretWord) {
    return null; // Don't render anything if secretWord is not set
  }

  const wordLength = secretWord.length;
  const totalRows = 6;
  const emptyRows = Math.max(0, totalRows - guesses.length - 1);

  const getCellSize = () => {
    switch (wordLength) {
      case 3: return 'w-10 h-10 text-2xl';
      case 4: return 'w-9 h-9 text-xl';
      case 5: return 'w-8 h-8 text-lg';
      case 7: return 'w-6 h-6 text-sm';
      default: return 'w-8 h-8 text-lg';
    }
  };

  const getContainerWidth = () => {
    switch (wordLength) {
      case 3: return 'w-[9.75rem]';
      case 4: return 'w-[11.75rem]';
      case 5: return 'w-[13.75rem]';
      case 7: return 'w-[14.75rem]';
      default: return 'w-[13.75rem]';
    }
  };

  const gridStyle = {
    display: 'grid',
    gridTemplateColumns: `repeat(${wordLength}, 1fr)`,
    gap: '0.25rem',
  };

  return (
    <div className={`grid gap-1 mb-4 mx-auto ${getContainerWidth()}`} style={{ gridTemplateRows: `repeat(${totalRows}, 1fr)` }}>
      {guesses.map((guess, i) => (
        <div key={i} style={gridStyle}>
          {checkGuess(guess, secretWord).map((result, j) => (
            <div
              key={j}
              className={`${getCellSize()} flex items-center justify-center font-bold rounded
                ${
                  result === 'correct'
                    ? 'bg-green-500 text-white'
                    : result === 'present'
                    ? 'bg-yellow-500 text-white'
                    : 'bg-gray-300 text-black'
                }`}
            >
              {guess[j]}
            </div>
          ))}
        </div>
      ))}
      {guesses.length < totalRows && (
        <div style={gridStyle}>
          {Array.from({ length: wordLength }).map((_, i) => (
            <div
              key={i}
              className={`${getCellSize()} flex items-center justify-center font-bold rounded bg-white border-2 border-gray-300`}
            >
              {i < currentGuess.length ? currentGuess[i] : ''}
            </div>
          ))}
        </div>
      )}
      {Array.from({ length: emptyRows }).map((_, i) => (
        <div key={i + guesses.length + 1} style={gridStyle}>
          {Array.from({ length: wordLength }).map((_, j) => (
            <div
              key={j}
              className={`${getCellSize()} flex items-center justify-center font-bold rounded bg-white border-2 border-gray-300`}
            ></div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default GameBoard;