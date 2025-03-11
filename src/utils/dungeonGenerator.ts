import { Level, Tile, Entity, Position, EntityType } from '../types';

// Generate a random integer between min and max (inclusive)
const randomInt = (min: number, max: number): number => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

// Generate a unique ID
const generateId = (): string => {
  return Math.random().toString(36).substring(2, 15);
};

// Check if a position is within the bounds of the level
const isInBounds = (pos: Position, width: number, height: number): boolean => {
  return pos.x >= 0 && pos.x < width && pos.y >= 0 && pos.y < height;
};

// Check if a position is a wall
const isWall = (tiles: Tile[][], pos: Position): boolean => {
  if (!isInBounds(pos, tiles[0].length, tiles.length)) return true;
  return tiles[pos.y][pos.x].type === 'wall';
};

// Create a new entity
const createEntity = (type: EntityType, position: Position, name: string, health?: number, damage?: number): Entity => {
  return {
    id: generateId(),
    type,
    position: { ...position },
    name,
    health,
    damage
  };
};

// Generate a random dungeon level
export const generateDungeon = (width: number, height: number, dungeonLevel: number): Level => {
  // Initialize tiles with walls
  const tiles: Tile[][] = Array(height).fill(null).map((_, y) => 
    Array(width).fill(null).map((_, x) => ({
      type: 'wall',
      position: { x, y },
      visible: false,
      explored: false,
      isDoorOpen: false
    }))
  );

  // Create rooms
  const numRooms = randomInt(5, 8);
  const rooms: { x: number, y: number, width: number, height: number }[] = [];
  
  for (let i = 0; i < numRooms; i++) {
    const roomWidth = randomInt(5, 10);
    const roomHeight = randomInt(5, 10);
    const roomX = randomInt(1, width - roomWidth - 1);
    const roomY = randomInt(1, height - roomHeight - 1);
    
    // Check if the room overlaps with existing rooms
    let overlaps = false;
    for (const room of rooms) {
      if (
        roomX <= room.x + room.width + 1 &&
        roomX + roomWidth + 1 >= room.x &&
        roomY <= room.y + room.height + 1 &&
        roomY + roomHeight + 1 >= room.y
      ) {
        overlaps = true;
        break;
      }
    }
    
    if (!overlaps) {
      rooms.push({ x: roomX, y: roomY, width: roomWidth, height: roomHeight });
      
      // Carve out the room
      for (let y = roomY; y < roomY + roomHeight; y++) {
        for (let x = roomX; x < roomX + roomWidth; x++) {
          tiles[y][x].type = 'floor';
        }
      }
    }
  }
  
  // If no rooms were created, create at least one room
  if (rooms.length === 0) {
    const roomWidth = randomInt(5, 10);
    const roomHeight = randomInt(5, 10);
    const roomX = randomInt(1, width - roomWidth - 1);
    const roomY = randomInt(1, height - roomHeight - 1);
    
    rooms.push({ x: roomX, y: roomY, width: roomWidth, height: roomHeight });
    
    // Carve out the room
    for (let y = roomY; y < roomY + roomHeight; y++) {
      for (let x = roomX; x < roomX + roomWidth; x++) {
        tiles[y][x].type = 'floor';
      }
    }
  }
  
  // Connect rooms with corridors
  for (let i = 0; i < rooms.length - 1; i++) {
    const roomA = rooms[i];
    const roomB = rooms[i + 1];
    
    const startX = roomA.x + Math.floor(roomA.width / 2);
    const startY = roomA.y + Math.floor(roomA.height / 2);
    const endX = roomB.x + Math.floor(roomB.width / 2);
    const endY = roomB.y + Math.floor(roomB.height / 2);
    
    // Horizontal corridor
    for (let x = Math.min(startX, endX); x <= Math.max(startX, endX); x++) {
      tiles[startY][x].type = 'floor';
    }
    
    // Vertical corridor
    for (let y = Math.min(startY, endY); y <= Math.max(startY, endY); y++) {
      tiles[y][endX].type = 'floor';
    }
  }
  
  // Add some doors
  const doors: Position[] = [];
  for (let y = 1; y < height - 1; y++) {
    for (let x = 1; x < width - 1; x++) {
      if (tiles[y][x].type === 'floor') {
        // Check if this is a corridor position (has walls on opposite sides)
        const hasNorthSouthWalls = 
          isWall(tiles, { x, y: y - 1 }) && 
          isWall(tiles, { x, y: y + 1 }) &&
          !isWall(tiles, { x: x - 1, y }) && 
          !isWall(tiles, { x: x + 1, y });
        
        const hasEastWestWalls = 
          isWall(tiles, { x: x - 1, y }) && 
          isWall(tiles, { x: x + 1, y }) &&
          !isWall(tiles, { x, y: y - 1 }) && 
          !isWall(tiles, { x, y: y + 1 });
        
        if ((hasNorthSouthWalls || hasEastWestWalls) && Math.random() < 0.2) {
          tiles[y][x] = {
            ...tiles[y][x],
            type: 'door',
            isDoorOpen: false
          };
          doors.push({ x, y });
        }
      }
    }
  }
  
  // Create entities
  const entities: Entity[] = [];
  
  // Player starts in the first room
  if (rooms.length > 0) {
    const playerRoom = rooms[0];
    const playerX = playerRoom.x + Math.floor(playerRoom.width / 2);
    const playerY = playerRoom.y + Math.floor(playerRoom.height / 2);
    const player = createEntity('player', { x: playerX, y: playerY }, 'Hero', 100, 10);
    entities.push(player);
  }
  
  // Add exit in the last room
  if (rooms.length > 1) {
    const exitRoom = rooms[rooms.length - 1];
    const exitX = exitRoom.x + Math.floor(exitRoom.width / 2);
    const exitY = exitRoom.y + Math.floor(exitRoom.height / 2);
    entities.push(createEntity('exit', { x: exitX, y: exitY }, 'Exit'));
  }
  
  // Add enemies
  const numEnemies = randomInt(3, 5 + dungeonLevel);
  for (let i = 1; i < rooms.length - 1; i++) {
    if (entities.length >= numEnemies + 2) break; // +2 for player and exit
    
    const room = rooms[i];
    const enemyX = room.x + randomInt(1, room.width - 2);
    const enemyY = room.y + randomInt(1, room.height - 2);
    
    const enemyTypes = ['Cat'];
    const enemyType = enemyTypes[randomInt(0, enemyTypes.length - 1)];
    const enemyHealth = randomInt(20, 40) + dungeonLevel * 5;
    const enemyDamage = randomInt(5, 10) + dungeonLevel;
    
    entities.push(createEntity('enemy', { x: enemyX, y: enemyY }, enemyType, enemyHealth, enemyDamage));
  }
  
  // Add items
  const numItems = randomInt(2, 4);
  for (let i = 0; i < numItems && i < rooms.length - 2; i++) {
    const roomIndex = randomInt(1, Math.max(1, rooms.length - 2));
    if (roomIndex < rooms.length) {
      const room = rooms[roomIndex];
      const itemX = room.x + randomInt(1, room.width - 2);
      const itemY = room.y + randomInt(1, room.height - 2);
      
      const itemTypes = ['Health Potion', 'Strength Potion', 'Shield'];
      const itemType = itemTypes[randomInt(0, itemTypes.length - 1)];
      
      entities.push(createEntity('item', { x: itemX, y: itemY }, itemType));
    }
  }
  
  return {
    width,
    height,
    tiles,
    entities
  };
};

