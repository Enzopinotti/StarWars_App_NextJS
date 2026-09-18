import React from 'react';
import Head from 'next/head';
import { useTranslation } from 'react-i18next';
import SimpleCharacterCard from '../../components/SimpleCharacterCard';
import {
  getCharactersByUrls,
  getFilm,
  isSwapiError,
  SWAPI_ERROR_CODES,
} from '../../lib/swapi.mjs';

export async function getServerSideProps(context) {
  const { id } = context.params;

  let film;
  try {
    film = await getFilm(id);
  } catch (error) {
    if (
      isSwapiError(error) &&
      error.code === SWAPI_ERROR_CODES.NOT_FOUND
    ) {
      return { notFound: true };
    }

    context.res.statusCode = 503;
    return {
      props: {
        film: null,
        characters: [],
        upstreamError: true,
      },
    };
  }

  try {
    const characters = await getCharactersByUrls(film.characters);

    return {
      props: {
        film,
        characters,
        upstreamError: false,
      },
    };
  } catch {
    context.res.statusCode = 503;
    return {
      props: {
        film,
        characters: [],
        upstreamError: true,
      },
    };
  }
}

const FilmDetail = ({ film, characters, upstreamError }) => {
  const { t } = useTranslation();

  if (upstreamError) {
    return (
      <div className="h-screen flex justify-center items-center">
        <p className="text-white font-orbitron">{t('dataSourceError')}</p>
      </div>
    );
  }

  if (!film) {
    return (
      <div className="h-screen flex justify-center items-center">
        <p className="text-white font-orbitron">{t('filmNotFound')}</p>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>{`${film.title} | Star Wars`}</title>
      </Head>
      <div className="text-white rounded-3xl shadow-xl bg-gradient-to-t from-black-opacity-80 to-transparent p-5 m-5 relative">
        <h2 className="text-center font-orbitron text-xl mb-4 absolute top-8 left-10">
          {t(film.title)}
        </h2>
        <img
          src="/images/generic/img_generic_movie.jpeg"
          alt={t('film')}
          className="w-full object-cover rounded-tr-3xl rounded-tl-3xl"
        />
        <div className="p-4 navbar-gradient">
          <article className="ml-5 flex-col font-robotoMono">
            <p>
              <strong className="text-mikado-yellow">{t('episode')}: </strong>
              {film.episode_id}
            </p>
            <p>
              <strong className="text-mikado-yellow">{t('director')}: </strong>
              {film.director}
            </p>
            <br />
            <p>
              <strong className="text-mikado-yellow">{t('characters')}:</strong>
            </p>
          </article>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {characters.map((character) => (
              <SimpleCharacterCard key={character.url} character={character} />
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default FilmDetail;
