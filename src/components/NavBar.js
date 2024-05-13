import Link from 'next/link';
import { useRouter } from 'next/router';
import { useTranslation } from 'react-i18next';

const Navbar = ({ changeLanguage }) => {
    const { i18n, t } = useTranslation();
    const router = useRouter();

    const currentLanguage = i18n.language;

    // Función para verificar si la ruta actual coincide con la ruta del enlace
    const isActive = (pathname) => {
        return router.pathname === pathname || router.pathname.startsWith(`${pathname}/`);
    };

    return (
        <div className="w-full text-white flex p-6 pb-10 justify-between navbar-gradient">
            <ul className="pl-5">
                <li className="pt-10">
                    <Link href="/films">
                        <p className={`text-l font-orbitron ${isActive('/films') ? 'text-mikado-yellow' : ''}`}>{t('filmTitle')}</p>
                    </Link>
                </li>
                <li className="pt-10">
                    <Link href="/characters">
                        <p className={`text-l font-orbitron ${isActive('/characters') ? 'text-mikado-yellow' : ''}`}>{t('characterTitle')}</p>
                    </Link>
                </li>
            </ul>
            
            <section className="pr-5">
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
};

export default Navbar;