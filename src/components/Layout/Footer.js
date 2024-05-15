import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import SocialMedia from '../SocialMedia'; 
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
      <SocialMedia />
      <p className="font-robotoMono">{t('footerText')}</p>
    </footer>
  );
};

export default Footer;