import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

const FilmDetail = () => {
  const router = useRouter();
  const { id } = router.query;
  const { t } = useTranslation();
  const [film, setFilm] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      fetch(`https://swapi.dev/api/films/${id}/`)
        .then(response => response.json())
        .then(data => {
          setFilm(data);
          setLoading(false);
        });
    }
  }, [id]);

  if (loading) {
    return <div className="h-screen flex justify-center items-center">
      <p className="text-white font-orbitron">Cargando detalles del film...</p>
    </div>;
  }

  if (!film) {
    return <div className="h-screen flex justify-center items-center">
      <p className="text-white font-orbitron">Film no encontrado.</p>
    </div>;
  }

  return (
    <div className="text-white rounded-3xl shadow-xl bg-gradient-to-t from-black-opacity-80 to-transparent p-5 m-5">
      <h2 className="text-center font-robotoMono text-xl mb-4">{film.title}</h2>
      <img src="/images/generic/img_generic_movie.jpeg" alt={film.title} className="w-full object-cover rounded-tr-3xl rounded-tl-3xl" />
      <div className="p-4">
        <p><strong>{t('episode')}: </strong>{film.episode_id}</p>
        <p><strong>{t('director')}: </strong>{film.director}</p>
        <p><strong>{t('characters')}:</strong></p>
        <ul>
          {film.characters.map(url => (
            <li key={url}>
              <Link href={`/characters/${url.match(/people\/(\d+)\//)[1]}`}>
                <p>Character Details</p>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default FilmDetail;