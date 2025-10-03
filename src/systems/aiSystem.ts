// AI decision system

import type { GameState, AI } from '../core/types';
import { addLogEntry, getPlanetById } from '../state/gameState';
import { launchStrike as aiLaunchStrike } from './strikeSystem';
import * as C from '../constants';

export function updateAI(state: GameState): void {
    // AI makes decisions every N ticks
    if (state.tick % C.AI_DECISION_INTERVAL !== 0) {
        return;
    }
    
    for (const ai of state.ais) {
        // Decide whether to strike player based on exposure
        considerStrikingPlayer(state, ai);
        
        // Randomly expand to nearby planets
        considerExpansion(state, ai);
    }
}

function considerStrikingPlayer(state: GameState, ai: AI): void {
    // Strike probability based on player exposure and AI aggression
    const exposureFactor = state.player.exposure / 100;
    const aggressionFactor = ai.aggression / 100;
    const timeSinceLastStrike = state.tick - ai.lastStrikeTime;
    
    // Cooldown period
    if (timeSinceLastStrike < 50) return;
    
    const strikeProbability = exposureFactor * aggressionFactor * 0.3;
    
    if (Math.random() < strikeProbability) {
        // Pick a random player colony to strike
        if (state.player.colonies.length > 0) {
            const targetId = state.player.colonies[Math.floor(Math.random() * state.player.colonies.length)];
            
            // AI strikes don't use the same resource system
            // Directly create a strike
            const strike = {
                id: `ai_strike_${state.tick}_${ai.id}`,
                targetPlanetId: targetId,
                launchTime: state.tick,
                impactTime: state.tick + C.STRIKE_FLIGHT_TIME,
                weaponType: 'ai_basic',
                resolved: false
            };
            
            state.strikes.push(strike);
            ai.lastStrikeTime = state.tick;
            
            addLogEntry(
                state,
                `WARNING: ${ai.id} launched strike! Impact in ${C.STRIKE_FLIGHT_TIME} ticks`,
                'danger'
            );
        }
    }
}

function considerExpansion(state: GameState, ai: AI): void {
    if (Math.random() > C.AI_EXPANSION_CHANCE) return;
    
    const aiHomePlanet = getPlanetById(state, ai.homePlanetId);
    if (!aiHomePlanet) return;
    
    // Find nearby unclaimed planets
    const nearbyPlanets = state.planets.filter(p => {
        if (p.owner !== null || p.destroyed) return false;
        
        const dx = p.pos.x - aiHomePlanet.pos.x;
        const dy = p.pos.y - aiHomePlanet.pos.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        
        return dist < 300;
    });
    
    if (nearbyPlanets.length > 0) {
        const target = nearbyPlanets[Math.floor(Math.random() * nearbyPlanets.length)];
        target.owner = ai.id;
        
        addLogEntry(state, `${ai.id} expanded to new planet`, 'info');
    }
}
