import React from 'react';
import { BOSS_SIZE } from '../config/gameConfig';

interface BossProps {
    y: number;
    image: string;
    name: string;
    health: number;
    maxHealth: number;
}

export function Boss({ y, image, name, health, maxHealth }: BossProps) {
    const healthPercent = (health / maxHealth) * 100;

    return (
        <div
            className="absolute"
            style={{
                right: '50px',
                top: `${y}px`,
                width: `${BOSS_SIZE}px`,
                height: `${BOSS_SIZE}px`,
            }}
        >
            {/* Boss sprite */}
            <img
                src={image}
                alt={name}
                className="w-full h-full object-contain"
                style={{
                    imageRendering: 'pixelated',
                    transform: 'scaleX(-1)', // Face left toward player
                }}
            />

            {/* Health bar */}
            <div className="absolute -top-4 left-0 w-full">
                <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                    <div
                        className="h-full bg-red-500 transition-all duration-200"
                        style={{ width: `${healthPercent}%` }}
                    />
                </div>
                <div className="text-white text-xs text-center mt-1 font-bold drop-shadow-lg">
                    {name}
                </div>
            </div>
        </div>
    );
}
