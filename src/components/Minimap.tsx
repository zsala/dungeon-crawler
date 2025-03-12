import React from 'react';
import { Level } from '../types';
import { Map } from 'lucide-react';

interface MinimapProps {
  level: Level;
  playerPosition: { x: number; y: number };
  isVisible: boolean;
}

const Minimap: React.FC<MinimapProps> = ({ level, playerPosition, isVisible }) => {
  if (!isVisible) return null;

  const CELL_SIZE = 4; // Size of each tile in pixels

  return (
    <div className="bg-gray-800 p-4 rounded-lg shadow-lg">
      <div className="flex items-center gap-2 mb-2">
        <Map className="w-5 h-5 text-yellow-500" />
        <span className="text-sm text-gray-300">Minimap</span>
        <span className="text-xs text-gray-500">(M to toggle)</span>
      </div>
      <div className="relative border border-gray-700 p-1 rounded" style={{ 
        width: `${level.width * CELL_SIZE + 8}px`, 
        height: `${level.height * CELL_SIZE + 8}px` 
      }}>
        {/* Render base tiles first */}
        {level.tiles.map((row, y) => 
          row.map((tile, x) => {
            let bgColor = 'bg-black'; // Unexplored
            
            if (tile.explored) {
              switch (tile.type) {
                case 'wall':
                  bgColor = 'bg-stone-700';
                  break;
                case 'floor':
                  bgColor = 'bg-gray-600';
                  break;
                case 'door':
                  bgColor = tile.isDoorOpen ? 'bg-yellow-700' : 'bg-yellow-900';
                  break;
              }
            }

            return (
              <div
                key={`${x}-${y}`}
                className={`absolute ${bgColor}`}
                style={{
                  left: `${x * CELL_SIZE + 4}px`,
                  top: `${y * CELL_SIZE + 4}px`,
                  width: `${CELL_SIZE}px`,
                  height: `${CELL_SIZE}px`
                }}
              />
            );
          })
        )}
        
        {/* Render entities on explored tiles */}
        {level.entities.map(entity => {
          const tile = level.tiles[entity.position.y][entity.position.x];
          if (!tile.explored || entity.type === 'player') return null;

          let entityColor = '';
          switch (entity.type) {
            case 'enemy':
              entityColor = 'bg-red-500';
              break;
            case 'exit':
              entityColor = 'bg-green-500';
              break;
            default:
              return null;
          }

          return (
            <div
              key={entity.id}
              className={`absolute ${entityColor}`}
              style={{
                left: `${entity.position.x * CELL_SIZE + 4}px`,
                top: `${entity.position.y * CELL_SIZE + 4}px`,
                width: `${CELL_SIZE}px`,
                height: `${CELL_SIZE}px`
              }}
            />
          );
        })}
        
        {/* Player position (always visible) */}
        <div
          className="absolute bg-blue-500"
          style={{
            left: `${playerPosition.x * CELL_SIZE + 4}px`,
            top: `${playerPosition.y * CELL_SIZE + 4}px`,
            width: `${CELL_SIZE}px`,
            height: `${CELL_SIZE}px`
          }}
        />
      </div>
      
      <div className="mt-2 text-xs text-gray-500 grid grid-cols-2 gap-1">
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 bg-gray-600"></div>
          <span>Floor</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 bg-stone-700"></div>
          <span>Wall</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 bg-yellow-900"></div>
          <span>Door</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 bg-blue-500"></div>
          <span>Player</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 bg-red-500"></div>
          <span>Enemy</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 bg-green-500"></div>
          <span>Exit</span>
        </div>
      </div>
    </div>
  );
};

export default Minimap; 