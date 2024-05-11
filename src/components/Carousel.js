import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

const Carousel = () => {
    const { t, i18n } = useTranslation();
    const [scrollX, setScrollX] = useState(0);
    const [ready, setReady] = useState(false);
    const totalWidth = 2000; // Cambia esto al ancho real de tu imagen

    useEffect(() => {
        const handleLoaded = () => {
            setReady(true);
        };
        i18n.on('loaded', handleLoaded);
        i18n.loadNamespaces('translation', handleLoaded);

        return () => {
            i18n.off('loaded', handleLoaded);
        };
    }, [i18n]);

    const handleLeftClick = () => {
        let x = scrollX + window.innerWidth;
        if (x > 0) {
            x = 0;
        }
        setScrollX(x);
    };

    const handleRightClick = () => {
        let x = scrollX - window.innerWidth;
        const maxScroll = -totalWidth + window.innerWidth;
        if (x < maxScroll) {
            x = maxScroll;
        }
        setScrollX(x);
    };

    if (!ready) {
        return <div>Loading translations...</div>;
    }

    return (
        <div className="relative overflow-hidden w-full flex items-center">
            <button onClick={handleLeftClick} className="absolute left-0 z-10 text-white text-4xl p-4 focus:outline-none">&lt;</button>
            <div className="flex transition-transform duration-500 ease-in-out" style={{ transform: `translateX(${scrollX}px)` }}>
                <img
                    src="/images/Carrusel2.jpeg"
                    alt="Carousel Background"
                    style={{ width: totalWidth, height: '450px', objectFit: 'cover' }}
                />
                <div className="absolute bottom-48 left-12 inset-0 flex justify-center items-center text-white text-l pointer-events-none font-robotoMono font-bold text-center">
                    <article>
                        <em className="text-5xl">{t('explore')}</em><hr /> {t('theVastUniverse')} <hr /> {t('of')} <em className="text-mikado-yellow">STAR WARS</em>
                    </article>
                </div>
            </div>
            <button onClick={handleRightClick} className="absolute right-0 z-10 text-white text-4xl p-4 focus:outline-none">&gt;</button>
        </div>
    );
};

export default Carousel;