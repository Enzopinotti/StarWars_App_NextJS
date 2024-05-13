import React from 'react';
import Link from 'next/link';

const FilmCard = ({ film }) => {
  return (
    <Link href={`/films/${film.episode_id}`}>
      
        <div className="relative rounded-3xl shadow-xl overflow-hidden m-5 cursor-pointer">
          <div className="absolute top-0 left-0 right-0 flex justify-between items-center px-4 py-2 bg-black-opacity-80 border-b border-mikado-yellow">
            <span className="text-white font-orbitron">Capítulo</span>
            <span className="text-mikado-yellow font-orbitron text-lg">{film.episode_id}</span>
          </div>
          <img src="/images/generic/img_generic_movie.jpeg" alt={film.title} className="w-full object-cover" style={{ height: '300px' }}/>
          <div className="p-5 bg-gradient-to-t from-black-opacity-80 to-transparent">
            <h3 className="text-center text-white font-robotoMono text-xl mb-4">{film.title}</h3>
          </div>
        </div>
      
    </Link>
  );
};

export default FilmCard;