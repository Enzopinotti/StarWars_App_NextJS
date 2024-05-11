import React, { useState } from 'react';
import Image from 'next/image';
import { useTranslation } from 'react-i18next';

const Carousel = () => {
    const {  t } = useTranslation();
    const [scrollX, setScrollX] = useState(0);
    const totalWidth = 4000; // Cambia esto al ancho real de tu imagen

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

    return (
        <div className="relative overflow-hidden w-full flex items-center">
            <button onClick={handleLeftClick} className="absolute left-0 z-10 text-white text-4xl p-4 focus:outline-none">&lt;</button>
            <div className="flex transition-transform duration-500 ease-in-out " style={{ transform: `translateX(${scrollX}px)` }}>
                <Image
                    src="/images/Carrusel2.jpeg" // Cambia esto a tu imagen
                    alt="Carousel Background"
                    width={totalWidth} // Ajusta según el tamaño de tu imagen
                    height={10} // Ajusta según la altura deseada
                    objectFit="cover"
                />

                <div className="absolute bottom-48 left-12 inset-0 flex justify-center items-center text-white text-l pointer-events-none font-robotoMono font-bold text-center">
                    <article>
                        <em className="text-5xl">{t('explore')}</em><hr /> {t('theVastUniverse')} <hr /> {t('theVastUniverse')} <em className="text-mikado-yellow">STAR WARS</em>
                    </article>
                    
                </div>
                
            </div>
            <button onClick={handleRightClick} className="absolute right-0 z-10 text-white text-4xl p-4 focus:outline-none">&gt;</button>
        </div>
    );
};

export default Carousel;
