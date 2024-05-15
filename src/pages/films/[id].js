import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useTranslation } from 'react-i18next';
import SimpleCharacterCard from '../../components/SimpleCharacterCard';
import Head from 'next/head';

const FilmDetail = () => {
  const router = useRouter();
  const { id } = router.query;
  const { t } = useTranslation();
  const [film, setFilm] = useState(null);
  const [characters, setCharacters] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFilm = async () => {
      if (id) {
        const response = await fetch(`https://swapi.dev/api/films/${id}/`);
        const data = await response.json();
        setFilm(data);
        fetchCharacters(data.characters);
      }
    };

    const fetchCharacters = async (characterUrls) => {
      const promises = characterUrls.map(url => fetch(url).then(res => res.json()));
      const characterData = await Promise.all(promises);
      setCharacters(characterData);
      setLoading(false);
    };

    fetchFilm();
  }, [id]);

  if (loading) {
    return <div className="h-screen flex justify-center items-center">
      <p className="text-white font-orbitron">{t('loading')}...</p>
    </div>;
  }

  if (!film) {
    return <div className="h-screen flex justify-center items-center">
      <p className="text-white font-orbitron">{t('film_not_found')}</p>
    </div>;
  }

  return (

    <>
      <Head>
        <title>{`${film.title} | Star Wars')}`}</title>
      </Head>
      <div className="text-white rounded-3xl shadow-xl bg-gradient-to-t from-black-opacity-80 to-transparent p-5 m-5 relative">
        <h2 className="text-center font-orbitron text-xl mb-4 absolute top-8 left-10">{t(film.title)}</h2>
        <img src="/images/generic/img_generic_movie.jpeg" alt={t('film')} className="w-full object-cover rounded-tr-3xl rounded-tl-3xl" />
        <div className="p-4 navbar-gradient">
          <article className='ml-5 flex-col font-robotoMono'>
            <p><strong className='text-mikado-yellow'>{t('episode')}: </strong>{film.episode_id}</p>
            <p><strong className='text-mikado-yellow'>{t('director')}: </strong>{film.director}</p>
            <br></br>
            <p><strong className='text-mikado-yellow'>{t('characters')}:</strong></p>
          </article>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {characters.map(character => (
              <SimpleCharacterCard key={character.url} character={character} />
            ))}
          </div>
        </div>
      </div>
    </>
    
  );
};

export default FilmDetail;
