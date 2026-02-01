import React from 'react';
import { PLAYER_SIZE } from '../config/gameConfig';

interface PlayerProps {
    y: number;
    health: number;
    maxHealth: number;
}

export function Player({ y, health, maxHealth }: PlayerProps) {
    const healthPercent = (health / maxHealth) * 100;

    return (
        <div
            className="absolute"
            style={{
                left: '50px',
                top: `${y}px`,
                width: `${PLAYER_SIZE}px`,
                height: `${PLAYER_SIZE}px`,
            }}
        >
            <img
                src="/images/characters/anjali.png"
                alt="Anjali"
                className="w-full h-full object-contain"
                style={{ imageRendering: 'pixelated' }}
            />

            {/* Health bar */}
            <div className="absolute -top-4 left-0 w-full">
                <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                    <div
                        className="h-full bg-green-500 transition-all duration-200"
                        style={{ width: `${healthPercent}%` }}
                    />
                </div>
            </div>
        </div>
    );
}
