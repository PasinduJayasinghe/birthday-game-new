import React from 'react';

export interface ProjectileData {
    id: number;
    x: number;
    y: number;
    type: 'trophy' | 'resume' | 'fart' | 'boot';
    direction: 'left' | 'right';
}

interface ProjectileProps {
    projectile: ProjectileData;
}

// Updated to match actual file names in public/images/weapons/
const PROJECTILE_IMAGES: Record<ProjectileData['type'], string> = {
    trophy: '/images/weapons/anjaliWeapon.png',
    resume: '/images/weapons/dilushaniMissWeapon.png',
    fart: '/images/weapons/houloudWeapon.png',
    boot: '/images/weapons/pamporiyaWeapon.png',
};

export function Projectile({ projectile }: ProjectileProps) {
    return (
        <div
            className="absolute w-8 h-8"
            style={{
                left: `${projectile.x}px`,
                top: `${projectile.y}px`,
                transform: projectile.direction === 'left' ? 'scaleX(-1)' : 'none',
            }}
        >
            <img
                src={PROJECTILE_IMAGES[projectile.type]}
                alt={projectile.type}
                className="w-full h-full object-contain"
                style={{ imageRendering: 'pixelated' }}
            />
        </div>
    );
}
