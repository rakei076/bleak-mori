// Probe system - launch and update probes

import type { GameState, Probe, ProbeMode, Position } from '../core/types';
import { generateId, addLogEntry, getPlanetById } from '../state/gameState';
import * as C from '../constants';

export function canLaunchProbe(state: GameState, mode: ProbeMode): boolean {
    const cost = mode === 'pulse' ? C.PULSE_PROBE_COST : C.DEEP_PROBE_COST;
    return state.player.resources.energy >= cost;
}

export function launchProbe(state: GameState, mode: ProbeMode, targetPos: Position): boolean {
    if (!canLaunchProbe(state, mode)) {
        return false;
    }
    
    const cost = mode === 'pulse' ? C.PULSE_PROBE_COST : C.DEEP_PROBE_COST;
    const range = mode === 'pulse' ? C.PULSE_PROBE_RANGE : C.DEEP_PROBE_RANGE;
    const duration = mode === 'pulse' ? C.PULSE_PROBE_DURATION : C.DEEP_PROBE_DURATION;
    const exposure = mode === 'pulse' ? C.PULSE_PROBE_EXPOSURE : C.DEEP_PROBE_EXPOSURE;
    
    state.player.resources.energy -= cost;
    
    const probe: Probe = {
        id: generateId(),
        mode,
        state: 'enRoute',
        startTime: state.tick,
        endTime: state.tick + duration,
        range,
        exposureDelta: exposure,
        targetArea: {
            x: targetPos.x,
            y: targetPos.y,
            r: range
        }
    };
    
    state.probes.push(probe);
    state.player.probes.push(probe.id);
    
    addLogEntry(state, `${mode.toUpperCase()} probe launched`, 'info');
    
    return true;
}

export function updateProbes(state: GameState): void {
    for (const probe of state.probes) {
        if (probe.state === 'done') continue;
        
        if (state.tick >= probe.endTime) {
            probe.state = 'done';
            
            // Update planet visibility in range
            const discovered = scanArea(state, probe);
            
            // Add exposure
            state.player.exposure += probe.exposureDelta;
            
            addLogEntry(
                state,
                `${probe.mode.toUpperCase()} scan complete. ${discovered} planets discovered. +${probe.exposureDelta} exposure`,
                'warning'
            );
        }
    }
    
    // Clean up old probes
    state.probes = state.probes.filter(p => {
        if (p.state === 'done' && state.tick > p.endTime + 10) {
            state.player.probes = state.player.probes.filter(id => id !== p.id);
            return false;
        }
        return true;
    });
}

function scanArea(state: GameState, probe: Probe): number {
    let count = 0;
    const area = probe.targetArea;
    
    for (const planet of state.planets) {
        const dx = planet.pos.x - area.x;
        const dy = planet.pos.y - area.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        
        if (dist <= area.r) {
            if (planet.visibilityStage < 3) {
                // Upgrade visibility
                if (probe.mode === 'pulse') {
                    planet.visibilityStage = Math.max(planet.visibilityStage, 1) as 0 | 1 | 2 | 3;
                } else {
                    planet.visibilityStage = Math.min(planet.visibilityStage + 2, 3) as 0 | 1 | 2 | 3;
                }
                count++;
            }
        }
    }
    
    return count;
}
