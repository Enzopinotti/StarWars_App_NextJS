import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import HamburgerMenu from '../HamburgerMenu';
import Logo from '../Logo';
import Navbar from '../NavBar';
import { useWindowSize } from '../../hooks/WindowSize';

const Header = () => {
    const { t, i18n } = useTranslation();
    const { width } = useWindowSize(); // Utiliza el hook para obtener el ancho actual de la ventana
    const [isNavbarVisible, setIsNavbarVisible] = useState(false);
    const [ready, setReady] = useState(false);

    useEffect(() => {
        const handleLoaded = () => {
            setReady(true);
        };
        i18n.on('loaded', handleLoaded);
        i18n.loadNamespaces('translation', handleLoaded);

        return () => {
            i18n.off('loaded', handleLoaded);
        };
    }, [i18n]);

    const changeLanguage = (language) => {
        i18n.changeLanguage(language);
    };

    const toggleNavbar = () => {
        if (width < 1024) { 
            setIsNavbarVisible((prev) => !prev);
        }
    };

    if (!ready) {
        return <p>Loading translations...</p>;
    }

    const shouldShowGradient = width >= 1024 || isNavbarVisible;

    return (
        <header className={`flex-col justify-between items-center ${shouldShowGradient ? 'navbar-gradient' : 'header-bg'}`}>
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