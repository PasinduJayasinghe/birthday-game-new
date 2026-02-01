// Game configuration for stages, bosses, and their projectiles

export interface StageConfig {
    id: number;
    name: string;
    bossName: string;
    bossImage: string;
    backgroundImage: string;
    projectileType: 'trophy' | 'resume' | 'fart' | 'boot';
    bossHealth: number;
    bossFireRate: number; // ms between shots
}

export const STAGES: StageConfig[] = [
    {
        id: 1,
        name: 'School Days',
        bossName: 'Dilushani Miss',
        bossImage: '/images/characters/dilushaniMiss.png',
        backgroundImage: '/images/backgrounds/dilushaniMissBackground.png',
        projectileType: 'resume',
        bossHealth: 50, // Reduced from 100 - easier to defeat
        bossFireRate: 2000, // Slower fire rate (was 1500)
    },
    {
        id: 2,
        name: 'College Life',
        bossName: 'Houloud',
        bossImage: '/images/characters/houloud.png',
        backgroundImage: '/images/backgrounds/houloudBackground.png',
        projectileType: 'fart',
        bossHealth: 70, // Reduced from 150
        bossFireRate: 1800, // Slower (was 1200)
    },
    {
        id: 3,
        name: 'Town Showdown',
        bossName: 'Pamporiya',
        bossImage: '/images/characters/pamporiya.png',
        backgroundImage: '/images/backgrounds/pamporiyaBackground.png',
        projectileType: 'boot',
        bossHealth: 90, // Reduced from 200
        bossFireRate: 1500, // Slower (was 1000)
    },
];

// Game constants
export const GAME_WIDTH = 900;
export const GAME_HEIGHT = 600;
export const PLAYER_SIZE = 64;
export const BOSS_SIZE = 80;
export const PROJECTILE_SIZE = 32;

export const PLAYER_SPEED = 0.4; // pixels per ms
export const PROJECTILE_SPEED = 0.3; // REDUCED from 0.5 - slower player projectiles
export const BOSS_PROJECTILE_SPEED = 0.2; // REDUCED from 0.35 - much slower boss projectiles

export const PLAYER_FIRE_RATE = 600; // FASTER fire rate (was 800) - Anjali shoots more often
export const PLAYER_MAX_HEALTH = 100;

export const TROPHY_DAMAGE = 15; // INCREASED from 10 - more damage per hit
export const BOSS_PROJECTILE_DAMAGE = 10; // REDUCED from 15 - less damage to player
