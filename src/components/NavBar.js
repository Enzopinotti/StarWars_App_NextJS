import Link from 'next/link';
import React from 'react';
import { useRouter } from 'next/router';
import { useTranslation } from 'react-i18next';

const Navbar = ({ changeLanguage, mobile = false, onNavigate }) => {
  const { t } = useTranslation();
  const router = useRouter();
  const currentLanguage = router.locale ?? router.defaultLocale ?? 'en';

  const isActive = (pathname) =>
    router.pathname === pathname || router.pathname.startsWith(`${pathname}/`);

  const linkClass = (pathname) =>
    `text-lg font-orbitron ${mobile ? 'py-2' : pathname === '/films' ? 'pr-8' : ''} ${
      isActive(pathname)
        ? 'text-mikado-yellow glow-effect-active'
        : 'glow-effect-inactive'
    }`;

  return (
    <nav
      aria-label={t('primaryNavigation')}
      className={`w-full text-white flex ${
        mobile ? 'flex-col-reverse items-center' : 'justify-between'
      }`}
    >
      <ul
        className={
          mobile
            ? 'flex flex-col items-start space-y-4 mb-10 mt-8 w-full pl-12'
            : 'flex justify-around w-full h-28'
        }
      >
        <li className="flex items-center">
          <Link
            href="/films"
            className={linkClass('/films')}
            aria-current={isActive('/films') ? 'page' : undefined}
            onClick={onNavigate}
          >
            {t('filmTitle')}
          </Link>
        </li>
        <li className="flex items-center">
          <Link
            href="/characters"
            className={linkClass('/characters')}
            aria-current={isActive('/characters') ? 'page' : undefined}
            onClick={onNavigate}
          >
            {t('characterTitle')}
          </Link>
        </li>
      </ul>

      <div
        role="group"
        aria-label={t('languageSelector')}
        className={`pr-5 ${
          mobile
            ? 'w-full flex justify-end pr-12 pt-4'
            : 'w-40 flex items-start justify-end'
        }`}
      >
        <button
          type="button"
          className={`pr-3 ${
            currentLanguage === 'en'
              ? 'text-mikado-yellow glow-effect-active'
              : 'glow-effect-inactive'
          }`}
          aria-pressed={currentLanguage === 'en'}
          onClick={() => changeLanguage('en')}
        >
          En
        </button>
        <span aria-hidden="true">/</span>
        <button
          type="button"
          className={`pl-3 ${
            currentLanguage === 'es'
              ? 'text-mikado-yellow glow-effect-active'
              : 'glow-effect-inactive'
          }`}
          aria-pressed={currentLanguage === 'es'}
          onClick={() => changeLanguage('es')}
        >
          Es
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
