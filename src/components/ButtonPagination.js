import React from 'react';

const ButtonPagination = ({ number, isActive, onClick, disabled }) => {
  const baseStyle = "p-1 w-7 h-10 rounded border text-black font-bold cursor-pointer";
  const normalStyle = "border-gray-800 bg-gray-100 hover:bg-gray-300";
  const activeStyle = "bg-yellow-300 text-mikado-yellow border-mikado-yellow border-2";
  const disabledStyle = "opacity-100 bg-gray-700";  

  const buttonStyle = `${baseStyle} ${isActive ? activeStyle : normalStyle} ${disabled ? disabledStyle : ''}`;

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={buttonStyle}
    >
      {number}
    </button>
  );
};

export default ButtonPagination;