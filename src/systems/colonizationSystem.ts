// Colonization system

import type { GameState, Planet } from '../core/types';
import { addLogEntry, getPlanetById } from '../state/gameState';
import * as C from '../constants';

export function canColonize(state: GameState, planet: Planet): boolean {
    if (planet.owner !== null) return false;
    if (planet.destroyed) return false;
    if (planet.visibilityStage < 2) return false;
    
    return state.player.resources.energy >= C.COLONIZE_COST_ENERGY &&
           state.player.resources.material >= C.COLONIZE_COST_MATERIAL;
}

export function colonizePlanet(state: GameState, planetId: string): boolean {
    const planet = getPlanetById(state, planetId);
    if (!planet || !canColonize(state, planet)) {
        return false;
    }
    
    state.player.resources.energy -= C.COLONIZE_COST_ENERGY;
    state.player.resources.material -= C.COLONIZE_COST_MATERIAL;
    
    planet.owner = 'player';
    planet.visibilityStage = 3;
    state.player.colonies.push(planetId);
    
    // Colonization increases base exposure
    state.player.exposureBase += 1;
    state.player.exposure += C.COLONIZE_EXPOSURE;
    
    addLogEntry(state, `Planet ${planetId} colonized. +${C.COLONIZE_EXPOSURE} exposure`, 'warning');
    
    return true;
}
