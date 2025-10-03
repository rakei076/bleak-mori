// Core type definitions

export type PlanetType = 'barren' | 'rocky' | 'gas' | 'oceanic';
export type VisibilityStage = 0 | 1 | 2 | 3; // unknown, known, scanned, analyzed
export type Owner = null | 'player' | string; // null, 'player', or 'AI_0', 'AI_1', etc.
export type ProbeMode = 'pulse' | 'deep';
export type ProbeState = 'enRoute' | 'scanning' | 'done';

export interface Position {
    x: number;
    y: number;
}

export interface Resources {
    energy: number;
    material: number;
    compute: number;
}

export interface Planet {
    id: string;
    pos: Position;
    type: PlanetType;
    baseResources: Resources;
    lifeHint: boolean;
    civLevel: number; // 0-3
    visibilityStage: VisibilityStage;
    owner: Owner;
    destroyed?: boolean;
}

export interface TargetArea {
    x: number;
    y: number;
    r: number;
}

export interface Probe {
    id: string;
    mode: ProbeMode;
    state: ProbeState;
    startTime: number;
    endTime: number;
    range: number;
    exposureDelta: number;
    targetArea: TargetArea;
}

export interface Strike {
    id: string;
    targetPlanetId: string;
    launchTime: number;
    impactTime: number;
    weaponType: string;
    resolved: boolean;
    hit?: boolean;
}

export interface Tech {
    probeEfficiency: number;
    exposureDecay: number;
    scanSpeed: number;
    resourceEfficiency: number;
}

export interface Player {
    exposure: number;
    exposureBase: number;
    resources: Resources;
    colonies: string[]; // planet ids
    probes: string[]; // probe ids
    strikes: string[]; // strike ids
    tech: Tech;
}

export interface PredictedSector {
    sectorId: string;
    prob: number;
}

export interface AI {
    id: string;
    homePlanetId: string;
    aggression: number; // 0-100
    detectionBias: number; // 0-100
    lastStrikeTime: number;
    predictedPlayerSectors: PredictedSector[];
    tech: Tech;
    knownColonies: string[]; // planet ids
}

export interface LogEntry {
    tick: number;
    message: string;
    type: 'info' | 'warning' | 'danger';
}

export interface GameState {
    planets: Planet[];
    player: Player;
    ais: AI[];
    probes: Probe[];
    strikes: Strike[];
    tick: number;
    time: number;
    log: LogEntry[];
}
