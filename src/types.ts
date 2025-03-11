export type Position = {
  x: number;
  y: number;
};

export type EntityType = 'player' | 'enemy' | 'item' | 'exit';

export type InventoryItem = {
  id: string;
  name: string;
  quantity: number;
};

export type Entity = {
  id: string;
  type: EntityType;
  position: Position;
  health?: number;
  damage?: number;
  name: string;
};

export type TileType = 'floor' | 'wall' | 'door';

export type Tile = {
  type: TileType;
  position: Position;
  visible: boolean;
  explored: boolean;
  isDoorOpen?: boolean;
};

export type Level = {
  width: number;
  height: number;
  tiles: Tile[][];
  entities: Entity[];
};

export type GameState = {
  level: Level;
  player: Entity;
  gameStatus: 'playing' | 'won' | 'lost';
  message: string;
  dungeonLevel: number;
  inventory: InventoryItem[];
};