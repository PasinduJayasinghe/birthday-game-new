'use client';

import React, { useState, useCallback, useRef } from 'react';
import { useGameLoop } from '../hooks/useGameLoop';
import { useKeyboard } from '../hooks/useKeyboard';
import { Player } from './Player';
import { Boss } from './Boss';
import { Projectile, ProjectileData } from './Projectile';
import {
    STAGES,
    GAME_WIDTH,
    GAME_HEIGHT,
    PLAYER_SIZE,
    BOSS_SIZE,
    PROJECTILE_SIZE,
    PLAYER_SPEED,
    PROJECTILE_SPEED,
    BOSS_PROJECTILE_SPEED,
    PLAYER_FIRE_RATE,
    PLAYER_MAX_HEALTH,
    TROPHY_DAMAGE,
    BOSS_PROJECTILE_DAMAGE,
} from '../config/gameConfig';
import { checkPlayerHit, checkBossHit } from '../config/gameUtils';

// Boss movement configuration
const BOSS_MOVE_SPEED = 0.15;

export function GameArena() {
    // Game state
    const [currentStage, setCurrentStage] = useState(0);
    const [playerY, setPlayerY] = useState(GAME_HEIGHT / 2 - PLAYER_SIZE / 2);
    const [playerHealth, setPlayerHealth] = useState(PLAYER_MAX_HEALTH);
    const [bossY, setBossY] = useState(GAME_HEIGHT / 2 - BOSS_SIZE / 2);
    const [bossHealth, setBossHealth] = useState(STAGES[0].bossHealth);
    const [projectiles, setProjectiles] = useState<ProjectileData[]>([]);
    const [gameWon, setGameWon] = useState(false);
    const [gameOver, setGameOver] = useState(false);
    const [showVideo, setShowVideo] = useState(false);
    const [touchUp, setTouchUp] = useState(false);
    const [touchDown, setTouchDown] = useState(false);

    // Refs for game loop
    const bossDirRef = useRef(1);
    const keys = useKeyboard();
    const lastPlayerFireRef = useRef(0);
    const lastBossFireRef = useRef(0);
    const projectileIdRef = useRef(0);
    const playerYRef = useRef(playerY);
    const bossYRef = useRef(bossY);

    const stage = STAGES[currentStage];

    // Keep refs in sync
    playerYRef.current = playerY;
    bossYRef.current = bossY;

    const gameUpdate = useCallback(
        (deltaTime: number) => {
            if (gameOver || gameWon) return;

            const currentTime = performance.now();

            // Update player position
            setPlayerY((prevY) => {
                let newY = prevY;

                if (keys.up || touchUp) {
                    newY -= PLAYER_SPEED * deltaTime;
                }
                if (keys.down || touchDown) {
                    newY += PLAYER_SPEED * deltaTime;
                }

                newY = Math.max(0, Math.min(GAME_HEIGHT - PLAYER_SIZE, newY));
                playerYRef.current = newY;
                return newY;
            });

            // Update boss position
            setBossY((prevY) => {
                let newY = prevY + bossDirRef.current * BOSS_MOVE_SPEED * deltaTime;

                if (newY <= 20) {
                    newY = 20;
                    bossDirRef.current = 1;
                } else if (newY >= GAME_HEIGHT - BOSS_SIZE - 20) {
                    newY = GAME_HEIGHT - BOSS_SIZE - 20;
                    bossDirRef.current = -1;
                }

                bossYRef.current = newY;
                return newY;
            });

            // Player auto-fire
            if (currentTime - lastPlayerFireRef.current >= PLAYER_FIRE_RATE) {
                lastPlayerFireRef.current = currentTime;

                const newProjectile: ProjectileData = {
                    id: projectileIdRef.current++,
                    x: 50 + PLAYER_SIZE,
                    y: playerYRef.current + PLAYER_SIZE / 2 - PROJECTILE_SIZE / 2,
                    type: 'trophy',
                    direction: 'right',
                };

                setProjectiles((prev) => [...prev, newProjectile]);
            }

            // Boss auto-fire
            if (currentTime - lastBossFireRef.current >= stage.bossFireRate) {
                lastBossFireRef.current = currentTime;

                const newProjectile: ProjectileData = {
                    id: projectileIdRef.current++,
                    x: GAME_WIDTH - 50 - BOSS_SIZE,
                    y: bossYRef.current + BOSS_SIZE / 2 - PROJECTILE_SIZE / 2,
                    type: stage.projectileType,
                    direction: 'left',
                };

                setProjectiles((prev) => [...prev, newProjectile]);
            }

            // Update projectiles and check collisions
            setProjectiles((prevProjectiles) => {
                const projectilesToRemove = new Set<number>();

                // Check each projectile for collisions
                prevProjectiles.forEach((p) => {
                    // Check if boss projectile hits player
                    if (checkPlayerHit(p, playerYRef.current)) {
                        projectilesToRemove.add(p.id);
                        setPlayerHealth((prev) => {
                            const newHealth = prev - BOSS_PROJECTILE_DAMAGE;
                            if (newHealth <= 0) {
                                setGameOver(true);
                            }
                            return Math.max(0, newHealth);
                        });
                    }

                    // Check if player projectile hits boss
                    if (checkBossHit(p, bossYRef.current)) {
                        projectilesToRemove.add(p.id);
                        setBossHealth((prev) => {
                            if (prev <= 0) return 0; // Prevent double-death trigger

                            const newHealth = prev - TROPHY_DAMAGE;
                            if (newHealth <= 0) {
                                // Boss defeated - advance to next stage
                                if (currentStage < STAGES.length - 1) {
                                    setCurrentStage((s) => s + 1);
                                    setBossHealth(STAGES[currentStage + 1].bossHealth);
                                    setBossY(GAME_HEIGHT / 2 - BOSS_SIZE / 2);
                                    setProjectiles([]);
                                } else {
                                    // Final boss defeated - you win!
                                    setGameWon(true);
                                }
                            }
                            return Math.max(0, newHealth);
                        });
                    }
                });

                // Move and filter projectiles
                return prevProjectiles
                    .filter((p) => !projectilesToRemove.has(p.id))
                    .map((p) => ({
                        ...p,
                        x: p.direction === 'right'
                            ? p.x + PROJECTILE_SPEED * deltaTime
                            : p.x - BOSS_PROJECTILE_SPEED * deltaTime,
                    }))
                    .filter((p) => p.x > -PROJECTILE_SIZE && p.x < GAME_WIDTH + PROJECTILE_SIZE);
            });
        },
        [keys, touchUp, touchDown, stage.bossFireRate, stage.projectileType, gameOver, gameWon, currentStage]
    );

    useGameLoop(gameUpdate);

    const handleStartVideo = () => {
        setShowVideo(true);
    };

    // Restart game handler
    const handleRestart = () => {
        setCurrentStage(0);
        setPlayerY(GAME_HEIGHT / 2 - PLAYER_SIZE / 2);
        setPlayerHealth(PLAYER_MAX_HEALTH);
        setBossY(GAME_HEIGHT / 2 - BOSS_SIZE / 2);
        setBossHealth(STAGES[0].bossHealth);
        setProjectiles([]);
        setGameOver(false);
        setGameWon(false);
        setShowVideo(false);
        lastPlayerFireRef.current = 0;
        lastBossFireRef.current = 0;
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-900">
            <div
                className="relative border-4 border-yellow-500 overflow-hidden"
                style={{
                    width: `${GAME_WIDTH}px`,
                    height: `${GAME_HEIGHT}px`,
                    maxWidth: '100vw',
                    maxHeight: '100vh',
                }}
            >
                {/* Background */}
                <img
                    src={stage.backgroundImage}
                    alt={stage.name}
                    className="absolute inset-0 w-full h-full object-cover"
                    style={{ imageRendering: 'pixelated' }}
                />

                {/* Dark overlay */}
                <div className="absolute inset-0 bg-black/30" />

                {/* Player */}
                <Player
                    y={playerY}
                    health={playerHealth}
                    maxHealth={PLAYER_MAX_HEALTH}
                />

                {/* Boss */}
                {!gameWon && (
                    <Boss
                        y={bossY}
                        image={stage.bossImage}
                        name={stage.bossName}
                        health={bossHealth}
                        maxHealth={stage.bossHealth}
                    />
                )}

                {/* Projectiles */}
                {projectiles.map((projectile) => (
                    <Projectile key={projectile.id} projectile={projectile} />
                ))}

                {/* Stage info */}
                <div className="absolute top-4 left-4 text-white">
                    <div className="text-lg font-bold drop-shadow-lg">
                        Stage {stage.id}: {stage.name}
                    </div>
                </div>

                {/* Controls hint */}
                <div className="absolute bottom-4 left-4 text-white text-sm opacity-70 hidden md:block">
                    Use ↑↓ or W/S to move
                </div>

                {/* Mobile Controls */}
                <div className="absolute bottom-8 left-4 flex flex-col gap-4 md:hidden z-40">
                    <button
                        className={`w-16 h-16 rounded-full bg-white/20 border-2 border-white/50 text-white flex items-center justify-center text-2xl active:bg-white/40 touch-none select-none ${touchUp ? 'bg-white/40' : ''}`}
                        onTouchStart={(e) => { e.preventDefault(); setTouchUp(true); }}
                        onTouchEnd={(e) => { e.preventDefault(); setTouchUp(false); }}
                        onMouseDown={() => setTouchUp(true)}
                        onMouseUp={() => setTouchUp(false)}
                        onMouseLeave={() => setTouchUp(false)}
                    >
                        ▲
                    </button>
                    <button
                        className={`w-16 h-16 rounded-full bg-white/20 border-2 border-white/50 text-white flex items-center justify-center text-2xl active:bg-white/40 touch-none select-none ${touchDown ? 'bg-white/40' : ''}`}
                        onTouchStart={(e) => { e.preventDefault(); setTouchDown(true); }}
                        onTouchEnd={(e) => { e.preventDefault(); setTouchDown(false); }}
                        onMouseDown={() => setTouchDown(true)}
                        onMouseUp={() => setTouchDown(false)}
                        onMouseLeave={() => setTouchDown(false)}
                    >
                        ▼
                    </button>
                </div>

                {/* Game Over Screen */}
                {gameOver && (
                    <div className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center z-50">
                        <div className="text-red-500 text-4xl font-bold mb-8 animate-pulse">
                            GAME OVER
                        </div>
                        <button
                            onClick={handleRestart}
                            className="px-8 py-4 bg-yellow-500 text-black font-bold text-xl rounded-lg hover:bg-yellow-400 transition-colors"
                        >
                            Try Again
                        </button>
                    </div>
                )}

                {/* Birthday Wish Message (Before Video) */}
                {gameWon && !showVideo && (
                    <div className="absolute inset-0 bg-black/90 flex flex-col items-center justify-center z-50 p-8 text-center animate-fade-in">
                        <h1 className="text-pink-500 text-4xl font-bold mb-6 drop-shadow-[0_0_10px_rgba(236,72,153,0.8)]">
                            ✨ Happy Birthday Anjali! ✨
                        </h1>
                        <div className="text-white text-xl leading-relaxed max-w-2xl mb-8 space-y-4 font-serif italic">
                            <p>
                                To the World's Best Girl,
                            </p>
                            <p>
                                Just like you conquered this game, may you conquer every challenge in your life.
                                Always keep winning, keep shining, and chasing your biggest dreams.
                            </p>
                            <p>
                                Your future is as bright as your smile, and all your ambitions are waiting for you! 💖
                            </p>
                        </div>
                        <button
                            onClick={handleStartVideo}
                            className="px-8 py-3 bg-pink-600 text-white font-bold text-xl rounded-full hover:bg-pink-500 transition-all transform hover:scale-105 shadow-[0_0_15px_rgba(236,72,153,0.6)]"
                        >
                            See Your Surprise 🎁
                        </button>
                    </div>
                )}

                {/* Victory Video Finale */}
                {gameWon && showVideo && (
                    <div className="absolute inset-0 bg-black flex items-center justify-center z-50">
                        <video
                            src="/videos/anjaliBirthdayWish.mp4"
                            autoPlay
                            controls
                            className="w-full h-full object-contain"
                            onEnded={handleRestart}
                        />
                        <button
                            onClick={handleRestart}
                            className="absolute bottom-8 right-8 px-6 py-3 bg-yellow-500 text-black font-bold rounded-lg hover:bg-yellow-400 transition-colors opacity-0 hover:opacity-100 transition-opacity"
                        >
                            Play Again
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
