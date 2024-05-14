import Link from 'next/link';
import React from 'react';
import { useTranslation } from 'react-i18next';

const CharacterCard = ({ character }) => {
    const { t } = useTranslation();

    // Extraer ID del personaje de la URL
    const characterId = character.url.match(/people\/(\d+)\//)[1];

    let genderKey = `gender_${character.gender.toLowerCase().replace('n/a', 'indefinido')}`;
    let eyeColorKey = `eye_color_${character.eye_color.toLowerCase().replace(/ /g, '_')}`;

    return (
        <Link href={`/characters/${characterId}`}>
           
                <section className="text-white rounded-3xl shadow-xl bg-gradient-to-t from-black-opacity-80 to-transparent ">
                    <article>
                        <img src="/images/generic/img_generic_character.jpeg" alt={character.name} className="w-full object-cover rounded-tr-3xl rounded-tl-3xl" />
                    </article>
                    <article className="p-5">
                        <h3 className="pb-5 text-center font-robotoMono">{character.name}</h3>
                        <div>
                            <p className="flex justify-between pb-4"><em className="text-mikado-yellow font-bold">{t('gender')}:</em> <em>{t(genderKey)}</em></p>
                            <p className="flex justify-between pb-4"><em className="text-mikado-yellow font-bold">{t('eyeColor')}:</em> <em>{t(eyeColorKey)}</em></p>
                        </div>
                    </article>
                </section>
            
        </Link>
    );
};

export default CharacterCard;