// Calculate field of view (simple ray casting)
export const calculateFOV = (level: Level, playerPos: Position, viewRadius: number): Level => {
  const { tiles } = level;
  
  // Reset visibility
  for (let y = 0; y < level.height; y++) {
    for (let x = 0; x < level.width; x++) {
      tiles[y][x].visible = false;
    }
  }
  
  // Make sure player position is valid
  if (playerPos.x < 0 || playerPos.x >= level.width || 
      playerPos.y < 0 || playerPos.y >= level.height) {
    return level;
  }
  
  // Always make player's position visible
  tiles[playerPos.y][playerPos.x].visible = true;
  tiles[playerPos.y][playerPos.x].explored = true;
  
  // Cast rays in all directions
  for (let angle = 0; angle < 360; angle += 1) {
    const radians = angle * (Math.PI / 180);
    const dx = Math.cos(radians);
    const dy = Math.sin(radians);
    
    let x = playerPos.x + 0.5;
    let y = playerPos.y + 0.5;
    
    for (let i = 0; i < viewRadius; i++) {
      x += dx;
      y += dy;
      
      const mapX = Math.floor(x);
      const mapY = Math.floor(y);
      
      if (mapX < 0 || mapX >= level.width || mapY < 0 || mapY >= level.height) {
        break;
      }
      
      tiles[mapY][mapX].visible = true;
      tiles[mapY][mapX].explored = true;
      
      if (tiles[mapY][mapX].type === 'wall') {
        break;
      }
    }
  }
  
  return { ...level, tiles };
};