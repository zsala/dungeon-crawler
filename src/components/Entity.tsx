import React from 'react';
import { Entity as EntityType } from '../types';
import { Cat, Rat, ArrowDownToLine, Wheat } from 'lucide-react';

interface EntityProps {
  entity: EntityType;
  visible: boolean;
}

const Entity: React.FC<EntityProps> = ({ entity, visible }) => {
  if (!visible) return null;
  
  let icon: JSX.Element;
  let color: string;
  
  switch (entity.type) {
    case 'player':
      icon = <Rat className="w-6 h-6" strokeWidth={1.5} />;
      color = 'text-blue-400';
      break;
    case 'enemy':
      icon = <Cat className="w-6 h-6" />;
      color = 'text-red-500';
      break;
    case 'item':
      icon = <Wheat className="w-6 h-6" />;
      color = 'text-yellow-500';
      break;
    case 'exit':
      icon = <ArrowDownToLine className="w-6 h-6" />;
      color = 'text-green-500';
      break;
  }
  
  return (
    <div 
      className={`absolute w-6 h-6 flex items-center justify-center ${color}`} 
      style={{
        left: `${entity.position.x * 24}px`,
        top: `${entity.position.y * 24}px`,
        transform: 'translate(0%, 0%)',
        pointerEvents: 'none',
        zIndex: entity.type === 'player' ? 10 : 1
      }}
    >
      {icon}
    </div>
  );
};

export default Entity;