// Strike system - launch and resolve strikes

import type { GameState, Strike } from '../core/types';
import { generateId, addLogEntry, getPlanetById } from '../state/gameState';
import * as C from '../constants';

export function canLaunchStrike(state: GameState, targetPlanetId: string): boolean {
    const planet = getPlanetById(state, targetPlanetId);
    if (!planet || planet.destroyed) return false;
    if (planet.owner === 'player') return false;
    
    return state.player.resources.energy >= C.STRIKE_COST_ENERGY &&
           state.player.resources.material >= C.STRIKE_COST_MATERIAL;
}

export function launchStrike(state: GameState, targetPlanetId: string): boolean {
    if (!canLaunchStrike(state, targetPlanetId)) {
        return false;
    }
    
    state.player.resources.energy -= C.STRIKE_COST_ENERGY;
    state.player.resources.material -= C.STRIKE_COST_MATERIAL;
    
    const strike: Strike = {
        id: generateId(),
        targetPlanetId,
        launchTime: state.tick,
        impactTime: state.tick + C.STRIKE_FLIGHT_TIME,
        weaponType: 'basic',
        resolved: false
    };
    
    state.strikes.push(strike);
    state.player.strikes.push(strike.id);
    
    // Launching a strike increases exposure significantly
    state.player.exposure += C.STRIKE_EXPOSURE;
    
    addLogEntry(state, `Strike launched at ${targetPlanetId}. Impact in ${C.STRIKE_FLIGHT_TIME} ticks`, 'danger');
    
    return true;
}

export function updateStrikes(state: GameState): void {
    for (const strike of state.strikes) {
        if (strike.resolved) continue;
        
        if (state.tick >= strike.impactTime) {
            resolveStrike(state, strike);
        }
    }
    
    // Clean up old strikes
    state.strikes = state.strikes.filter(s => {
        if (s.resolved && state.tick > s.impactTime + 20) {
            state.player.strikes = state.player.strikes.filter(id => id !== s.id);
            return false;
        }
        return true;
    });
}

function resolveStrike(state: GameState, strike: Strike): void {
    const planet = getPlanetById(state, strike.targetPlanetId);
    
    if (!planet || planet.destroyed) {
        strike.resolved = true;
        strike.hit = false;
        addLogEntry(state, `Strike missed - target no longer exists`, 'info');
        return;
    }
    
    // Simple hit calculation - always hits for now
    strike.resolved = true;
    strike.hit = true;
    planet.destroyed = true;
    
    // Remove from owner's colonies if applicable
    if (planet.owner === 'player') {
        state.player.colonies = state.player.colonies.filter(id => id !== planet.id);
    } else if (planet.owner) {
        const ai = state.ais.find(a => a.id === planet.owner);
        if (ai) {
            // TODO: Track AI colonies
        }
    }
    
    addLogEntry(state, `Strike hit ${strike.targetPlanetId}! Planet destroyed`, 'danger');
}
