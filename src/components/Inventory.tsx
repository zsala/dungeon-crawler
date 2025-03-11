import React from 'react';
import { InventoryItem } from '../types';
import { Package } from 'lucide-react';

interface InventoryProps {
  items: InventoryItem[];
}

const Inventory: React.FC<InventoryProps> = ({ items }) => {
  return (
    <div className="bg-gray-800 p-4 rounded-lg">
      <div className="flex items-center gap-2 mb-3">
        <Package className="w-5 h-5 text-yellow-500" />
        <h2 className="text-lg font-semibold">Inventory</h2>
      </div>
      
      {items.length === 0 ? (
        <p className="text-gray-400 text-sm">No items collected yet</p>
      ) : (
        <div className="space-y-2">
          {items.map(item => (
            <div key={item.id} className="flex justify-between items-center bg-gray-700 p-2 rounded">
              <span className="text-yellow-500">{item.name}</span>
              <span className="text-gray-400 text-sm">x{item.quantity}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Inventory; 