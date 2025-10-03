# Bleak Mori - Dark Forest Strategy Game

[English](README.md) | [中文](README.zh-CN.md)

A single-player web-based strategy game inspired by the Dark Forest trilogy. Survive in a hostile universe by managing resources, exploring space, and maintaining low exposure to avoid AI detection.

## 🎮 Game Overview

In this Dark Forest-style game, you must:
- **Explore** the star map using pulse and deep probes
- **Colonize** planets to increase resource production
- **Strike** enemy positions to eliminate threats
- **Survive** by keeping your exposure low to avoid AI detection

The core mechanic: **Stay hidden, or be destroyed.**

## 🚀 Features

### Core Systems
- ✅ **Star Map Generation**: 250+ randomly distributed planets with varied types
- ✅ **Intelligence System**: 4-stage planet visibility (Unknown → Known → Scanned → Analyzed)
- ✅ **Probe System**: 
  - **Pulse Probe**: Fast, short-range, low exposure
  - **Deep Probe**: Slow, long-range, high exposure
- ✅ **Resource Management**: Energy, Material, and Compute production
- ✅ **Exposure System**: Actions increase exposure, decays over time
- ✅ **Colonization**: Claim planets for resource production
- ✅ **Strike System**: Launch attacks with flight time and impact resolution
- ✅ **AI Opponents**: 2 AI players that detect and strike based on your exposure
- ✅ **Tech System**: Placeholder for future upgrades

### UI/Graphics
- ✅ **Canvas Rendering**: Star map with color-coded planets
  - Gray: Unknown planets
  - Light colors: Known/Scanned planets
  - Green: Player colonies
  - Red: AI colonies
- ✅ **Resource Panel**: Real-time display of resources and status
- ✅ **Action Buttons**: Quick access to probe launches
- ✅ **Event Log**: Track all game events
- ✅ **Planet Popup**: Click planets to view info and perform actions

## 🎯 How to Play

### Starting the Game
1. You begin with one colony that produces resources each tick (800ms)
2. Resources accumulate: Energy, Material, and Compute
3. Your exposure starts at 0 - keep it low!

### Actions

**Launch Probes**
- Click "Pulse Scan" (Cost: 10 Energy) - Small radius, 3 ticks, +5 exposure
- Click "Deep Scan" (Cost: 50 Energy) - Large radius, 8 ticks, +20 exposure
- Probes reveal planet information within their range

**Colonize Planets**
- Click on a scanned/analyzed neutral planet
- Cost: 50 Energy + 30 Material
- Increases production but raises base exposure

**Launch Strikes**
- Click on enemy planets (AI-owned or hostile)
- Cost: 80 Energy + 40 Material
- 10 tick flight time
- Adds +30 exposure (very risky!)

### Strategy Tips
1. **Manage Exposure**: High exposure attracts AI strikes
2. **Expand Carefully**: Each colony increases production but also exposure
3. **Scout Wisely**: Pulse scans are safer than deep scans
4. **Strike Sparingly**: Attacking creates massive exposure spikes

### Game Over
- Lose all colonies = Game Over
- AI strikes are based on your exposure level and their aggression

## 🛠️ Development

### Installation
```bash
npm install
```

### Run Development Server
```bash
npm run dev
```
Open http://localhost:5173

### Build for Production
```bash
npm run build
```

## 📁 Project Structure

```
src/
├── constants.ts          # All game constants and magic numbers
├── core/
│   └── types.ts         # TypeScript interfaces
├── state/
│   └── gameState.ts     # State initialization and management
├── systems/
│   ├── probeSystem.ts       # Probe launching and scanning
│   ├── resourceSystem.ts    # Resource production
│   ├── exposureSystem.ts    # Exposure decay
│   ├── colonizationSystem.ts # Planet colonization
│   ├── strikeSystem.ts      # Strike launching and resolution
│   └── aiSystem.ts          # AI decision making
├── render/
│   └── renderer.ts      # Canvas rendering
├── ui/
│   └── uiManager.ts     # UI panel management
├── i18n/
│   └── translations.ts  # Multi-language translations
└── main.ts              # Game loop and entry point
```

## 🎨 Game Constants

Key parameters (editable in `src/constants.ts`):

- **Tick Interval**: 800ms
- **Starting Resources**: 100 Energy, 50 Material, 20 Compute
- **Pulse Probe**: 10 energy, 150 range, 3 ticks, +5 exposure
- **Deep Probe**: 50 energy, 300 range, 8 ticks, +20 exposure
- **Colonization**: 50 energy + 30 material, +15 exposure
- **Strike**: 80 energy + 40 material, 10 tick flight, +30 exposure
- **Exposure Decay**: 0.5 per tick

## 🔧 Technology Stack

- **TypeScript** - Type-safe game logic
- **HTML5 Canvas** - Star map rendering
- **Vite** - Fast development and building
- **Native ES Modules** - No complex bundler configuration

## 📝 TODO / Future Enhancements

- [ ] Save/Load game state
- [ ] Tech tree implementation (efficiency upgrades)
- [ ] Map zoom and pan controls
- [ ] More planet types and special resources
- [ ] Victory conditions (survival time, colony count)
- [ ] Difficulty levels
- [ ] Better AI pathfinding and strategy
- [ ] Animation improvements (probe waves, strike trajectories)
- [ ] Sound effects (optional)

## 🎮 Screenshots

### Initial Game State
![Initial State](https://github.com/user-attachments/assets/21a31978-ba54-4d72-ba42-aa0b8128c31b)
*Starting the game with your initial green colony surrounded by unknown gray planets*

### After Pulse Scan
![After Scan](https://github.com/user-attachments/assets/65eb5649-b813-4eb7-b9d2-a9cab89c9ee1)
*After launching a pulse scan, nearby planets are revealed and the resource panel shows current status*

### Planet Interaction
![Planet Popup](https://github.com/user-attachments/assets/80ec08c5-ba5a-4d6a-9e03-29f388ffe8fc)
*Clicking on a planet opens a detailed popup with options to colonize or strike*

### Game Over
![Game Over](https://github.com/user-attachments/assets/acf1de9c-4606-4c2e-b8b6-6e4719960ab3)
*Game ends when all colonies are lost*

### Resource Management
*Colonizing multiple planets increases resource production, but watch your exposure level*

### Colony Expansion
*Successfully colonized planets turn green and provide continuous resource income*

### Strategic Strikes
*Launching strikes against hostile AI requires careful planning as it significantly increases exposure*

### Mid-Game State
*Managing multiple colonies, balancing resource production with exposure while defending against AI attacks*

## 📜 License

MIT

## 🙏 Acknowledgments

Inspired by "The Three-Body Problem" trilogy by Liu Cixin and the Dark Forest theory.

---

## 🌟 Game Mechanics Deep Dive

### Exposure Mechanics
Exposure is the core mechanic of the game:
- Each colony generates base exposure
- Launching probes increases exposure
- Launching strikes significantly increases exposure
- Exposure naturally decays each tick
- AI decides whether to attack based on your exposure level

### Intelligence & Exploration
The game uses a 4-tier intelligence system:
1. **Unknown**: Only shows planet position
2. **Known**: Shows basic information
3. **Scanned**: Shows resource production
4. **Analyzed**: Shows all detailed information

### Resource Balance
Three resource types each serve different purposes:
- **Energy**: Main cost for launching probes and strikes
- **Material**: Construction cost for colonization and strikes
- **Compute**: Reserved for future tech upgrades

### AI Behavior
AI opponents have the following characteristics:
- Detect players based on exposure
- Have different aggression levels
- Expand their own territory
- Attack high-exposure targets
