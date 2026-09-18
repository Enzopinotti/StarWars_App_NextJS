import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import Link from 'next/link';
import carouselData from '../../public/json/carouselData.json';

const Carousel = () => {
  const { t } = useTranslation();
  const [activeIndex, setActiveIndex] = useState(0);

  const goPrevious = () => {
    setActiveIndex((previous) => Math.max(0, previous - 1));
  };

  const goNext = () => {
    setActiveIndex((previous) => Math.min(carouselData.length - 1, previous + 1));
  };

  return (
    <section
      role="region"
      aria-roledescription="carousel"
      aria-label={t('carouselLabel')}
      className="relative overflow-hidden w-full flex items-center"
    >
      <button
        type="button"
        onClick={goPrevious}
        disabled={activeIndex === 0}
        aria-label={t('previousSlide')}
        className="absolute left-0 z-10 text-white text-4xl p-4 disabled:opacity-40 focus-visible:outline focus-visible:outline-2 focus-visible:outline-mikado-yellow"
      >
        &lt;
      </button>
      <div
        className="flex w-full transition-transform duration-500 ease-in-out"
        style={{ transform: `translateX(-${activeIndex * 100}%)` }}
      >
        {carouselData.map((image, index) => (
          <div
            key={image.src}
            aria-hidden={index !== activeIndex}
            className="relative min-w-full h-[500px] md:h-[700px]"
          >
            <img
              src={image.src}
              alt={t('carouselSlide', { number: index + 1 })}
              className="w-full h-full object-cover"
            />
            <div className="absolute top-16 left-8 md:left-32 flex flex-col text-white text-xl font-robotoMono font-bold text-center">
              {image.elements.map((element, elementIndex) => {
                const elementKey = `${image.src}-${element.type}-${elementIndex}`;
                if (element.type === 'text') {
                  return (
                    <em key={elementKey} className={`my-2 ${element.class ?? ''}`}>
                      {t(element.content)}
                    </em>
                  );
                }
                if (element.type === 'divider') {
                  return <hr key={elementKey} />;
                }
                if (element.type === 'link') {
                  return (
                    <Link
                      key={elementKey}
                      href={element.href}
                      tabIndex={index === activeIndex ? 0 : -1}
                      className="text-mikado-yellow hover:text-white transition duration-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-mikado-yellow"
                    >
                      {t(element.content)}
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
        type="button"
        onClick={goNext}
        disabled={activeIndex === carouselData.length - 1}
        aria-label={t('nextSlide')}
        className="absolute right-0 z-10 text-white text-4xl p-4 disabled:opacity-40 focus-visible:outline focus-visible:outline-2 focus-visible:outline-mikado-yellow"
      >
        &gt;
      </button>
    </section>
  );
};

export default Carousel;
