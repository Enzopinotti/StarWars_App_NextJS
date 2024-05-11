import Link from 'next/link';
import { useTranslation } from 'react-i18next';

const Navbar = ({ changeLanguage }) => {
    const { i18n, t } = useTranslation();
    const currentLanguage = i18n.language;
    return (
        <div className="w-full  text-white flex p-6 pb-10 justify-between navbar-gradient  ">
            <ul className="pl-5">
                <li className="pt-10">
                    <Link href="/films"><p className="text-l font-orbitron">{t('filmTitle')}</p></Link>
                </li>
                <li className="pt-10">
                    <Link href="/characters"><p className="text-l font-orbitron">{t('characterTitle')}</p></Link>
                </li>

            </ul>
            
            <section className="pr-5 ">
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