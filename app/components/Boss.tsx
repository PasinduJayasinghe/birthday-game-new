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
            <div className="absolute -top-10 left-1/2 -translate-x-1/2 w-[140%]">
                <div className="bg-black/80 text-yellow-400 text-sm py-1 px-2 rounded-lg border-2 border-red-500 font-bold text-center uppercase shadow-[0_0_10px_rgba(239,68,68,0.6)] whitespace-nowrap">
                    {name}
                </div>
                {/* Connecting line to health bar */}
                <div className="w-0.5 h-2 bg-red-500 mx-auto"></div>

                <div className="h-3 bg-gray-800 rounded-full overflow-hidden border border-gray-600">
                    <div
                        className="h-full bg-gradient-to-r from-red-600 to-red-400 transition-all duration-200"
                        style={{ width: `${healthPercent}%` }}
                    />
                </div>
            </div>
        </div>
    );
}
