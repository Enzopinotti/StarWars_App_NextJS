import React, { useEffect, useState } from 'react';
import FilmCard from '../../components/FilmCard';
import Head from 'next/head';
import { useTranslation } from 'react-i18next';

export async function getServerSideProps() {
  const res = await fetch('https://swapi.dev/api/films/');
  const data = await res.json();
  return {
    props: {
      films: data.results.sort((a, b) => a.episode_id - b.episode_id),
    },
  };
}

const FilmsPage = ({ films }) => {
  const { t, i18n } = useTranslation();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const handleLoaded = () => {
      setReady(true);
    };
    i18n.on('loaded', handleLoaded);
    i18n.loadNamespaces('translation', handleLoaded);

    return () => {
      i18n.off('loaded', handleLoaded);
    };
  }, [i18n]);

  if (!ready) {
    return <p>Loading translations...</p>;
  }
  return (
    <>
      <Head>
        <title>Films | Star Wars</title>
      </Head>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-10 p-8">
        {films.map(film => (
          <FilmCard key={film.episode_id} film={film} />
        ))}
      </div>
    </>
  );
};

export default FilmsPage;