import { useState, useEffect } from 'react';
import StartScreen from './components/StartScreen';
import GameScreen from './components/GameScreen';
import GameOverScreen from './components/GameOverScreen';

function App() {
  const [screen, setScreen] = useState('setup'); // setup | game | gameover

  // Game Setup State
  const [difficulty, setDifficulty] = useState(16); // 16, 36, 64
  const [mode, setMode] = useState(1); // 1: vs AI, 2: 2 Players

  // Game Result State
  const [scores, setScores] = useState({ 1: 0, 2: 0 });

  const startGame = (diff, selectedMode) => {
    setDifficulty(diff);
    setMode(selectedMode);
    setScreen('game');
  };

  const endGame = (finalScores) => {
    setScores(finalScores);
    setScreen('gameover');
  };

  const returnToMenu = () => {
    setScreen('setup');
  };

  return (
    <div className="w-full max-w-[1000px] p-8 flex flex-col min-h-screen z-10">
      <header className="text-center mb-10 pt-6">
        <h1 className="text-6xl font-extrabold tracking-tighter bg-gradient-to-br from-white to-slate-400 bg-clip-text text-transparent drop-shadow-sm pb-2">
          PokéMatch
        </h1>
        <p className="text-lg text-slate-400 font-light mt-2 tracking-wide">A premium memory experience</p>
      </header>

      <main className="flex-1 flex flex-col items-center w-full">
        {screen === 'setup' && (
          <StartScreen
            onStart={startGame}
            defaultDifficulty={difficulty}
            defaultMode={mode}
          />
        )}

        {screen === 'game' && (
          <GameScreen
            difficulty={difficulty}
            mode={mode}
            onEndGame={endGame}
            onQuit={returnToMenu}
          />
        )}

        {screen === 'gameover' && (
          <GameOverScreen
            scores={scores}
            mode={mode}
            onPlayAgain={() => setScreen('game')}
            onMainMenu={returnToMenu}
          />
        )}
      </main>

      <footer className="mt-auto text-center py-10 text-slate-500 text-sm flex justify-center items-center gap-3">
        <span>Powered by <a href="https://pokeapi.co/" target="_blank" rel="noreferrer" className="text-primary hover:text-indigo-400 font-medium transition-colors">PokéAPI</a></span>
      </footer>
    </div>
  );
}

export default App;
