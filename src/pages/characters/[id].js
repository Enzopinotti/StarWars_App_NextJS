import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

const CharacterDetail = () => {
    const router = useRouter();
    const { id } = router.query;
    const { t } = useTranslation();
    const [character, setCharacter] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (id) {
        fetch(`https://swapi.dev/api/people/${id}/`)
            .then(response => response.json())
            .then(data => {
            setCharacter(data);
            setLoading(false);
            });
        }
    }, [id]);

    if (loading) {
        return <div className="h-screen flex justify-center items-center">
        <p className="text-white font-orbitron">Cargando datos del personaje...</p>
        </div>;
    }

    if (!character) {
        return <div className="h-screen flex justify-center items-center">
        <p className="text-white font-orbitron">Personaje no encontrado.</p>
        </div>;
    }

    let eyeColorKey = `eye_color_${character.eye_color.toLowerCase().replace(/ /g, '_')}`;
    let hairColorKey = `hair_color_${character.hair_color.toLowerCase().replace(/ /g, '_').replace(',', '_').replace('n/a', 'na')}`;
    let skinColorKey = `skin_color_${character.skin_color.toLowerCase().replace(/ /g, '_').replace(',', '_').replace('n/a', 'na')}`;


    return (
        <div className="text-white rounded-3xl shadow-xl bg-gradient-to-t from-black-opacity-80 to-transparent p-5 m-5 relative">
            <h2 className="text-center font-robotoMono text-xl mb-4 absolute top-8 left-10">{character.name}</h2>
            <img src="/images/generic/img_generic_character.jpeg" alt={character.name} className="w-full object-cover rounded-tr-3xl rounded-tl-3xl" />
                <div className="p-4">
                    <p className="flex justify-between pb-4"><strong className='text-mikado-yellow '>{t('eyeColor')}:</strong> {t(eyeColorKey)}</p>
                    <p className="flex justify-between pb-4"><strong className='text-mikado-yellow '>{t('birthYear')}:</strong> {t(character.birth_year)}</p>
                    <p className="flex justify-between pb-4"><strong className='text-mikado-yellow '>{t('hairColor')}:</strong> {t(hairColorKey)}</p>
                    <p className="flex justify-between pb-4"><strong className='text-mikado-yellow '>{t('height')}:</strong> {character.height} cm</p>
                    <p className="flex justify-between pb-4"><strong className='text-mikado-yellow '>{t('skinColor')}:</strong> {t(skinColorKey)}</p>
                    <p className="flex justify-between pb-4"><strong className='text-mikado-yellow '>{t('mass')}:</strong> {character.mass} kg</p>
                </div>
        </div>
    );
};

export default CharacterDetail;