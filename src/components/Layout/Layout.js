// components/Layout.js
import Header from './Header.js';
import Footer from './Footer';

export default function Layout({ children }) {
    return (
        <>
            <Header />
            <main>{children}</main>
            <Footer />
        </>
    );
}