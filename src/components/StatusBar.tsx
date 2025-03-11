import React from 'react';
import { Entity } from '../types';

interface StatusBarProps {
  player: Entity;
  message: string;
  dungeonLevel: number;
}

const StatusBar: React.FC<StatusBarProps> = ({ player, message, dungeonLevel }) => {
  const healthPercentage = player.health ? (player.health / 100) * 100 : 0;
  
  return (
    <div className="bg-gray-800 p-4 text-white">
      <div className="flex justify-between items-center mb-2">
        <div>
          <span className="font-bold">Health: </span>
          <div className="w-48 h-4 bg-gray-700 rounded-full overflow-hidden inline-block ml-2">
            <div 
              className="h-full bg-red-600" 
              style={{ width: `${healthPercentage}%` }}
            ></div>
          </div>
          <span className="ml-2">{player.health}/100</span>
        </div>
        <div>
          <span className="font-bold">&nbsp;Damage: </span>
          <span>{player.damage}</span>
        </div>
        <div>
          <span className="font-bold">&nbsp;Level: </span>
          <span>{dungeonLevel}</span>
        </div>
      </div>
      <div className="bg-gray-700 p-2 rounded">
        {message}
      </div>
    </div>
  );
};

export default StatusBar;