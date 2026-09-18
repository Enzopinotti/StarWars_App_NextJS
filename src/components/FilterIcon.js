import React from 'react';
import { useTranslation } from 'react-i18next';

const FilterIcon = ({ isOpen, onClick }) => {
  const { t } = useTranslation();

  return (
    <button
      type="button"
      onClick={onClick}
      aria-expanded={isOpen}
      aria-controls="character-filters"
      aria-label={isOpen ? t('hideFilters') : t('showFilters')}
      className={`flex items-center justify-center p-2 transition-colors duration-200 ease-in-out w-16 h-16 ml-9 cursor-pointer focus-visible:outline focus-visible:outline-2 focus-visible:outline-mikado-yellow ${
        isOpen ? 'transform scale-125' : ''
      }`}
    >
      <img
        src="/images/icons/filterIcon.png"
        alt=""
        aria-hidden="true"
        className="w-full h-full"
      />
    </button>
  );
};

export default FilterIcon;
