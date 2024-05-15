import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

export async function getServerSideProps(context) {
    const { id } = context.params;
    try {
        const response = await fetch(`https://swapi.dev/api/people/${id}/`);
        if (!response.ok) {
            throw new Error('Failed to fetch character');
        }
        const character = await response.json();
        return { props: { character } };
    } catch (error) {
        return { props: { error: true } };
    }
}

const CharacterDetail = ({ character, error }) => {
    const router = useRouter();
    const { t } = useTranslation();



    if (error) {
        return (
            <div className="h-screen flex justify-center items-center">
                <p className="text-white font-orbitron">Error al cargar los datos del personaje.</p>
            </div>
        );
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

        <>
            <Head>
                <title>{`${character.name} | Star Wars')}`}</title>
            </Head>
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
        
        </>
        
    );
};

export default CharacterDetail;