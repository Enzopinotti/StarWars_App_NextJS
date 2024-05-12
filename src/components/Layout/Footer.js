import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import Link from 'next/link';

const Footer = () => {
  const { t, i18n } = useTranslation();
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

  if (!ready) {
    return <p>Loading translations...</p>;
  }

  return (
    <footer className="bg-black text-white text-center py-8">
      <p className="text-lg mb-4 font-robotoMono">{t('moreAboutMe')}</p>
      <div className="flex justify-center space-x-6 mb-4">
        <Link href="https://github.com/Enzopinotti">
          <img src="/images/icons/GitHub.png" alt="Git" width="30" height="40" />
        </Link>
        <Link href="https://www.linkedin.com/in/enzo-daniel-pinotti-667270179/">
          <img src="/images/icons/Linkedin.png" alt="LinkedIn" width="30" height="40" />
        </Link>
        <Link href="https://www.figma.com/files/recents-and-sharing/recently-viewed?fuid=1245782265747292159">
          <img src="/images/icons/Figma.png" alt="Figma" width="30" height="40" />
        </Link>
      </div>
      <p className="font-robotoMono">{t('footerText')}</p>
    </footer>
  );
};

export default Footer;