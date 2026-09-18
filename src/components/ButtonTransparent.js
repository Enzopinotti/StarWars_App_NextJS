import React from 'react';

const ButtonTransparent = ({ texto }) => {
  return (
    <span className="text-mikado-yellow hover:text-white transition duration-300">
      {texto}
    </span>
  );
};

export default ButtonTransparent;
