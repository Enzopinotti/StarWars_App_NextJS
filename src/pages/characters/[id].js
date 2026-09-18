import React from 'react';
import Head from 'next/head';
import { useTranslation } from 'react-i18next';
import {
  getPerson,
  isSwapiError,
  SWAPI_ERROR_CODES,
} from '../../lib/swapi.mjs';

export async function getServerSideProps(context) {
  const { id } = context.params;

  try {
    const character = await getPerson(id);
    return { props: { character, upstreamError: false } };
  } catch (error) {
    if (
      isSwapiError(error) &&
      error.code === SWAPI_ERROR_CODES.NOT_FOUND
    ) {
      return { notFound: true };
    }

    context.res.statusCode = 503;
    return { props: { character: null, upstreamError: true } };
  }
}

const CharacterDetail = ({ character, upstreamError }) => {
  const { t } = useTranslation();

  if (upstreamError) {
    return (
      <div className="h-screen flex justify-center items-center">
        <p className="text-white font-orbitron">{t('dataSourceError')}</p>
      </div>
    );
  }

  if (!character) {
    return (
      <div className="h-screen flex justify-center items-center">
        <p className="text-white font-orbitron">{t('characterNotFound')}</p>
      </div>
    );
  }

  const eyeColorKey = `eye_color_${character.eye_color
    .toLowerCase()
    .replace(/ /g, '_')}`;
  const hairColorKey = `hair_color_${character.hair_color
    .toLowerCase()
    .replace(/ /g, '_')
    .replace(',', '_')
    .replace('n/a', 'na')}`;
  const skinColorKey = `skin_color_${character.skin_color
    .toLowerCase()
    .replace(/ /g, '_')
    .replace(',', '_')
    .replace('n/a', 'na')}`;

  return (
    <>
      <Head>
        <title>{`${character.name} | Star Wars')}`}</title>
      </Head>
      <div className="text-white rounded-3xl shadow-xl bg-gradient-to-t from-black-opacity-80 to-transparent p-5 m-5 relative">
        <h2 className="text-center font-robotoMono text-xl mb-4 absolute top-8 left-10">
          {character.name}
        </h2>
        <img
          src="/images/generic/img_generic_character.jpeg"
          alt={character.name}
          className="w-full object-cover rounded-tr-3xl rounded-tl-3xl"
        />
        <div className="p-4">
          <p className="flex justify-between pb-4">
            <strong className="text-mikado-yellow ">{t('eyeColor')}:</strong>{' '}
            {t(eyeColorKey)}
          </p>
          <p className="flex justify-between pb-4">
            <strong className="text-mikado-yellow ">{t('birthYear')}:</strong>{' '}
            {t(character.birth_year)}
          </p>
          <p className="flex justify-between pb-4">
            <strong className="text-mikado-yellow ">{t('hairColor')}:</strong>{' '}
            {t(hairColorKey)}
          </p>
          <p className="flex justify-between pb-4">
            <strong className="text-mikado-yellow ">{t('height')}:</strong>{' '}
            {character.height} cm
          </p>
          <p className="flex justify-between pb-4">
            <strong className="text-mikado-yellow ">{t('skinColor')}:</strong>{' '}
            {t(skinColorKey)}
          </p>
          <p className="flex justify-between pb-4">
            <strong className="text-mikado-yellow ">{t('mass')}:</strong>{' '}
            {character.mass} kg
          </p>
        </div>
      </div>
    </>
  );
};

export default CharacterDetail;
