import React from 'react';
import CharacterListContainer from '../../components/CharacterList/CharacterListContainer';
import CharacterFilter from '../../components/CharacterFilter';
import Head from 'next/head';

const CharactersPage = () => {
  return (
    <>
      <Head>
        <title>Characters | Star Wars</title>
      </Head>
      <CharacterFilter />
      <CharacterListContainer />
    </>
  );
};

export default CharactersPage;
