import React from 'react'
import { useTranslation } from 'react-i18next';



const ButtonTransparent = ({texto}) => {
    const { t } = useTranslation();
    return (
        <button className="text-mikado-yellow hover:text-white transition duration-300">{t(`${texto}`)}</button>
    )
}

export default ButtonTransparent