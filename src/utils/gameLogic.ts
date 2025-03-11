import { GameState, Position, Entity, InventoryItem } from '../types';
import { generateDungeon, calculateFOV } from './dungeonGenerator';

export const MAX_LEVEL = 10;

// Initialize a new game
export const initGame = (): GameState => {
  const dungeonLevel = 1;
  const level = generateDungeon(50, 30, dungeonLevel);
  
  // Find the player entity
  const player = level.entities.find(e => e.type === 'player');
  
  // If player is not found, create a default player at position 0,0
  const defaultPlayer: Entity = {
    id: 'player-1',
    type: 'player',
    position: { x: 0, y: 0 },
    health: 100,
    damage: 10,
    name: 'Hero'
  };
  
  const actualPlayer = player || defaultPlayer;
  
  // Add player to entities if not already there
  if (!player) {
    level.entities.push(actualPlayer);
  }
  
  // Calculate initial FOV
  const updatedLevel = calculateFOV(level, actualPlayer.position, 8);
  
  return {
    level: updatedLevel,
    player: actualPlayer,
    gameStatus: 'playing',
    message: 'Welcome to the dungeon! Use arrow keys to move.',
    dungeonLevel,
    inventory: []
  };
};

// Check if a position is walkable
const isWalkable = (state: GameState, pos: Position): boolean => {
  const { level } = state;
  
  // Check bounds
  if (pos.x < 0 || pos.x >= level.width || pos.y < 0 || pos.y >= level.height) {
    return false;
  }
  
  // Check tile type
  const tile = level.tiles[pos.y][pos.x];
  if (tile.type === 'wall') {
    return false;
  }
  
  // Doors are always walkable - we'll handle opening them in the movement logic
  if (tile.type === 'door') {
    return true;
  }
  
  return true;
};

// Get entity at position
const getEntityAtPosition = (state: GameState, pos: Position): Entity | undefined => {
  return state.level.entities.find(e => 
    e.position.x === pos.x && e.position.y === pos.y
  );
};

// Handle combat
const handleCombat = (state: GameState, player: Entity, enemy: Entity): GameState => {
  if (!enemy.health || !player.health || !player.damage || !enemy.damage) {
    return state;
  }
  
  // Player attacks enemy
  const newEnemyHealth = enemy.health - player.damage;
  
  if (newEnemyHealth <= 0) {
    // Enemy is defeated
    const updatedEntities = state.level.entities.filter(e => e.id !== enemy.id);
    const updatedLevel = {
      ...state.level,
      entities: updatedEntities
    };
    
    return {
      ...state,
      level: updatedLevel,
      message: `You defeated the ${enemy.name}!`
    };
  } else {
    // Enemy survives and counterattacks
    const updatedEnemy = {
      ...enemy,
      health: newEnemyHealth
    };
    
    const newPlayerHealth = player.health - enemy.damage;
    
    if (newPlayerHealth <= 0) {
      // Player is defeated
      return {
        ...state,
        player: {
          ...player,
          health: 0
        },
        gameStatus: 'lost',
        message: `You were defeated by the ${enemy.name}. Game over!`
      };
    } else {
      // Both survive
      const updatedPlayer = {
        ...player,
        health: newPlayerHealth
      };
      
      const updatedEntities = state.level.entities.map(e => 
        e.id === enemy.id ? updatedEnemy : e
      );
      
      const updatedLevel = {
        ...state.level,
        entities: updatedEntities
      };
      
      return {
        ...state,
        level: updatedLevel,
        player: updatedPlayer,
        message: `You hit the ${enemy.name} for ${player.damage} damage. It hits you back for ${enemy.damage} damage.`
      };
    }
  }
};

