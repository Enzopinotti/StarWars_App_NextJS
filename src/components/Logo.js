import Link from 'next/link';
import React from 'react';

const Logo = () => {
  return (
    <div className="logo-container">
      <Link href="./">

      <img
        src="/images/logo.png"
        alt="Star Wars Logo"
        style={{
          width: '150px',
          height: '65px',
          objectFit: 'cover'  
        }}
      />
      </Link>
      
    </div>
  );
};

export default Logo;
