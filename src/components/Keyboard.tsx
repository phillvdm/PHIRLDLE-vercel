import React from 'react';
import { checkGuess } from '../utils/gameLogic';

interface KeyboardProps {
  onKeyPress: (key: string) => void;
  guesses: string[];
  secretWord: string;
}

const Keyboard: React.FC<KeyboardProps> = ({ onKeyPress, guesses, secretWord }) => {
  const rows = [
    ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
    ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
    ['ENTER', 'Z', 'X', 'C', 'V', 'B', 'N', 'M', 'BACKSPACE'],
  ];

  const getKeyStatus = (key: string) => {
    let status = '';
    for (const guess of guesses) {
      const result = checkGuess(guess, secretWord);
      const index = guess.indexOf(key);
      if (index !== -1) {
        if (result[index] === 'correct') return 'correct';
        if (result[index] === 'present') status = 'present';
        if (result[index] === 'absent' && status === '') status = 'absent';
      }
    }
    return status;
  };

  return (
    <div className="mt-2">
      {rows.map((row, i) => (
        <div key={i} className="flex justify-center mb-1">
          {row.map((key) => {
            const status = getKeyStatus(key);
            return (
              <button
                key={key}
                onClick={() => onKeyPress(key)}
                className={`mx-0.5 px-1 py-2 rounded font-semibold text-xs sm:text-sm
                  ${
                    status === 'correct'
                      ? 'bg-green-500 text-white'
                      : status === 'present'
                      ? 'bg-yellow-500 text-white'
                      : status === 'absent'
                      ? 'bg-gray-500 text-white'
                      : 'bg-gray-200 text-black'
                  }
                  ${key.length > 1 ? 'px-2 sm:px-3' : 'w-7 sm:w-8'}
                `}
              >
                {key === 'BACKSPACE' ? '←' : key}
              </button>
            );
          })}
        </div>
      ))}
    </div>
  );
};

export default Keyboard;