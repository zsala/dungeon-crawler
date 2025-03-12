import { useState, useEffect } from 'react';
import GameMap from './components/GameMap';
import StatusBar from './components/StatusBar';
import Controls from './components/Controls';
import Inventory from './components/Inventory';
import Minimap from './components/Minimap';
import { initGame, movePlayer } from './utils/gameLogic';
import { GameState } from './types';

function App() {
  const [gameState, setGameState] = useState<GameState>(initGame());
  const [showMinimap, setShowMinimap] = useState(true);

  // Handle keyboard input
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Handle minimap toggle
      if (e.key.toLowerCase() === 'm') {
        setShowMinimap(prev => !prev);
        return;
      }

      if (gameState.gameStatus !== 'playing') return;
      
      switch (e.key.toLowerCase()) {
        case 'arrowup':
        case 'w':
          setGameState(prevState => movePlayer(prevState, 'up'));
          break;
        case 'arrowdown':
        case 's':
          setGameState(prevState => movePlayer(prevState, 'down'));
          break;
        case 'arrowleft':
        case 'a':
          setGameState(prevState => movePlayer(prevState, 'left'));
          break;
        case 'arrowright':
        case 'd':
          setGameState(prevState => movePlayer(prevState, 'right'));
          break;
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [gameState.gameStatus]);

  // Handle button movement
  const handleMove = (direction: 'up' | 'down' | 'left' | 'right') => {
    setGameState(prevState => movePlayer(prevState, direction));
  };

  // Restart the game
  const handleRestart = () => {
    setGameState(initGame());
    setShowMinimap(true);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center p-4">
      <h1 className="text-3xl font-bold mb-4">Dungeon Crawler</h1>
      
      {gameState.gameStatus === 'won' && (
        <div className="bg-green-800 p-4 mb-4 rounded text-center">
          <h2 className="text-2xl font-bold">Victory!</h2>
          <p>You have conquered the dungeon!</p>
        </div>
      )}
      
      {gameState.gameStatus === 'lost' && (
        <div className="bg-red-800 p-4 mb-4 rounded text-center">
          <h2 className="text-2xl font-bold">Defeat!</h2>
          <p>You have been slain in the dungeon!</p>
        </div>
      )}
      
      <div className="flex gap-8 items-start">
        <div className="bg-gray-800 p-2 rounded-lg shadow-lg">
          <StatusBar 
            player={gameState.player} 
            message={gameState.message}
            dungeonLevel={gameState.dungeonLevel}
          />
          
          <div className="flex gap-4">
            <GameMap 
              level={gameState.level} 
              playerPosition={gameState.player.position}
            />
            
            <div className="w-64">
              <Inventory items={gameState.inventory} />
            </div>
          </div>
          
          <Controls 
            onMove={handleMove}
            gameStatus={gameState.gameStatus}
            onRestart={handleRestart}
          />
        </div>

        <Minimap
          level={gameState.level}
          playerPosition={gameState.player.position}
          isVisible={showMinimap}
        />
      </div>
      
      <div className="mt-4 text-gray-400 text-sm">
        <p>Dungeon Crawler Game - Created with React and TypeScript</p>
      </div>
    </div>
  );
}

export default App;