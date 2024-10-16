import React, { useState, useEffect } from 'react';
import { AlertCircle } from 'lucide-react';
import GameBoard from './components/GameBoard';
import Keyboard from './components/Keyboard';
import { checkGuess } from './utils/gameLogic';

const WORDS = ['FALL', 'ARBOR', 'TOWN', 'FEST', 'ALL', 'CHEER', 'FOR', 'PLOTSIE', 'THE', 'BEST'];
const MAX_ATTEMPTS = 6;
const INITIAL_LIVES = ['🐱', '🧙', '🦊', '🥳', '👨‍🎤', '🤓', '🐸', '🤠', '🌝', '😘', '🐙', '👸', '🐹', '🐥', '👽', '🥸', '🦹', '🦄', '🦚', '🐳'];
const GHOST_EMOJI = '👻';

function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

function App() {
  const [secretWord, setSecretWord] = useState('');
  const [guesses, setGuesses] = useState<string[]>([]);
  const [currentGuess, setCurrentGuess] = useState('');
  const [gameWords, setGameWords] = useState<string[]>([]);
  const [winningWords, setWinningWords] = useState<string[]>([]);
  const [lives, setLives] = useState(INITIAL_LIVES);
  const [message, setMessage] = useState('');
  const [isGameOver, setIsGameOver] = useState(false);

  const isLowOnLives = lives.filter(life => life !== GHOST_EMOJI).length <= 4;

  useEffect(() => {
    startNewGame();
  }, []);

  const startNewGame = () => {
    const shuffledWords = shuffleArray(WORDS);
    setGameWords(shuffledWords);
    setWinningWords([]);
    setLives(INITIAL_LIVES);
    setIsGameOver(false);
    startNewRound(shuffledWords, []);
  };

  const startNewRound = (words: string[], winning: string[]) => {
    if (winning.length === WORDS.length) {
      setMessage("Congratulations! You've found all the words!");
      setIsGameOver(true);
      return;
    }

    const newSecretWord = words[winning.length];
    console.log("New secret word:", newSecretWord);
    setSecretWord(newSecretWord);
    setGuesses([]);
    setCurrentGuess('');
    setMessage('');
  };

  const handleKeyPress = (key: string) => {
    if (isGameOver || !secretWord) return;

    if (key === 'ENTER') {
      if (currentGuess.length !== secretWord.length) {
        setMessage(`The word must be ${secretWord.length} letters long.`);
        return;
      }
      submitGuess();
    } else if (key === 'BACKSPACE') {
      setCurrentGuess(currentGuess.slice(0, -1));
    } else if (currentGuess.length < secretWord.length) {
      setCurrentGuess(currentGuess + key);
    }
  };

  const submitGuess = () => {
    const newGuesses = [...guesses, currentGuess];
    setGuesses(newGuesses);
    setCurrentGuess('');

    if (currentGuess === secretWord) {
      handleCorrectGuess();
    } else {
      handleIncorrectGuess(newGuesses);
    }
  };

  const handleCorrectGuess = () => {
    const newWinningWords = [...winningWords, secretWord];
    setWinningWords(newWinningWords);
    setMessage(`Correct! You beautiful goose!`);
    setTimeout(() => {
      if (newWinningWords.length === WORDS.length) {
        setMessage("Congratulations! You've found all the words!");
        setIsGameOver(true);
      } else {
        startNewRound(gameWords, newWinningWords);
      }
    }, 2000);
  };

  const handleIncorrectGuess = (newGuesses: string[]) => {
    const newLives = [...lives];
    const remainingLives = newLives.filter(life => life !== GHOST_EMOJI);
    if (remainingLives.length > 0) {
      const randomIndex = newLives.findIndex(life => life !== GHOST_EMOJI);
      newLives[randomIndex] = GHOST_EMOJI;
      setLives(newLives);
    }

    if (newLives.every(life => life === GHOST_EMOJI)) {
      setMessage("You tragic monkey! You've lost! Tell Alma immediately!");
      setIsGameOver(true);
    } else if (newGuesses.length === MAX_ATTEMPTS) {
      setMessage(`You silly frog! The word was ${secretWord}`);
      const newWinningWords = [...winningWords, secretWord];
      setWinningWords(newWinningWords);
      setTimeout(() => startNewRound(gameWords, newWinningWords), 3000);
    }
  };

  return (
    <div className={`min-h-screen flex flex-col items-center justify-center p-4 ${isLowOnLives ? 'bg-red-100' : 'bg-gray-100'}`}>
      <h1 className="text-4xl font-bold mb-4">PHIRLDLE</h1>
      <div className="flex flex-wrap justify-center gap-2 mb-4">
        {winningWords.map((word, index) => (
          <span key={index} className="bg-green-500 text-white px-2 py-1 rounded text-sm">{word}</span>
        ))}
      </div>
      {!isGameOver && (
        <p className="mb-4 text-lg font-semibold">{winningWords.length}/10 words found</p>
      )}
      <div className="mb-4 text-2xl text-center">
        {lives.slice(0, 10).map((emoji, index) => (
          <span key={index}>{emoji}</span>
        ))}
        <br />
        {lives.slice(10).map((emoji, index) => (
          <span key={index + 10}>{emoji}</span>
        ))}
      </div>
      {message && (
        <div className="mb-4 p-2 bg-yellow-100 border border-yellow-300 rounded flex items-center">
          <AlertCircle className="text-yellow-700 mr-2" />
          <p>{message}</p>
        </div>
      )}
      {!isGameOver && secretWord && (
        <>
          <GameBoard guesses={guesses} currentGuess={currentGuess} secretWord={secretWord} />
          <Keyboard onKeyPress={handleKeyPress} guesses={guesses} secretWord={secretWord} />
        </>
      )}
      {isGameOver && (
        <button
          onClick={startNewGame}
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          I've told Alma, I want to try again.
        </button>
      )}
    </div>
  );
}

export default App;