import React from 'react';
import { useTranslation } from 'react-i18next';
import SocialMedia from '../SocialMedia';

const Footer = () => {
  const { t } = useTranslation();

  return (
    <footer className="bg-black text-white text-center py-8">
      <p className="text-lg mb-4 font-robotoMono">{t('moreAboutMe')}</p>
      <SocialMedia />
      <p className="font-robotoMono">{t('footerText')}</p>
    </footer>
  );
};

export default Footer;
