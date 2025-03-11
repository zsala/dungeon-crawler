import React from 'react';

interface ControlsProps {
  onMove: (direction: 'up' | 'down' | 'left' | 'right') => void;
  gameStatus: 'playing' | 'won' | 'lost';
  onRestart: () => void;
}

const Controls: React.FC<ControlsProps> = ({ onMove, gameStatus, onRestart }) => {
  return (
    <div className="mt-4">
      {gameStatus !== 'playing' && (
        <div className="mb-4 text-center">
          <button 
            onClick={onRestart}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            Start New Game
          </button>
        </div>
      )}
      
      <div className="grid grid-cols-3 gap-2 max-w-xs mx-auto">
        <div></div>
        <button 
          onClick={() => onMove('up')}
          disabled={gameStatus !== 'playing'}
          className="bg-gray-700 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded disabled:opacity-50"
        >
          ↑
        </button>
        <div></div>
        
        <button 
          onClick={() => onMove('left')}
          disabled={gameStatus !== 'playing'}
          className="bg-gray-700 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded disabled:opacity-50"
        >
          ←
        </button>
        <div></div>
        <button 
          onClick={() => onMove('right')}
          disabled={gameStatus !== 'playing'}
          className="bg-gray-700 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded disabled:opacity-50"
        >
          →
        </button>
        
        <div></div>
        <button 
          onClick={() => onMove('down')}
          disabled={gameStatus !== 'playing'}
          className="bg-gray-700 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded disabled:opacity-50"
        >
          ↓
        </button>
        <div></div>
      </div>
      
      <div className="mt-4 text-center text-gray-400">
        <p>Use arrow keys, WASD keys, or buttons to move</p>
        <p>Attack enemies by moving into them</p>
        <p>Collect items by moving over them</p>
        <p>Find the exit (green arrow) to go deeper</p>
      </div>
    </div>
  );
};

export default Controls;