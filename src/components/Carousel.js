import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import Link from 'next/link';
import BotonTransparente from './ButtonTransparent';
import carouselData from '../../public/json/carouselData.json';

const Carousel = () => {
    const { t, i18n } = useTranslation();
    const [scrollX, setScrollX] = useState(0);
    const [ready, setReady] = useState(false);
    const [imageWidth, setImageWidth] = useState(0);

    useEffect(() => {
        const handleLoaded = () => {
            setReady(true);
        };
        i18n.on('loaded', handleLoaded);
        i18n.loadNamespaces('translation', handleLoaded);

        const updateWidth = () => {
            setImageWidth(window.innerWidth);
        };

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
        const maxScroll = -imageWidth * (carouselData.length - 1);
        if (x < maxScroll) {
            x = maxScroll;
        }
        setScrollX(x);
    };

    if (!ready) {
        return <div className='h-screen flex justify-center items-center'>Loading...</div>;
    }

    return (
        <div className="relative overflow-hidden w-full flex items-center">
            <button onClick={handleLeftClick} className="absolute left-0 z-10 text-white text-4xl p-4 focus:outline-none">&lt;</button>
            <div className="flex transition-transform duration-500 ease-in-out" style={{ transform: `translateX(${scrollX}px)` }}>
                {carouselData.map((image, index) => (
                    <div key={index} style={{ width: imageWidth, height: '700px', position: 'relative' }}>
                        <img
                            src={image.src}
                            alt={`Carousel Background ${index}`}
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        />
                        <div className="absolute top-12 left-16 flex flex-col text-white text-l font-robotoMono font-bold text-center">
                            {image.elements.map((element, elemIndex) => {
                                if (element.type === 'text') {
                                    return <em key={elemIndex} className={element.class}>{t(element.content)}</em>;
                                } else if (element.type === 'divider') {
                                    return <hr key={elemIndex} />;
                                } else if (element.type === 'link') {
                                    return <Link key={elemIndex} href={element.href}><BotonTransparente texto={t(element.content)}/></Link>;
                                }
                                return null;
                            })}
                        </div>
                    </div>
                ))}
            </div>
            <button onClick={handleRightClick} className="absolute right-0 z-10 text-white text-4xl p-4 focus:outline-none">&gt;</button>
        </div>
    );
};

export default Carousel;