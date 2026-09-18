import React from 'react';
import { useTranslation } from 'react-i18next';

const HamburgerMenu = ({ isOpen, onToggle }) => {
  const { t } = useTranslation();

  return (
    <button
      type="button"
      onClick={onToggle}
      aria-expanded={isOpen}
      aria-controls="mobile-navigation"
      aria-label={isOpen ? t('closeMenu') : t('openMenu')}
      className="w-10 h-10 relative focus-visible:outline focus-visible:outline-2 focus-visible:outline-mikado-yellow overflow-hidden"
    >
      <img
        src="/images/icons/hamburgerMenu.png"
        alt=""
        aria-hidden="true"
        className={`absolute top-0 left-0 w-full h-full object-cover transition-transform duration-500 ease-in-out ${
          isOpen ? 'scale-y-150' : 'scale-y-100'
        }`}
      />
    </button>
  );
};

export default HamburgerMenu;
