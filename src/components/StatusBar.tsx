import React from 'react';
import { Entity } from '../types';
import { MAX_LEVEL } from '../utils/gameLogic';
import { Heart, Swords } from 'lucide-react';

interface StatusBarProps {
  player: Entity;
  message: string;
  dungeonLevel: number;
}

const StatusBar: React.FC<StatusBarProps> = ({ player, message, dungeonLevel }) => {
  const healthPercentage = player.health ? (player.health / 100) * 100 : 0;
  
  return (
    <div className="p-4 space-y-2">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <Heart className="w-5 h-5 text-red-500" />
          <div className="w-32 h-4 bg-gray-700 rounded-full overflow-hidden">
            <div 
              className="h-full bg-red-500 transition-all duration-300"
              style={{ width: `${healthPercentage}%` }}
            />
          </div>
          <span className="text-sm">{player.health}/100</span>
        </div>
        
        <div className="flex items-center gap-2">
          <Swords className="w-5 h-5 text-blue-400" />
          <span className="text-sm">DMG: {player.damage}</span>
        </div>
        
        <div className="flex items-center gap-2 ml-auto">
          <span className="text-sm text-yellow-500">
            Level: {dungeonLevel}/{MAX_LEVEL}
          </span>
          <div className="w-24 h-2 bg-gray-700 rounded-full overflow-hidden">
            <div 
              className="h-full bg-yellow-500 transition-all duration-300"
              style={{ width: `${(dungeonLevel / MAX_LEVEL) * 100}%` }}
            />
          </div>
        </div>
      </div>
      
      <div className="text-gray-300 text-sm">{message}</div>
    </div>
  );
};

export default StatusBar;