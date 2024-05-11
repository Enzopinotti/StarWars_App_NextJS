import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import HamburgerMenu from '../HamburgerMenu';
import Logo from '../Logo';
import Navbar from '../NavBar';

const Header = () => {
    const { i18n } = useTranslation(); 
    const [isNavbarVisible, setIsNavbarVisible] = useState(false);
    const changeLanguage = (language) => {
        i18n.changeLanguage(language); 
    };

    return (
        <header className=" text-white  flex-col justify-between items-center">
            <section className="flex justify-between items-center pb-8 pr-10 pl-10 pt-8 header-bg">
                <Logo />
                <HamburgerMenu onToggle={setIsNavbarVisible}/>
            </section>
            {isNavbarVisible && (
                <section className={`navbar-gradient ${isNavbarVisible ? 'navbar-visible' : ''}`}>
                    <Navbar changeLanguage={changeLanguage} />
                </section>
            )}
        </header>
    );
};

export default Header;