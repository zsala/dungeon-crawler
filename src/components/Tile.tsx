import React from 'react';
import type { Tile as TileType } from '../types';
import { DoorClosed, DoorOpen } from 'lucide-react';

interface TileProps {
  tile: TileType;
}

const TileComponent: React.FC<TileProps> = ({ tile }) => {
  if (!tile.visible && !tile.explored) {
    return <div className="w-6 h-6 bg-black" />;
  }
  
  const isVisible = tile.visible;
  const DoorIcon = tile.isDoorOpen ? DoorOpen : DoorClosed;
  let bgColor = 'bg-gray-800'; // Default unexplored

  if (isVisible) {
    switch (tile.type) {
      case 'floor':
        bgColor = 'bg-gray-600';
        break;
      case 'wall':
        bgColor = 'bg-stone-700';
        break;
      case 'door':
        bgColor = 'bg-gray-600';
        break;
    }
  } else if (tile.explored) {
    // Dimmer colors for explored but not visible tiles
    switch (tile.type) {
      case 'floor':
        bgColor = 'bg-gray-800';
        break;
      case 'wall':
        bgColor = 'bg-stone-900';
        break;
      case 'door':
        bgColor = 'bg-gray-800';
        break;
    }
  }
  
  return (
    <div className={`w-6 h-6 ${bgColor} flex items-center justify-center`}>
      {tile.type === 'door' && (
        <DoorIcon 
          className={`w-7 h-7 ${isVisible ? 'text-yellow-600' : 'text-yellow-900'}`}
        />
      )}
    </div>
  );
};

export default TileComponent;