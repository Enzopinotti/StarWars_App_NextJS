import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import Link from 'next/link';
import BotonTransparente from './ButtonTransparent';

const Carousel = () => {
    const { t, i18n } = useTranslation();
    const [scrollX, setScrollX] = useState(0);
    const [ready, setReady] = useState(false);
    const [imageWidth, setImageWidth] = useState(0); // Estado para almacenar el ancho de la ventana
    console.log(i18n.language)
    useEffect(() => {
        const handleLoaded = () => {
            setReady(true);
        };
        i18n.on('loaded', handleLoaded);
        i18n.loadNamespaces('translation', handleLoaded);

        // Ajustar el ancho en tiempo de ejecución para manejar redimensionamientos y el renderizado inicial
        function updateWidth() {
            setImageWidth(window.innerWidth);
        }

        window.addEventListener('resize', updateWidth);
        updateWidth();

        return () => {
            window.removeEventListener('resize', updateWidth);
            i18n.off('loaded', handleLoaded);
        };
    }, [i18n]);

    const handleLeftClick = () => {
        let x = scrollX + imageWidth;
        if (x > 0) {
            x = 0;
        }
        setScrollX(x);
    };

    const handleRightClick = () => {
        let x = scrollX - imageWidth;
        const maxScroll = -imageWidth * (images.length - 1);
        if (x < maxScroll) {
            x = maxScroll;
        }
        setScrollX(x);
    };

    const images = [
        {
            src: "/images/carousel/carrousel1.png",
            elements: (
                <>
                    <em className="text-5xl">{t('explore')}</em>
                    <hr />
                    {t('theVastUniverse')}
                    <hr />
                    {t('of')}
                    <em className="text-mikado-yellow"> STAR WARS</em>
                </>
            )
        },
        {
            src: "/images/carousel/carrousel2.png",
            elements: (
                <>
                    <em className="text-5xl">{t('learn')}</em>
                    <hr />
                    {t('ofYours')}
                    <hr />
                    <Link href="/characters">
                        <BotonTransparente texto='character'/>
                    </Link>
                </>
            )
        },
        {
            src: "/images/carousel/carrousel3.png",
            elements: (
                <>
                    
                    <em className="text-5xl">{t('connect')}</em>
                    <hr />
                    <em>{t('withYou')}</em>
                    <hr />
                    <Link href="/films">
                        <BotonTransparente texto='film'/>
                    </Link>
                    
                    <em> {t('favorites')}</em>
                </>
            )
        }
    ];

    if (!ready) {
        return <div>Loading translations...</div>;
    }

    return (
        <div className="relative overflow-hidden w-full flex items-center">
            <button onClick={handleLeftClick} className="absolute left-0 z-10 text-white text-4xl p-4 focus:outline-none">&lt;</button>
            <div className="flex transition-transform duration-500 ease-in-out" style={{ transform: `translateX(${scrollX}px)` }}>
                {images.map((image, index) => (
                    <div key={index} style={{ width: imageWidth, height: '700px', position: 'relative' }}>
                        <img
                            src={image.src}
                            alt={`Carousel Background ${index + 1}`}
                            style={{   width: '100%',  }}  // Cambiado a 'contain' para evitar el "zoom"
                        />
                        <div className="absolute top-12 left-16 flex  text-white text-l pointer-events-none font-robotoMono font-bold text-center ">
                            <article>
                                {image.elements}
                            </article>
                        </div>
                    </div>
                ))}
            </div>
            <button onClick={handleRightClick} className="absolute right-0 z-10 text-white text-4xl p-4 focus:outline-none">&gt;</button>
        </div>
    );
};

export default Carousel;
