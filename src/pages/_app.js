import '../styles/globals.css';

import { useMemo } from 'react';
import { I18nextProvider } from 'react-i18next';
import { useRouter } from 'next/router';
import Layout from '../components/Layout/Layout';
import { createI18n } from '../i18n/i18n';

function MyApp({ Component, pageProps }) {
  const router = useRouter();
  const locale = router.locale ?? router.defaultLocale ?? 'en';
  const i18n = useMemo(() => createI18n(locale), [locale]);

  return (
    <I18nextProvider i18n={i18n}>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </I18nextProvider>
  );
}

export default MyApp;
