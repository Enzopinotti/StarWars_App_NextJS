import React from 'react';
import Head from 'next/head';
import { useTranslation } from 'react-i18next';
import FilmCard from '../../components/FilmCard';
import { getFilms } from '../../lib/swapi.mjs';

export async function getServerSideProps(context) {
  try {
    const films = await getFilms();

    return {
      props: {
        films: films.sort((a, b) => a.episode_id - b.episode_id),
        upstreamError: false,
      },
    };
  } catch {
    context.res.statusCode = 503;
    return {
      props: {
        films: [],
        upstreamError: true,
      },
    };
  }
}

const FilmsPage = ({ films, upstreamError }) => {
  const { t } = useTranslation();

  if (upstreamError) {
    return (
      <div className="h-screen flex justify-center items-center">
        <p className="text-white font-orbitron">{t('dataSourceError')}</p>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>Films | Star Wars</title>
      </Head>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-10 p-8">
        {films.map((film) => (
          <FilmCard key={film.episode_id} film={film} />
        ))}
      </div>
    </>
  );
};

export default FilmsPage;
