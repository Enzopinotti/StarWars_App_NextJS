import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

const Footer = () => {
    const { t, i18n } = useTranslation();
    const [ready, setReady] = useState(false);

    useEffect(() => {
        i18n.on('loaded', () => {
            setReady(true);
        });
        // Cargar manualmente el namespace si es necesario
        i18n.loadNamespaces('translation', () => {
            setReady(true);
        });

        return () => {
            i18n.off('loaded');
        };
    }, []);

    if (!ready) {
        return <p>Loading translations...</p>;
    }

    return <p>{t('footerText')}</p>;
};

export default Footer;