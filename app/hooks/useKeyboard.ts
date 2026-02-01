import { useState, useEffect } from 'react';

interface KeyState {
    up: boolean;
    down: boolean;
}

export function useKeyboard(): KeyState {
    const [keys, setKeys] = useState<KeyState>({
        up: false,
        down: false,
    });

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'ArrowUp' || e.key === 'w' || e.key === 'W') {
                e.preventDefault();
                setKeys((prev) => ({ ...prev, up: true }));
            }
            if (e.key === 'ArrowDown' || e.key === 's' || e.key === 'S') {
                e.preventDefault();
                setKeys((prev) => ({ ...prev, down: true }));
            }
        };

        const handleKeyUp = (e: KeyboardEvent) => {
            if (e.key === 'ArrowUp' || e.key === 'w' || e.key === 'W') {
                setKeys((prev) => ({ ...prev, up: false }));
            }
            if (e.key === 'ArrowDown' || e.key === 's' || e.key === 'S') {
                setKeys((prev) => ({ ...prev, down: false }));
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        window.addEventListener('keyup', handleKeyUp);

        return () => {
            window.removeEventListener('keydown', handleKeyDown);
            window.removeEventListener('keyup', handleKeyUp);
        };
    }, []);

    return keys;
}
