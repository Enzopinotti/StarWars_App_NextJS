import { useState, useEffect } from 'react';

export function useWindowSize() {
    const [windowSize, setWindowSize] = useState({
        width: undefined,
    });

    useEffect(() => {
        function handleResize() {
            setWindowSize({
                width: window.innerWidth,
            });
        }

        window.addEventListener('resize', handleResize);
        handleResize(); // Inicializa el valor al cargar

        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return windowSize;
}