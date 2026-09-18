import React from 'react';

const ButtonFilter = ({ iconSrc, label, isOpen, toggleDropdown, children }) => {
  const menuId = `filter-menu-${label.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`;

  return (
    <div className="relative w-full flex justify-center">
      <button
        type="button"
        onClick={toggleDropdown}
        aria-expanded={isOpen}
        aria-controls={menuId}
        className={`flex items-center w-36 justify-between px-3 py-1 bg-gray-600 border border-solid border-gray-300 rounded-3xl text-white cursor-pointer transition ease-in-out duration-150 focus-visible:outline focus-visible:outline-2 focus-visible:outline-mikado-yellow ${
          isOpen ? 'bg-gray-700 border-gray-400' : 'hover:bg-gray-700'
        }`}
      >
        <img src={iconSrc} alt="" aria-hidden="true" className="w-5 h-5 mr-2" />
        <span className="text-white font-robotoMono font-extrabold text-xs">
          {label}
        </span>
        <img
          src="/images/icons/SortDown.png"
          alt=""
          aria-hidden="true"
          className={`w-4 h-4 transition-transform ${
            isOpen ? 'transform rotate-180' : ''
          }`}
        />
      </button>
      {isOpen && (
        <div
          id={menuId}
          className="absolute left-0 right-0 top-10 z-10 mt-1 rounded shadow-lg bg-black-opacity-80 max-h-60 overflow-auto scrollbar-thin scrollbar-thumb-gray-900 scrollbar-track-gray-000"
        >
          {children}
        </div>
      )}
    </div>
  );
};

export default ButtonFilter;
