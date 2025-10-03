// UI management

import type { GameState, Planet } from '../core/types';
import { i18n } from '../i18n/translations';

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
        
        // Language toggle
        const langToggle = document.getElementById('lang-toggle');
        if (langToggle) {
            langToggle.addEventListener('click', () => {
                const currentLang = i18n.getLanguage();
                i18n.setLanguage(currentLang === 'en' ? 'zh' : 'en');
            });
        }
        
        // Listen for language changes
        window.addEventListener('languageChanged', () => {
            this.updateUILabels();
        });
        
        // Initial labels
        this.updateUILabels();
    }
    
    private updateUILabels(): void {
        // Update section headers
        const headers = document.querySelectorAll('.panel-section h3');
        if (headers[0]) headers[0].textContent = i18n.t('resources');
        if (headers[1]) headers[1].textContent = i18n.t('status');
        if (headers[2]) headers[2].textContent = i18n.t('actions');
        if (headers[3]) headers[3].textContent = i18n.t('eventLog');
        
        // Update resource labels
        const resourceLabels = document.querySelectorAll('.resource-item span:first-child');
        if (resourceLabels[0]) resourceLabels[0].textContent = i18n.t('energy') + ':';
        if (resourceLabels[1]) resourceLabels[1].textContent = i18n.t('material') + ':';
        if (resourceLabels[2]) resourceLabels[2].textContent = i18n.t('compute') + ':';
        if (resourceLabels[3]) resourceLabels[3].textContent = i18n.t('exposure') + ':';
        if (resourceLabels[4]) resourceLabels[4].textContent = i18n.t('tick') + ':';
        if (resourceLabels[5]) resourceLabels[5].textContent = i18n.t('colonies') + ':';
        
        // Update buttons
        const pulseBtn = document.getElementById('btn-pulse');
        const deepBtn = document.getElementById('btn-deep');
        if (pulseBtn) pulseBtn.textContent = i18n.t('pulseScan');
        if (deepBtn) deepBtn.textContent = i18n.t('deepScan');
        
        this.elements.popupColonize.textContent = i18n.t('colonize');
        this.elements.popupStrike.textContent = i18n.t('strike');
        this.elements.popupClose.textContent = i18n.t('close');
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
        
        this.elements.popupTitle.textContent = `${i18n.t('planet')} ${planet.id}`;
        
        const visStages = [i18n.t('unknown'), i18n.t('known'), i18n.t('scanned'), i18n.t('analyzed')];
        const planetTypes: Record<string, string> = {
            'barren': i18n.t('barren'),
            'rocky': i18n.t('rocky'),
            'gas': i18n.t('gas'),
            'oceanic': i18n.t('oceanic')
        };
        
        const info = [
            `${i18n.t('type')}: ${planetTypes[planet.type] || planet.type}`,
            `${i18n.t('visibility')}: ${visStages[planet.visibilityStage]}`,
            `${i18n.t('owner')}: ${planet.owner || i18n.t('none')}`,
            planet.destroyed ? i18n.t('destroyed') : ''
        ].filter(s => s).join('<br>');
        
        if (planet.visibilityStage >= 2) {
            const resources = `<br>${i18n.t('energy')}: ${planet.baseResources.energy}<br>${i18n.t('material')}: ${planet.baseResources.material}`;
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
