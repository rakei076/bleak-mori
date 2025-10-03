// State initialization and management

import type { GameState, Planet, Player, AI, Tech } from '../core/types';
import * as C from '../constants';

function generateId(): string {
    return Math.random().toString(36).substr(2, 9);
}

function randomPlanetType(): 'barren' | 'rocky' | 'gas' | 'oceanic' {
    const types = ['barren', 'rocky', 'gas', 'oceanic'] as const;
    return types[Math.floor(Math.random() * types.length)];
}

function generatePlanets(count: number): Planet[] {
    const planets: Planet[] = [];
    
    for (let i = 0; i < count; i++) {
        let pos = {
            x: Math.random() * C.MAP_WIDTH,
            y: Math.random() * C.MAP_HEIGHT
        };
        let attempts = 0;
        while (attempts < 100 && planets.some(p => {
            const dx = p.pos.x - pos.x;
            const dy = p.pos.y - pos.y;
            return Math.sqrt(dx * dx + dy * dy) < C.MIN_PLANET_DISTANCE;
        })) {
            pos = {
                x: Math.random() * C.MAP_WIDTH,
                y: Math.random() * C.MAP_HEIGHT
            };
            attempts++;
        }
        
        const type = randomPlanetType();
        const baseEnergy = Math.floor(Math.random() * 5) + 3;
        const baseMaterial = Math.floor(Math.random() * 3) + 2;
        
        planets.push({
            id: `planet_${i}`,
            pos,
            type,
            baseResources: {
                energy: baseEnergy,
                material: baseMaterial,
                compute: 1
            },
            lifeHint: Math.random() < 0.1,
            civLevel: Math.random() < 0.05 ? Math.floor(Math.random() * 4) : 0,
            visibilityStage: 0,
            owner: null,
            destroyed: false
        });
    }
    
    return planets;
}

function createDefaultTech(): Tech {
    return {
        probeEfficiency: 1.0,
        exposureDecay: 1.0,
        scanSpeed: 1.0,
        resourceEfficiency: 1.0
    };
}

function createPlayer(): Player {
    return {
        exposure: 0,
        exposureBase: 0,
        resources: {
            energy: C.STARTING_ENERGY,
            material: C.STARTING_MATERIAL,
            compute: C.STARTING_COMPUTE
        },
        colonies: [],
        probes: [],
        strikes: [],
        tech: createDefaultTech()
    };
}

function createAI(id: string, homePlanetId: string): AI {
    return {
        id,
        homePlanetId,
        aggression: C.AI_BASE_AGGRESSION + Math.floor(Math.random() * 40),
        detectionBias: Math.floor(Math.random() * 100),
        lastStrikeTime: 0,
        predictedPlayerSectors: [],
        tech: createDefaultTech(),
        knownColonies: []
    };
}

export function initializeGameState(): GameState {
    const planets = generatePlanets(C.PLANET_COUNT);
    const player = createPlayer();
    
    // Give player a starting colony
    const startPlanet = planets[Math.floor(Math.random() * 50)];
    startPlanet.owner = 'player';
    startPlanet.visibilityStage = 3;
    player.colonies.push(startPlanet.id);
    
    // Create AI players with their own starting planets
    const ais: AI[] = [];
    for (let i = 0; i < C.AI_COUNT; i++) {
        const aiPlanet = planets[Math.floor(Math.random() * planets.length)];
        if (!aiPlanet.owner) {
            const aiId = `AI_${i}`;
            aiPlanet.owner = aiId;
            ais.push(createAI(aiId, aiPlanet.id));
        }
    }
    
    return {
        planets,
        player,
        ais,
        probes: [],
        strikes: [],
        tick: 0,
        time: 0,
        log: [{
            tick: 0,
            message: 'Game started. Maintain low exposure to survive.',
            type: 'info'
        }]
    };
}

export function addLogEntry(state: GameState, message: string, type: 'info' | 'warning' | 'danger' = 'info'): void {
    state.log.push({
        tick: state.tick,
        message,
        type
    });
    if (state.log.length > 100) {
        state.log.shift();
    }
}

export function getPlanetById(state: GameState, id: string): Planet | undefined {
    return state.planets.find(p => p.id === id);
}

export function getProbeById(state: GameState, id: string) {
    return state.probes.find(p => p.id === id);
}

export function getStrikeById(state: GameState, id: string) {
    return state.strikes.find(s => s.id === id);
}

export { generateId };
