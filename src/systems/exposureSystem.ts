// Exposure management system

import type { GameState } from '../core/types';
import * as C from '../constants';

export function updateExposure(state: GameState): void {
    const decayRate = C.EXPOSURE_DECAY_RATE * state.player.tech.exposureDecay;
    
    state.player.exposure = Math.max(
        state.player.exposureBase,
        state.player.exposure - decayRate
    );
}
