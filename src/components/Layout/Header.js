import React, { useState } from 'react';
import { useRouter } from 'next/router';
import HamburgerMenu from '../HamburgerMenu';
import Logo from '../Logo';
import Navbar from '../NavBar';
import { useWindowSize } from '../../hooks/WindowSize';

const Header = () => {
  const router = useRouter();
  const { width } = useWindowSize();
  const [isNavbarVisible, setIsNavbarVisible] = useState(false);

  const changeLanguage = async (language) => {
    if (router.locale === language) {
      return;
    }

    await router.push(router.asPath, router.asPath, { locale: language });
  };

  const toggleNavbar = () => {
    if (width < 1024) {
      setIsNavbarVisible((previous) => !previous);
    }
  };

  const shouldShowGradient = width >= 1024 || isNavbarVisible;

  return (
    <header
      className={`flex-col justify-between items-center ${
        shouldShowGradient ? 'navbar-gradient' : 'header-bg'
      }`}
    >
      <section className="flex justify-between items-center pb-6 pr-10 pl-10 pt-6">
        <Logo />
        {width >= 1024 ? (
          <div className="flex w-full justify-end items-center">
            <Navbar changeLanguage={changeLanguage} />
          </div>
        ) : (
          <HamburgerMenu onToggle={toggleNavbar} />
        )}
      </section>
      {isNavbarVisible && width < 1024 && (
        <section className="navbar-gradient">
          <Navbar changeLanguage={changeLanguage} />
        </section>
      )}
    </header>
  );
};

export default Header;
