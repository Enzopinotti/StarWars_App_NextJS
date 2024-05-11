import '../styles/globals.css';
import '../i18n/i18n'
import Layout from '../components/Layout/Layout';


function MyApp({ Component, pageProps }) {
  return (
    
      <Layout>
        <Component {...pageProps} />
      </Layout>
    
    
  );
}

export default MyApp;