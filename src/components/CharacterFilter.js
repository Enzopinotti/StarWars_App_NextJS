import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import ButtonFilter from './ButtonFilter';

const CharacterFilter = ({ onFilterChange, eyeColors, genders }) => {
  const { t } = useTranslation();
  const [isOpenEyeColor, setIsOpenEyeColor] = useState(false);
  const [isOpenGender, setIsOpenGender] = useState(false);

  const translatedEyeColors = eyeColors.map((color) => ({
    key: color,
    label: t(
      `eye_color_${color.toLowerCase().replace(/, /g, '_').replace(/ /g, '_')}`,
    ),
  }));

  const translatedGenders = genders.map((gender) => ({
    key: gender,
    label: t(`gender_${gender.toLowerCase()}`),
  }));

  if (eyeColors.length === 0 && genders.length === 0) {
    return (
      <div className="flex justify-center items-center p-4 navbar-gradient rounded-lg shadow h-20">
        <p className="text-white font-orbitron pulse-animation">
          {t('loadingFilters')}
        </p>
      </div>
    );
  }

  const renderOptions = (items, type, close) => (
    <ul className="py-1">
      {items.length > 0 ? (
        items.map(({ key, label }) => (
          <li key={key}>
            <button
              type="button"
              className="w-full text-left px-4 py-2 text-white hover:bg-gray-600 focus-visible:bg-gray-600 focus-visible:outline-none"
              onClick={() => {
                onFilterChange(type, key);
                close(false);
              }}
            >
              {label}
            </button>
          </li>
        ))
      ) : (
        <li className="px-4 py-2 text-white">{t('noFilterOptions')}</li>
      )}
    </ul>
  );

  return (
    <div className="flex justify-around p-4 navbar-gradient rounded-lg shadow">
      <ButtonFilter
        iconSrc="/images/icons/Vision.png"
        label={t('eyeColor')}
        isOpen={isOpenEyeColor}
        toggleDropdown={() => setIsOpenEyeColor((previous) => !previous)}
      >
        {renderOptions(translatedEyeColors, 'eyeColor', setIsOpenEyeColor)}
      </ButtonFilter>

      <ButtonFilter
        iconSrc="/images/icons/gender.png"
        label={t('gender')}
        isOpen={isOpenGender}
        toggleDropdown={() => setIsOpenGender((previous) => !previous)}
      >
        {renderOptions(translatedGenders, 'gender', setIsOpenGender)}
      </ButtonFilter>
    </div>
  );
};

export default CharacterFilter;
