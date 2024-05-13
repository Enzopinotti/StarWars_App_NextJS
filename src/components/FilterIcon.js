import React, { useState } from 'react';

const FilterIcon = ({ onClick }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleFilter = () => {
    setIsOpen(!isOpen);
    onClick(); 
  };

  return (
    <img
        src="/images/icons/filterIcon.png"
        onClick={toggleFilter}
        className={`flex items-center justify-center p-2  transition-colors duration-200 ease-in-out w-15 h-15 ml-9 cursor-pointer ${isOpen ? 'transform scale-125' : ''}`}
        alt="Toggle Filter"
     />
  );
};

export default FilterIcon;