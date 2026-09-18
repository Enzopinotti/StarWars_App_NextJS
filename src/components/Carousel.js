import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import Link from 'next/link';
import BotonTransparente from './ButtonTransparent';
import carouselData from '../../public/json/carouselData.json';

const Carousel = () => {
  const { t } = useTranslation();
  const [scrollX, setScrollX] = useState(0);
  const [imageWidth, setImageWidth] = useState(0);

  useEffect(() => {
    const updateWidth = () => {
      setImageWidth(window.innerWidth);
    };

    window.addEventListener('resize', updateWidth);
    updateWidth();

    return () => {
      window.removeEventListener('resize', updateWidth);
    };
  }, []);

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

  return (
    <div className="relative overflow-hidden w-full flex items-center">
      <button
        onClick={handleLeftClick}
        className="absolute left-0 z-10 text-white text-4xl p-4 focus:outline-none"
      >
        &lt;
      </button>
      <div
        className="flex transition-transform duration-500 ease-in-out"
        style={{ transform: `translateX(${scrollX}px)` }}
      >
        {carouselData.map((image, index) => (
          <div
            key={index}
            style={{ width: imageWidth, height: '700px', position: 'relative' }}
          >
            <img
              src={image.src}
              alt={`Carousel Background ${index}`}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
            <div className="absolute top-16 left-32 flex flex-col text-white text-xl font-robotoMono font-bold text-center">
              {image.elements.map((element, elementIndex) => {
                if (element.type === 'text') {
                  return (
                    <em
                      key={elementIndex}
                      className={`my-2 ${element.class}`}
                    >
                      {t(element.content)}
                    </em>
                  );
                }
                if (element.type === 'divider') {
                  return <hr key={elementIndex} />;
                }
                if (element.type === 'link') {
                  return (
                    <Link key={elementIndex} href={element.href}>
                      <BotonTransparente texto={t(element.content)} />
                    </Link>
                  );
                }
                return null;
              })}
            </div>
          </div>
        ))}
      </div>
      <button
        onClick={handleRightClick}
        className="absolute right-0 z-10 text-white text-4xl p-4 focus:outline-none"
      >
        &gt;
      </button>
    </div>
  );
};

export default Carousel;
