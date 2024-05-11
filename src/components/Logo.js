import React from 'react';
import Image from 'next/image';

const Logo = () => {
  return (
    <div className="logo-container">
      <img
        src="/images/logo.png"
        alt="Star Wars Logo"
        style={{
          width: '150px',
          height: '65px',
          objectFit: 'cover'  // Esta es una forma de aplicar estilos directamente si prefieres inline styles
        }}
      />
    </div>
  );
};

export default Logo;
