import { SingularityGridNode } from '../types';

export const SINGULARITY_GRID_NODES: SingularityGridNode[] = [
    // Starting Node
    { id: 'sg_start', nameKey: 'sg.start.name', descriptionKey: 'sg.start.desc', cost: 0, position: { x: 50, y: 90 }, prerequisites: [], effect: { type: 'PERMANENT_SPS_MULTIPLIER', value: 1.0 } },

    // SPS Branch (Left)
    { id: 'sg_sps_1', nameKey: 'sg.sps_1.name', descriptionKey: 'sg.sps_1.desc', cost: 1, position: { x: 35, y: 75 }, prerequisites: ['sg_start'], effect: { type: 'PERMANENT_SPS_MULTIPLIER', value: 1.5 } },
    { id: 'sg_sps_2', nameKey: 'sg.sps_2.name', descriptionKey: 'sg.sps_2.desc', cost: 2, position: { x: 20, y: 65 }, prerequisites: ['sg_sps_1'], effect: { type: 'PERMANENT_SPS_MULTIPLIER', value: 2.0 } },
    { id: 'sg_sps_3', nameKey: 'sg.sps_3.name', descriptionKey: 'sg.sps_3.desc', cost: 5, position: { x: 25, y: 45 }, prerequisites: ['sg_sps_2'], effect: { type: 'PERMANENT_SPS_MULTIPLIER', value: 3.0 } },
    
    // Click Branch (Right)
    { id: 'sg_click_1', nameKey: 'sg.click_1.name', descriptionKey: 'sg.click_1.desc', cost: 1, position: { x: 65, y: 75 }, prerequisites: ['sg_start'], effect: { type: 'PERMANENT_CLICK_MULTIPLIER', value: 1.5 } },
    { id: 'sg_click_2', nameKey: 'sg.click_2.name', descriptionKey: 'sg.click_2.desc', cost: 2, position: { x: 80, y: 65 }, prerequisites: ['sg_click_1'], effect: { type: 'PERMANENT_CLICK_MULTIPLIER', value: 2.0 } },
    { id: 'sg_click_3', nameKey: 'sg.click_3.name', descriptionKey: 'sg.click_3.desc', cost: 5, position: { x: 75, y: 45 }, prerequisites: ['sg_click_2'], effect: { type: 'PERMANENT_CLICK_MULTIPLIER', value: 3.0 } },
    
    // Utility Branch (Center)
    { id: 'sg_utility_1', nameKey: 'sg.utility_1.name', descriptionKey: 'sg.utility_1.desc', cost: 3, position: { x: 50, y: 60 }, prerequisites: ['sg_sps_1', 'sg_click_1'], effect: { type: 'FREE_GENERATOR_LEVELS', value: 5 } },
    { id: 'sg_utility_2', nameKey: 'sg.utility_2.name', descriptionKey: 'sg.utility_2.desc', cost: 8, position: { x: 50, y: 30 }, prerequisites: ['sg_utility_1', 'sg_sps_3', 'sg_click_3'], effect: { type: 'SHARDLING_CRIT_LINK', value: 0.5 } },
];
