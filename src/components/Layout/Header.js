import React from 'react';
import { useTranslation } from 'react-i18next';

const Header = () => {
    const { i18n } = useTranslation(); 
    
    const changeLanguage = (language) => {
        i18n.changeLanguage(language); 
    };

    return (
        <header>
            <nav>
                {/* Ejemplo de botones para cambiar el idioma */}
                <button onClick={() => changeLanguage('en')}>English</button>
                <button onClick={() => changeLanguage('es')}>Español</button>
            </nav>
        </header>
    );
};

export default Header;