# 🎮 Dungeon Crawler Game

A roguelike dungeon crawler built with React and TypeScript, featuring procedurally generated levels, turn-based combat, and dynamic fog of war.

## ✨ Features

- 🗺️ **Procedurally Generated Dungeons**: Each level is unique with rooms, corridors, and doors
- 🎯 **Turn-based Combat**: Strategic encounters with enemies that scale with dungeon depth
- 🌫️ **Dynamic Fog of War**: Explore the dungeon gradually with realistic field of view
- 📦 **Inventory System**: Collect and manage items throughout your adventure
- 🗺️ **Interactive Minimap**: Track your exploration progress (toggle with 'M' key)
- 🚪 **Interactive Doors**: Open doors as you explore the dungeon
- 💪 **Progressive Difficulty**: Enemies become stronger as you descend deeper

## 🎮 Controls

- **Movement**: 
  - Arrow keys (↑←↓→)
  - WASD keys
  - On-screen buttons
- **Minimap**: Press 'M' to toggle
- **Combat**: Move into enemies to attack
- **Items**: Move over items to collect them
- **Doors**: Move into doors to open them

## 🎯 Game Elements

### Tiles
- ⬛ **Floor**: Basic walkable terrain
- 🟫 **Wall**: Impassable barrier
- 🚪 **Door**: Can be opened by walking into it

### Entities
- 🐀 **Player**: Your character (starts with 100 HP and 10 damage)
- 💀 **Enemies**: Various foes with scaling difficulty
- ⬇️ **Exit**: Find it to proceed to the next level
- 🧪 **Items**: Various collectibles:
  - Health Potion: Restores 20 HP
  - Strength Potion: Increases damage by 2
  - Shield: Increases max health by 10

## 🎲 Game Mechanics

### Combat
- Move into enemies to initiate combat
- Combat is turn-based: you attack first, then the enemy counters
- Defeat enemies to clear the path and potentially find items

### Exploration
- Start each level with limited visibility
- Explore to reveal the map and find the exit
- Use the minimap to track explored areas
- Discovered areas remain visible on the minimap

### Progression
- Each level increases in difficulty
- Enemies become stronger and more numerous
- Find items to increase your power
- Reach level 10 to win the game

## 🏆 Victory Conditions
- Find and reach the exit on level 10
- Maintain your health through combat
- Strategically use items and doors

## 💀 Game Over
- Your health reaches 0
- Can restart at any time with the "Start New Game" button

## 🎨 Visual Guide

### Minimap Colors
- 🔵 Blue: Player position
- ⚪ Gray: Explored floor
- 🟫 Brown: Walls
- 🟨 Yellow: Doors (dark when closed, light when open)
- 🔴 Red: Enemies
- 🟢 Green: Exit

## 🛠️ Technical Details

Built with:
- React
- TypeScript
- Tailwind CSS
- Lucide Icons

Features modern web development practices:
- Component-based architecture
- Strong typing with TypeScript
- Responsive design
- State management with React hooks

---

Happy dungeon crawling! 🎮✨ 