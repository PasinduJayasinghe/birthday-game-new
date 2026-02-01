// Utility functions for game mechanics

import { ProjectileData } from '../components/Projectile';
import { PROJECTILE_SIZE, PLAYER_SIZE, BOSS_SIZE, GAME_WIDTH } from './gameConfig';

/**
 * AABB (Axis-Aligned Bounding Box) collision detection
 * Checks if two rectangles overlap
 */
export function checkCollision(
    rect1: { x: number; y: number; width: number; height: number },
    rect2: { x: number; y: number; width: number; height: number }
): boolean {
    return (
        rect1.x < rect2.x + rect2.width &&
        rect1.x + rect1.width > rect2.x &&
        rect1.y < rect2.y + rect2.height &&
        rect1.y + rect1.height > rect2.y
    );
}

/**
 * Check if a projectile hits the player
 */
export function checkPlayerHit(
    projectile: ProjectileData,
    playerY: number
): boolean {
    if (projectile.direction !== 'left') return false;

    const playerRect = {
        x: 50,
        y: playerY,
        width: PLAYER_SIZE,
        height: PLAYER_SIZE,
    };

    const projectileRect = {
        x: projectile.x,
        y: projectile.y,
        width: PROJECTILE_SIZE,
        height: PROJECTILE_SIZE,
    };

    return checkCollision(playerRect, projectileRect);
}

/**
 * Check if a projectile hits the boss
 */
export function checkBossHit(
    projectile: ProjectileData,
    bossY: number
): boolean {
    if (projectile.direction !== 'right') return false;

    const bossRect = {
        x: GAME_WIDTH - 50 - BOSS_SIZE,
        y: bossY,
        width: BOSS_SIZE,
        height: BOSS_SIZE,
    };

    const projectileRect = {
        x: projectile.x,
        y: projectile.y,
        width: PROJECTILE_SIZE,
        height: PROJECTILE_SIZE,
    };

    return checkCollision(bossRect, projectileRect);
}
