import React from 'react';
import FilmCard from '../../components/FilmCard';
import Head from 'next/head';

export async function getServerSideProps() {
  const res = await fetch('https://swapi.dev/api/films/');
  const data = await res.json();
  return {
    props: {
      films: data.results.sort((a, b) => a.episode_id - b.episode_id),
    },
  };
}

const FilmsPage = ({ films }) => (
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

export default FilmsPage;
