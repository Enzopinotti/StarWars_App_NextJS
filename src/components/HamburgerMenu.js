import React, { useState } from 'react';

const HamburgerMenu = ({ onToggle }) => {
    const [isOpen, setIsOpen] = useState(false);

    const toggleMenu = () => {
        setIsOpen(!isOpen);
        onToggle(!isOpen);
    };

    return (
        <button onClick={toggleMenu} className="w-10 h-10 relative focus:outline-none overflow-hidden">
            <img
                src="/images/icons/hamburgerMenu.png"
                alt="Menu"
                className={`absolute top-0 left-0 w-full h-full object-cover transition-transform duration-500 ease-in-out ${
                    isOpen ? 'scale-y-150' : 'scale-y-100'}`}  // Asegúrate de que el objeto se escala solo verticalmente
            />
        </button>
    );
};

export default HamburgerMenu;