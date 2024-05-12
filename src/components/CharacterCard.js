import React from 'react';
import { useTranslation } from 'react-i18next';

const CharacterCard = ({ character }) => {
    const { t } = useTranslation();

    // Transforma los valores recibidos a claves de traducción
    const genderKey = `gender_${character.gender.toLowerCase()}`; // asegúrate de que los valores coincidan con tus claves
    console.log(genderKey)
    const eyeColorKey = `eye_color_${character.eye_color.replace(/ /g, '_').toLowerCase()}`; // reemplaza espacios con guiones bajos y convierte a minúsculas

    return (
        <section className="text-white rounded-3xl shadow-xl bg-gradient-to-t from-black-opacity-80 to-transparent">
            <article>
                <img src="/images/generic/img_generic_character.jpeg" alt="Generic Star Wars character" className="w-full object-cover rounded-tr-3xl rounded-tl-3xl" />
            </article>
            <article className="p-5">
                <h3 className="pb-5 text-center font-robotoMono">{character.name}</h3>
                <div>
                    <p className="flex justify-between pb-4"><em className="text-mikado-yellow">{t('gender')}:</em> <em>{t(genderKey)}</em></p>
                    <p className="flex justify-between pb-4"><em className="text-mikado-yellow">{t('eyeColor')}:</em> <em>{t(eyeColorKey)}</em></p>
                </div>
            </article>
        </section>
    );
};

export default CharacterCard;