// Handle item pickup
const handleItemPickup = (state: GameState, player: Entity, item: Entity): GameState => {
  // Remove the item from the level
  const updatedEntities = state.level.entities.filter(e => e.id !== item.id);
  const updatedLevel = {
    ...state.level,
    entities: updatedEntities
  };
  
  const updatedPlayer = { ...player };
  let message = `You picked up a ${item.name}.`;
  
  // Update inventory
  const existingItem = state.inventory.find(i => i.name === item.name);
  let updatedInventory: InventoryItem[];
  
  if (existingItem) {
    updatedInventory = state.inventory.map(i => 
      i.name === item.name 
        ? { ...i, quantity: i.quantity + 1 }
        : i
    );
  } else {
    updatedInventory = [
      ...state.inventory,
      { id: item.id, name: item.name, quantity: 1 }
    ];
  }
  
  // Apply item effects
  switch (item.name) {
    case 'Health Potion':
      if (updatedPlayer.health) {
        updatedPlayer.health = Math.min(100, updatedPlayer.health + 20);
        message += ' You restored 20 health.';
      }
      break;
    case 'Strength Potion':
      if (updatedPlayer.damage) {
        updatedPlayer.damage += 2;
        message += ' Your damage increased by 2.';
      }
      break;
    case 'Shield':
      if (updatedPlayer.health) {
        updatedPlayer.health += 10;
        message += ' Your maximum health increased by 10.';
      }
      break;
  }
  
  return {
    ...state,
    level: updatedLevel,
    player: updatedPlayer,
    inventory: updatedInventory,
    message
  };
};

// Handle exit
const handleExit = (state: GameState): GameState => {
  const newDungeonLevel = state.dungeonLevel + 1;
  
  // Check if player has completed all levels
  if (newDungeonLevel > MAX_LEVEL) {
    return {
      ...state,
      gameStatus: 'won',
      message: 'Congratulations! You have completed all levels of the dungeon!'
    };
  }
  
  const newLevel = generateDungeon(50, 30, newDungeonLevel);
  
  // Create a new player with the same stats but at the new position
  const playerInNewLevel = newLevel.entities.find(e => e.type === 'player');
  
  // If no player is found in the new level, create a default position
  const defaultPosition = { x: 1, y: 1 };
  const playerPosition = playerInNewLevel ? playerInNewLevel.position : defaultPosition;
  
  const updatedPlayer = {
    ...state.player,
    position: playerPosition
  };
  
  // Remove the original player from entities
  const entitiesWithoutPlayer = newLevel.entities.filter(e => e.type !== 'player');
  
  // Calculate FOV for the new level
  const updatedLevel = calculateFOV(
    {
      ...newLevel,
      entities: entitiesWithoutPlayer
    },
    updatedPlayer.position,
    8
  );
  
  return {
    level: updatedLevel,
    player: updatedPlayer,
    gameStatus: 'playing',
    message: `You descended to dungeon level ${newDungeonLevel} of ${MAX_LEVEL}!`,
    dungeonLevel: newDungeonLevel,
    inventory: state.inventory
  };
};

// Move the player
export const movePlayer = (state: GameState, direction: 'up' | 'down' | 'left' | 'right'): GameState => {
  if (state.gameStatus !== 'playing') {
    return state;
  }
  
  const { player } = state;
  const newPos: Position = { ...player.position };
  
  switch (direction) {
    case 'up':
      newPos.y -= 1;
      break;
    case 'down':
      newPos.y += 1;
      break;
    case 'left':
      newPos.x -= 1;
      break;
    case 'right':
      newPos.x += 1;
      break;
  }
  
  // Check if the new position is walkable
  if (!isWalkable(state, newPos)) {
    return {
      ...state,
      message: 'You are idle.'
    };
  }
  
  // Create a new level object to ensure state updates properly
  const updatedLevel = {
    ...state.level,
    tiles: state.level.tiles.map(row => [...row])
  };
  
  // Handle door opening
  const targetTile = updatedLevel.tiles[newPos.y][newPos.x];
  let message = 'You are moving.';
  
  if (targetTile.type === 'door' && !targetTile.isDoorOpen) {
    targetTile.isDoorOpen = true;
    message = 'You open the door.';
  }
  
  // Check if there's an entity at the new position
  const entityAtNewPos = getEntityAtPosition(state, newPos);
  
  if (entityAtNewPos) {
    switch (entityAtNewPos.type) {
      case 'enemy':
        return handleCombat(state, player, entityAtNewPos);
      case 'item':
        return handleItemPickup(state, player, entityAtNewPos);
      case 'exit':
        return handleExit(state);
    }
  }
  
  // Move the player
  const updatedPlayer = {
    ...player,
    position: newPos
  };
  
  // Update FOV
  const levelWithFOV = calculateFOV(updatedLevel, newPos, 8);
  
  return {
    ...state,
    level: levelWithFOV,
    player: updatedPlayer,
    message
  };
};