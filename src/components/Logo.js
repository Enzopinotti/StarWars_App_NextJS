import Link from 'next/link';
import React from 'react';

const Logo = () => {
  return (
    <div className="logo-container">
      <Link
        href="/"
        aria-label="Star Wars home"
        className="block cursor-pointer transition transform hover:scale-105 animation-fade-in focus-visible:outline focus-visible:outline-2 focus-visible:outline-mikado-yellow"
      >
        <img
          src="/images/logo.png"
          alt=""
          aria-hidden="true"
          className="w-[200px] h-[65px] object-contain"
        />
      </Link>
    </div>
  );
};

export default Logo;
