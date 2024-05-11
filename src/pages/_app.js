import '../styles/globals.css';
import '../i18n/i18n'
import Layout from '../components/Layout/Layout';
import { useTranslation } from 'react-i18next';

function MyApp({ Component, pageProps }) {

  const { ready } = useTranslation();
 
  return (
    
      <Layout>
        <Component {...pageProps} />
      </Layout>
    
    
  );
}

export default MyApp;