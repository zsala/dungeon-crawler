import React from 'react';
import { Level } from '../types';
import TileComponent from './Tile';
import Entity from './Entity';

interface GameMapProps {
  level: Level;
  playerPosition: { x: number; y: number };
}

const GameMap: React.FC<GameMapProps> = ({ level, playerPosition }) => {
  // Calculate viewport dimensions
  const viewportWidth = 21; // Odd number to center on player
  const viewportHeight = 15; // Odd number to center on player
  
  // Calculate viewport boundaries
  const startX = Math.max(0, playerPosition.x - Math.floor(viewportWidth / 2));
  const endX = Math.min(level.width - 1, startX + viewportWidth - 1);
  const startY = Math.max(0, playerPosition.y - Math.floor(viewportHeight / 2));
  const endY = Math.min(level.height - 1, startY + viewportHeight - 1);
  
  // Adjust startX and startY if we're at the edge of the map
  const adjustedStartX = Math.max(0, Math.min(startX, level.width - viewportWidth));
  const adjustedStartY = Math.max(0, Math.min(startY, level.height - viewportHeight));
  
  return (
    <div className="relative border-2 border-gray-700 overflow-hidden">
      <div className="grid" style={{ 
        gridTemplateColumns: `repeat(${endX - adjustedStartX + 1}, 24px)`,
        gridTemplateRows: `repeat(${endY - adjustedStartY + 1}, 24px)`,
      }}>
        {level.tiles.slice(adjustedStartY, endY + 1).map((row, y) => 
          row.slice(adjustedStartX, endX + 1).map((tile, x) => (
            <TileComponent 
              key={`${x + adjustedStartX}-${y + adjustedStartY}`} 
              tile={tile} 
            />
          ))
        )}
      </div>
      
      {/* Render non-player entities */}
      {level.entities.filter(entity => entity.type !== 'player').map(entity => {
        const adjustedPosition = {
          x: entity.position.x - adjustedStartX,
          y: entity.position.y - adjustedStartY
        };
        
        // Only render if the entity is within the viewport
        if (adjustedPosition.x >= 0 && adjustedPosition.x <= (endX - adjustedStartX) &&
            adjustedPosition.y >= 0 && adjustedPosition.y <= (endY - adjustedStartY)) {
          return (
            <Entity 
              key={entity.id} 
              entity={{
                ...entity,
                position: adjustedPosition
              }}
              visible={level.tiles[entity.position.y][entity.position.x].visible}
            />
          );
        }
        return null;
      })}

      {/* Render player separately */}
      <Entity 
        key="player"
        entity={{
          id: "player",
          type: "player",
          name: "Hero",
          position: {
            x: playerPosition.x - adjustedStartX,
            y: playerPosition.y - adjustedStartY
          }
        }}
        visible={true}
      />
    </div>
  );
};

export default GameMap;