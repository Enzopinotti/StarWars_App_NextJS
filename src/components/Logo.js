import Link from 'next/link';
import React from 'react';

const Logo = () => {
  return (
    <div className="logo-container">
      <Link href="/" className="block cursor-pointer transition transform hover:scale-105 animation-fade-in">

        <img
          src="/images/logo.png"
          alt="Star Wars Logo"
          style={{
            width: '200px',
            height: '65px',
            objectFit: 'contain'  
          }}
        />

      </Link>
      
    </div>
  );
};

export default Logo;
