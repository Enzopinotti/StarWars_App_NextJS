import React from 'react';
import Image from 'next/image'; 

const Logo = () => {
  return (
    <div className="logo-container">
      <Image src="/images/logo.png" alt="Star Wars Logo" width={150} height={50} />
    </div>
  );
};

export default Logo;