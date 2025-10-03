// Canvas rendering system

import type { GameState, Planet, Probe } from '../core/types';
import * as C from '../constants';

export class Renderer {
    private canvas: HTMLCanvasElement;
    private ctx: CanvasRenderingContext2D;
    private offsetX = 0;
    private offsetY = 0;
    private scale = 1;
    
    constructor(canvas: HTMLCanvasElement) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d')!;
        this.resize();
    }
    
    resize(): void {
        this.canvas.width = this.canvas.clientWidth;
        this.canvas.height = this.canvas.clientHeight;
    }
    
    render(state: GameState): void {
        this.clear();
        
        this.ctx.save();
        this.ctx.translate(this.offsetX, this.offsetY);
        this.ctx.scale(this.scale, this.scale);
        
        // Render probes (behind planets)
        this.renderProbes(state);
        
        // Render strikes
        this.renderStrikes(state);
        
        // Render planets
        this.renderPlanets(state);
        
        this.ctx.restore();
    }
    
    private clear(): void {
        this.ctx.fillStyle = '#000';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    }
    
    private renderPlanets(state: GameState): void {
        for (const planet of state.planets) {
            if (planet.destroyed) continue;
            
            this.renderPlanet(planet);
        }
    }
    
    private renderPlanet(planet: Planet): void {
        const { x, y } = this.worldToScreen(planet.pos);
        
        // Color based on visibility and ownership
        let color = C.COLOR_UNKNOWN;
        
        if (planet.owner === 'player') {
            color = C.COLOR_PLAYER_COLONY;
        } else if (planet.owner && planet.owner.startsWith('AI_')) {
            color = C.COLOR_AI_COLONY;
        } else if (planet.visibilityStage === 1) {
            color = C.COLOR_KNOWN;
        } else if (planet.visibilityStage === 2) {
            color = C.COLOR_SCANNED;
        } else if (planet.visibilityStage === 3) {
            color = C.COLOR_ANALYZED;
        }
        
        // Draw planet
        this.ctx.beginPath();
        const radius = planet.owner ? C.COLONY_RADIUS : C.PLANET_RADIUS;
        this.ctx.arc(x, y, radius, 0, Math.PI * 2);
        this.ctx.fillStyle = color;
        this.ctx.fill();
        
        // Add glow for colonies
        if (planet.owner) {
            this.ctx.strokeStyle = color;
            this.ctx.lineWidth = 1;
            this.ctx.stroke();
        }
    }
    
    private renderProbes(state: GameState): void {
        for (const probe of state.probes) {
            if (probe.state === 'done') continue;
            this.renderProbe(probe, state.tick);
        }
    }
    
    private renderProbe(probe: Probe, currentTick: number): void {
        const { x, y } = this.worldToScreen(probe.targetArea);
        const radius = probe.targetArea.r;
        
        const color = probe.mode === 'pulse' ? C.COLOR_PROBE_PULSE : C.COLOR_PROBE_DEEP;
        
        // Animated ring
        const progress = (currentTick - probe.startTime) / (probe.endTime - probe.startTime);
        const animRadius = radius * (0.5 + progress * 0.5);
        
        this.ctx.beginPath();
        this.ctx.arc(x, y, animRadius, 0, Math.PI * 2);
        this.ctx.strokeStyle = color;
        this.ctx.globalAlpha = C.PROBE_RING_ALPHA;
        this.ctx.lineWidth = 2;
        this.ctx.stroke();
        this.ctx.globalAlpha = 1;
    }
    
    private renderStrikes(state: GameState): void {
        for (const strike of state.strikes) {
            if (strike.resolved) continue;
            
            const planet = state.planets.find(p => p.id === strike.targetPlanetId);
            if (!planet) continue;
            
            // Simple blinking indicator
            if (Math.floor(state.tick / 2) % 2 === 0) {
                const { x, y } = this.worldToScreen(planet.pos);
                this.ctx.beginPath();
                this.ctx.arc(x, y, 8, 0, Math.PI * 2);
                this.ctx.strokeStyle = C.COLOR_STRIKE;
                this.ctx.lineWidth = 2;
                this.ctx.stroke();
            }
        }
    }
    
    private worldToScreen(pos: { x: number; y: number }): { x: number; y: number } {
        return {
            x: pos.x,
            y: pos.y
        };
    }
    
    screenToWorld(screenX: number, screenY: number): { x: number; y: number } {
        return {
            x: (screenX - this.offsetX) / this.scale,
            y: (screenY - this.offsetY) / this.scale
        };
    }
    
    centerOn(x: number, y: number): void {
        this.offsetX = this.canvas.width / 2 - x * this.scale;
        this.offsetY = this.canvas.height / 2 - y * this.scale;
    }
}
