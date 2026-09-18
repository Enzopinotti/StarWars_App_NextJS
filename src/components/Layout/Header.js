import React, { useState } from 'react';
import { useRouter } from 'next/router';
import HamburgerMenu from '../HamburgerMenu';
import Logo from '../Logo';
import Navbar from '../NavBar';

const Header = () => {
  const router = useRouter();
  const [isNavbarVisible, setIsNavbarVisible] = useState(false);

  const changeLanguage = async (language) => {
    if (router.locale === language) return;

    await router.push(router.asPath, router.asPath, { locale: language });
    setIsNavbarVisible(false);
  };

  return (
    <header
      className={`header-responsive flex-col justify-between items-center ${
        isNavbarVisible ? 'header-responsive-open' : ''
      }`}
    >
      <section className="flex justify-between items-center pb-6 pr-10 pl-10 pt-6">
        <Logo />
        <div className="hidden lg:flex w-full justify-end items-center">
          <Navbar changeLanguage={changeLanguage} />
        </div>
        <div className="lg:hidden">
          <HamburgerMenu
            isOpen={isNavbarVisible}
            onToggle={() => setIsNavbarVisible((previous) => !previous)}
          />
        </div>
      </section>
      <section
        id="mobile-navigation"
        hidden={!isNavbarVisible}
        className="navbar-gradient lg:hidden"
      >
        <Navbar
          mobile
          changeLanguage={changeLanguage}
          onNavigate={() => setIsNavbarVisible(false)}
        />
      </section>
    </header>
  );
};

export default Header;
