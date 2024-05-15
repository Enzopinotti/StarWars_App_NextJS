import Link from 'next/link';
import React from 'react';
import { useRouter } from 'next/router';
import { useTranslation } from 'react-i18next';
import { useWindowSize } from '../hooks/WindowSize';

const Navbar = ({ changeLanguage }) => {
    const { width } = useWindowSize();
    const { i18n, t } = useTranslation();
    const router = useRouter();
    const currentLanguage = i18n.language;

    const isActive = (pathname) => {
        return router.pathname === pathname || router.pathname.startsWith(`${pathname}/`);
    };

    const isDesktop = width >= 1024; 

    return (
        <div className={`w-full text-white flex ${isDesktop ? 'justify-between' : 'flex-col-reverse items-center'} ${currentLanguage ? '' : 'bg-black'}`}>
            <ul className={`${isDesktop ? 'flex justify-around w-full h-28' : 'flex flex-col items-start space-y-4 mb-10 mt-8 w-full pl-12'}`}>
                <li className='flex items-center'>
                    <Link href="/films" >
                        <button className={`text-lg ${isDesktop ? 'pr-8' : 'py-2'} font-orbitron ${isActive('/films') ? 'text-mikado-yellow glow-effect-active' : 'glow-effect-inactive'}`}>
                            {t('filmTitle')}
                        </button>
                    </Link>
                </li>
                <li className='flex items-center'>
                    <Link href="/characters" >
                        <button className={`text-lg ${isDesktop ? '' : 'py-2'} font-orbitron ${isActive('/characters') ? 'text-mikado-yellow glow-effect-active' : 'glow-effect-inactive'}`}>
                            {t('characterTitle')}
                        </button>
                    </Link>
                </li>
            </ul>
            
            <section className={`pr-5 ${isDesktop ? 'w-40 flex items-start justify-end' : 'w-full flex justify-end pr-12 pt-4'}`}>
                <button className={`pr-3 ${currentLanguage === 'en' ? 'text-mikado-yellow glow-effect-active' : 'glow-effect-inactive'}`} onClick={() => changeLanguage('en')}>
                    En
                </button>/
                <button className={`pl-3 ${currentLanguage === 'es' ? 'text-mikado-yellow glow-effect-active' : 'glow-effect-inactive'}`} onClick={() => changeLanguage('es')}>
                    Es
                </button>
            </section>
        </div>
    );
};

export default Navbar;