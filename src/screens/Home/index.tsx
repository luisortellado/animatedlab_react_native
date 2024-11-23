import React, {Suspense, useEffect, useState} from 'react';
import {ActivityIndicator, FlatList, ListRenderItem, View} from 'react-native';

import {styles} from './styles';
import PokemonCard from '../../components/PokemonCard';
import Carousel from '../../components/Carrousel';

interface Pokemon {
  name: string;
  url: string;
}

export function Home() {
  const [pokemons, setPokemons] = useState<Pokemon[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [page, setPage] = useState<number>(0);
  const [loadingMore, setLoadingMore] = useState<boolean>(false);

  const fetchPokemons = async (offset: number) => {
    try {
      const response = await fetch(
        `https://pokeapi.co/api/v2/pokemon?offset=${offset}&limit=20`,
      );
      const data = await response.json();
      return data.results;
    } catch (error) {
      console.error(error);
      return [];
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const loadInitialPokemons = async () => {
      const results = await fetchPokemons(0);
      setPokemons(results);
      setLoading(false);
    };

    loadInitialPokemons();
  }, []);

  const loadMorePokemons = async () => {
    if (loadingMore) {
      return;
    }
    setLoadingMore(true);
    const nextOffset = (page + 1) * 20;
    const morePokemons = await fetchPokemons(nextOffset);
    setPokemons(prevPokemons => [...prevPokemons, ...morePokemons]);
    setPage(prevPage => prevPage + 1);
    setLoadingMore(false);
  };

  const renderItem: ListRenderItem<Pokemon> = ({item}) => (
    <PokemonCard name={item.name} url={item.url} />
  );

  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#00ff00" />
      </View>
    );
  }
  return (
    <View style={styles.container}>
      <Suspense fallback={<ActivityIndicator size="large" color="#ff0000" />}>
        <FlatList
          data={pokemons}
          keyExtractor={item => item.name}
          ListHeaderComponent={
            <Carousel
              images={[
                'https://raw.githubusercontent.com/HybridShivam/Pokemon/master/assets/images/001.png',
                'https://raw.githubusercontent.com/HybridShivam/Pokemon/master/assets/images/002.png',
                'https://raw.githubusercontent.com/HybridShivam/Pokemon/master/assets/images/003.png',
              ]}
            />
          }
          renderItem={renderItem}
          onEndReached={loadMorePokemons}
          onEndReachedThreshold={0.5}
          ListFooterComponent={
            loadingMore ? (
              <ActivityIndicator size="small" color="#00ff00" />
            ) : null
          }
        />
      </Suspense>
    </View>
  );
}
