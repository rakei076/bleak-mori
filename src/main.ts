// Main game entry point

import { GameState } from './core/types';
import { initializeGameState, addLogEntry, getPlanetById } from './state/gameState';
import { updateProbes, launchProbe, canLaunchProbe } from './systems/probeSystem';
import { produceResources } from './systems/resourceSystem';
import { updateExposure } from './systems/exposureSystem';
import { colonizePlanet, canColonize } from './systems/colonizationSystem';
import { updateStrikes, launchStrike, canLaunchStrike } from './systems/strikeSystem';
import { updateAI } from './systems/aiSystem';
import { Renderer } from './render/renderer';
import { UIManager } from './ui/uiManager';
import * as C from './constants';

class Game {
    private state: GameState;
    private renderer: Renderer;
    private ui: UIManager;
    private running = false;
    private lastTickTime = 0;
    
    constructor() {
        this.state = initializeGameState();
        
        const canvas = document.getElementById('gameCanvas') as HTMLCanvasElement;
        this.renderer = new Renderer(canvas);
        this.ui = new UIManager();
        
        this.setupEventListeners();
        this.centerOnPlayerColony();
    }
    
    private setupEventListeners(): void {
        // Canvas click
        const canvas = document.getElementById('gameCanvas') as HTMLCanvasElement;
        canvas.addEventListener('click', (e) => this.handleCanvasClick(e));
        
        // Action buttons
        document.getElementById('btn-pulse')?.addEventListener('click', () => {
            this.launchProbeAtCenter('pulse');
        });
        
        document.getElementById('btn-deep')?.addEventListener('click', () => {
            this.launchProbeAtCenter('deep');
        });
        
        // Window resize
        window.addEventListener('resize', () => this.renderer.resize());
    }
    
    private handleCanvasClick(e: MouseEvent): void {
        const canvas = e.target as HTMLCanvasElement;
        const rect = canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const worldPos = this.renderer.screenToWorld(x, y);
        
        // Find clicked planet
        const clickedPlanet = this.state.planets.find(p => {
            if (p.destroyed) return false;
            const dx = p.pos.x - worldPos.x;
            const dy = p.pos.y - worldPos.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            return dist < (p.owner ? C.COLONY_RADIUS * 2 : C.PLANET_RADIUS * 2);
        });
        
        if (clickedPlanet) {
            this.showPlanetActions(clickedPlanet);
        }
    }
    
    private showPlanetActions(planet: any): void {
        this.ui.showPlanetPopup(
            planet,
            () => this.tryColonize(planet.id),
            () => this.tryStrike(planet.id)
        );
    }
    
    private tryColonize(planetId: string): void {
        if (colonizePlanet(this.state, planetId)) {
            addLogEntry(this.state, `Colonization successful!`, 'info');
        } else {
            addLogEntry(this.state, `Cannot colonize: insufficient resources or planet unavailable`, 'warning');
        }
    }
    
    private tryStrike(planetId: string): void {
        if (launchStrike(this.state, planetId)) {
            addLogEntry(this.state, `Strike launched!`, 'danger');
        } else {
            addLogEntry(this.state, `Cannot launch strike: insufficient resources`, 'warning');
        }
    }
    
    private launchProbeAtCenter(mode: 'pulse' | 'deep'): void {
        // Launch probe at map center for simplicity
        const centerX = C.MAP_WIDTH / 2;
        const centerY = C.MAP_HEIGHT / 2;
        
        if (launchProbe(this.state, mode, { x: centerX, y: centerY })) {
            addLogEntry(this.state, `${mode} probe launched at center`, 'info');
        } else {
            addLogEntry(this.state, `Cannot launch probe: insufficient energy`, 'warning');
        }
    }
    
    private centerOnPlayerColony(): void {
        if (this.state.player.colonies.length > 0) {
            const colony = getPlanetById(this.state, this.state.player.colonies[0]);
            if (colony) {
                this.renderer.centerOn(colony.pos.x, colony.pos.y);
            }
        } else {
            this.renderer.centerOn(C.MAP_WIDTH / 2, C.MAP_HEIGHT / 2);
        }
    }
    
    start(): void {
        this.running = true;
        this.lastTickTime = Date.now();
        this.gameLoop();
    }
    
    private gameLoop = (): void => {
        if (!this.running) return;
        
        const now = Date.now();
        if (now - this.lastTickTime >= C.TICK_INTERVAL) {
            this.tick();
            this.lastTickTime = now;
        }
        
        this.render();
        requestAnimationFrame(this.gameLoop);
    };
    
    private tick(): void {
        this.state.tick++;
        this.state.time += C.TICK_INTERVAL;
        
        // Update all systems in order
        updateProbes(this.state);
        updateStrikes(this.state);
        produceResources(this.state);
        updateExposure(this.state);
        updateAI(this.state);
        
        // Check game over conditions
        this.checkGameState();
    }
    
    private checkGameState(): void {
        // Game over if player has no colonies
        if (this.state.player.colonies.length === 0) {
            this.running = false;
            addLogEntry(this.state, 'GAME OVER: All colonies lost!', 'danger');
            alert('Game Over! All your colonies have been destroyed.');
        }
    }
    
    private render(): void {
        this.renderer.render(this.state);
        this.ui.update(this.state);
    }
}

// Start game when DOM is loaded
window.addEventListener('DOMContentLoaded', () => {
    const game = new Game();
    game.start();
});
