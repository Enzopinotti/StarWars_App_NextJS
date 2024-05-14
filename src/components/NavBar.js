import React from 'react';
import Link from 'next/link';
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

    const isDesktop = width >= 1024; // Considera escritorio a partir de 1024px de ancho

    if (isDesktop) {
        // Versión para escritorio
        return (
            <div className={`w-full text-white flex justify-between ${currentLanguage ? '' : 'bg-black'}`}>
                <ul className="flex justify-around w-full h-28">
                    <li className='flex items-center'>
                        <Link  href="/films">
                            <p className={`text-lg  pr-8 font-orbitron ${isActive('/films') ? 'text-mikado-yellow' : ''}`}>{t('filmTitle')}</p>
                        </Link>
                    </li>
                    <li className='flex items-center'>
                        <Link href="/characters">
                            <p className={`text-lg font-orbitron ${isActive('/characters') ? 'text-mikado-yellow' : ''}`}>{t('characterTitle')}</p>
                        </Link>
                    </li>
                </ul>
                
                <section className="pr-5 w-40 flex items-start justify-end">
                    <button className="pr-3" onClick={() => changeLanguage('en')} 
                            style={{ color: currentLanguage === 'en' ? '#F5C003' : 'white' }}>
                        En
                    </button>/
                    <button className="pl-3" onClick={() => changeLanguage('es')} 
                            style={{ color: currentLanguage === 'es' ? '#F5C003' : 'white' }}>
                        Es
                    </button>
                </section>
            </div>
        );
    } else {
        // Versión para móviles
        return (
            <div className={`w-full text-white flex p-6 pb-10 justify-between`}>
                <ul>
                    <li>
                        <Link href="/films">
                            <p className={`text-lg pb-4 pt-8 font-orbitron ${isActive('/films') ? 'text-mikado-yellow' : ''}`}>{t('filmTitle')}</p>
                        </Link>
                    </li>
                    <li>
                        <Link href="/characters">
                            <p className={`text-lg pb-4 pt-8 font-orbitron ${isActive('/characters') ? 'text-mikado-yellow' : ''}`}>{t('characterTitle')}</p>
                        </Link>
                    </li>
                </ul>
                
                <section>
                    <button onClick={() => changeLanguage('en')} 
                            style={{ color: currentLanguage === 'en' ? '#F5C003' : 'white' }}>
                        En
                    </button>/
                    <button onClick={() => changeLanguage('es')} 
                            style={{ color: currentLanguage === 'es' ? '#F5C003' : 'white' }}>
                        Es
                    </button>
                </section>
            </div>
        );
    }
};

export default Navbar;