// Dentro del componente HamburgerMenu.js
import React from 'react'
import { useTranslation } from 'react-i18next';
import { useState } from 'react';
import Image from 'next/image';

const HamburgerMenu = ({ onToggle }) => {
    const [isOpen, setIsOpen] = useState(false);

    const toggleMenu = () => {
        setIsOpen(!isOpen);
        onToggle(!isOpen);
    };


    return (

        <button onClick={toggleMenu} className="w-10 h-10 relative focus:outline-none overflow-hidden">
            <Image
                src="/images/icons/hamburgerMenu.png"
                alt="Menu"
                layout="fill"
                objectFit="cover"  // Utiliza 'cover' para permitir cortes
                className={`transition-transform duration-500 ease-in-out ${
                    isOpen ? 'scale-y-150' : 'scale-y-100'}`}  // Escala solo verticalmente
            />
        </button>
    );
};

export default HamburgerMenu;
