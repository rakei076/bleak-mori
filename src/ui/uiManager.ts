// UI management

import type { GameState, Planet } from '../core/types';

export class UIManager {
    private elements: {
        energy: HTMLElement;
        material: HTMLElement;
        compute: HTMLElement;
        exposure: HTMLElement;
        tick: HTMLElement;
        colonies: HTMLElement;
        log: HTMLElement;
        popup: HTMLElement;
        popupTitle: HTMLElement;
        popupContent: HTMLElement;
        popupColonize: HTMLButtonElement;
        popupStrike: HTMLButtonElement;
        popupClose: HTMLButtonElement;
    };
    
    private selectedPlanet: Planet | null = null;
    
    constructor() {
        this.elements = {
            energy: document.getElementById('energy')!,
            material: document.getElementById('material')!,
            compute: document.getElementById('compute')!,
            exposure: document.getElementById('exposure')!,
            tick: document.getElementById('tick')!,
            colonies: document.getElementById('colonies')!,
            log: document.getElementById('log')!,
            popup: document.getElementById('planet-popup')!,
            popupTitle: document.getElementById('popup-title')!,
            popupContent: document.getElementById('popup-content')!,
            popupColonize: document.getElementById('popup-colonize') as HTMLButtonElement,
            popupStrike: document.getElementById('popup-strike') as HTMLButtonElement,
            popupClose: document.getElementById('popup-close') as HTMLButtonElement
        };
        
        this.elements.popupClose.addEventListener('click', () => this.hidePopup());
    }
    
    update(state: GameState): void {
        // Update resources
        this.elements.energy.textContent = Math.floor(state.player.resources.energy).toString();
        this.elements.material.textContent = Math.floor(state.player.resources.material).toString();
        this.elements.compute.textContent = Math.floor(state.player.resources.compute).toString();
        
        // Update status
        this.elements.exposure.textContent = Math.floor(state.player.exposure).toString();
        this.elements.tick.textContent = state.tick.toString();
        this.elements.colonies.textContent = state.player.colonies.length.toString();
        
        // Update log
        this.updateLog(state);
    }
    
    private updateLog(state: GameState): void {
        const recentLogs = state.log.slice(-15);
        this.elements.log.innerHTML = recentLogs.map(entry => {
            const colorClass = entry.type === 'danger' ? 'color: #f00' : 
                               entry.type === 'warning' ? 'color: #ff0' : 
                               'color: #0f0';
            return `<div class="log-entry" style="${colorClass}">[${entry.tick}] ${entry.message}</div>`;
        }).join('');
        this.elements.log.scrollTop = this.elements.log.scrollHeight;
    }
    
    showPlanetPopup(planet: Planet, onColonize: () => void, onStrike: () => void): void {
        this.selectedPlanet = planet;
        
        this.elements.popupTitle.textContent = `Planet ${planet.id}`;
        
        const visStages = ['Unknown', 'Known', 'Scanned', 'Analyzed'];
        const info = [
            `Type: ${planet.type}`,
            `Visibility: ${visStages[planet.visibilityStage]}`,
            `Owner: ${planet.owner || 'None'}`,
            planet.destroyed ? 'DESTROYED' : ''
        ].filter(s => s).join('<br>');
        
        if (planet.visibilityStage >= 2) {
            const resources = `<br>Energy: ${planet.baseResources.energy}<br>Material: ${planet.baseResources.material}`;
            this.elements.popupContent.innerHTML = info + resources;
        } else {
            this.elements.popupContent.innerHTML = info;
        }
        
        // Button states
        this.elements.popupColonize.style.display = 
            (planet.owner === null && !planet.destroyed && planet.visibilityStage >= 2) ? 'block' : 'none';
        
        this.elements.popupStrike.style.display = 
            (planet.owner !== 'player' && !planet.destroyed) ? 'block' : 'none';
        
        // Set up event handlers
        this.elements.popupColonize.onclick = () => {
            onColonize();
            this.hidePopup();
        };
        
        this.elements.popupStrike.onclick = () => {
            onStrike();
            this.hidePopup();
        };
        
        this.elements.popup.style.display = 'block';
        this.elements.popup.style.left = '50%';
        this.elements.popup.style.top = '50%';
        this.elements.popup.style.transform = 'translate(-50%, -50%)';
    }
    
    hidePopup(): void {
        this.elements.popup.style.display = 'none';
        this.selectedPlanet = null;
    }
}
