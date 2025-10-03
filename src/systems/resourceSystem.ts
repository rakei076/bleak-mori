// Resource production system

import type { GameState } from '../core/types';
import { getPlanetById } from '../state/gameState';
import * as C from '../constants';

export function produceResources(state: GameState): void {
    // Calculate production from all player colonies
    let energyProd = 0;
    let materialProd = 0;
    let computeProd = 0;
    
    for (const colonyId of state.player.colonies) {
        const planet = getPlanetById(state, colonyId);
        if (!planet || planet.destroyed) continue;
        
        // Base production + planet resources
        const efficiency = state.player.tech.resourceEfficiency;
        energyProd += (C.COLONY_BASE_ENERGY_PROD + planet.baseResources.energy) * efficiency;
        materialProd += (C.COLONY_BASE_MATERIAL_PROD + planet.baseResources.material) * efficiency;
        computeProd += (C.COLONY_BASE_COMPUTE_PROD + planet.baseResources.compute) * efficiency;
    }
    
    state.player.resources.energy += energyProd;
    state.player.resources.material += materialProd;
    state.player.resources.compute += computeProd;
}
