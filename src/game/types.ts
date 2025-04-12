export type TimePeriod = 'prehistoric' | 'medieval' | 'future';

export interface Position {
    x: number;
    y: number;
}

export interface GameObject {
    position: Position;
    update: (deltaTime: number) => void;
    draw: (ctx: CanvasRenderingContext2D) => void;
}

export interface TimeCrystal extends GameObject {
    collected: boolean;
    timeEffect: TimeEffect;
}

export type TimeEffect = {
    type: 'slow' | 'speed' | 'reverse';
    duration: number;
    magnitude: number;
};

export interface Ghost extends GameObject {
    timePeriod: TimePeriod;
    speed: number;
    direction: Position;
    state: 'chase' | 'scatter' | 'frightened';
    uniqueAbility: () => void;
}

export interface Pacman extends GameObject {
    direction: Position;
    speed: number;
    mouthAngle: number;
    timePeriod: TimePeriod;
    timeEffects: TimeEffect[];
    score: number;
}

export interface Background {
    color: string;
    gradient?: {
        start: string;
        end: string;
        angle: number;
    };
    pattern?: string; // Optional pattern overlay, e.g., 'dots', 'stripes'
}

export interface GameState {
    currentPeriod: TimePeriod;
    score: number;
    lives: number;
    timeCrystals: TimeCrystal[];
    ghosts: Ghost[];
    pacman: Pacman;
    isGameOver: boolean;
    isPaused: boolean;
    background: Background;
}