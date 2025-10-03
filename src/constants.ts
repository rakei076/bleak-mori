// Game constants - all magic numbers centralized here

// Map generation
export const PLANET_COUNT = 250;
export const MAP_WIDTH = 2000;
export const MAP_HEIGHT = 2000;
export const MIN_PLANET_DISTANCE = 50;

// Game loop
export const TICK_INTERVAL = 800; // ms

// Resources
export const STARTING_ENERGY = 100;
export const STARTING_MATERIAL = 50;
export const STARTING_COMPUTE = 20;

// Probe costs and parameters
export const PULSE_PROBE_COST = 10;
export const PULSE_PROBE_RANGE = 150;
export const PULSE_PROBE_DURATION = 3; // ticks
export const PULSE_PROBE_EXPOSURE = 5;

export const DEEP_PROBE_COST = 50;
export const DEEP_PROBE_RANGE = 300;
export const DEEP_PROBE_DURATION = 8; // ticks
export const DEEP_PROBE_EXPOSURE = 20;

// Exposure
export const EXPOSURE_DECAY_RATE = 0.5; // per tick
export const COLONIZE_EXPOSURE = 15;
export const STRIKE_EXPOSURE = 30;

// Colonization
export const COLONIZE_COST_ENERGY = 50;
export const COLONIZE_COST_MATERIAL = 30;
export const COLONY_BASE_ENERGY_PROD = 5;
export const COLONY_BASE_MATERIAL_PROD = 3;
export const COLONY_BASE_COMPUTE_PROD = 1;

// Strike
export const STRIKE_COST_ENERGY = 80;
export const STRIKE_COST_MATERIAL = 40;
export const STRIKE_FLIGHT_TIME = 10; // ticks

// AI
export const AI_COUNT = 2;
export const AI_DECISION_INTERVAL = 20; // ticks
export const AI_BASE_AGGRESSION = 30;
export const AI_EXPANSION_CHANCE = 0.1; // per decision cycle

// Tech (placeholder values)
export const TECH_PROBE_EFFICIENCY_BOOST = 0.1;
export const TECH_EXPOSURE_DECAY_BOOST = 0.2;
export const TECH_SCAN_SPEED_BOOST = 0.15;
export const TECH_RESOURCE_EFFICIENCY_BOOST = 0.1;

// Rendering
export const PLANET_RADIUS = 3;
export const COLONY_RADIUS = 5;
export const PROBE_RING_ALPHA = 0.3;

// Colors
export const COLOR_UNKNOWN = '#444';
export const COLOR_KNOWN = '#888';
export const COLOR_SCANNED = '#aaa';
export const COLOR_ANALYZED = '#ccc';
export const COLOR_PLAYER_COLONY = '#0f0';
export const COLOR_AI_COLONY = '#f00';
export const COLOR_PROBE_PULSE = '#0ff';
export const COLOR_PROBE_DEEP = '#ff0';
export const COLOR_STRIKE = '#f0f';
