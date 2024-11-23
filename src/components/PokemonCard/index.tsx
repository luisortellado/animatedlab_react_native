import React, {useState, useEffect, memo} from 'react';
import {View, Text} from 'react-native';
import FastImage from 'react-native-fast-image';

import {styles} from './styles';

interface PokemonCardProps {
  name: string;
  url: string;
}

const PokemonCard: React.FC<PokemonCardProps> = memo(({name, url}) => {
  const [imageUrl, setImageUrl] = useState<string>('');

  useEffect(() => {
    const fetchPokemonDetails = async () => {
      try {
        const response = await fetch(url);
        const data = await response.json();
        setImageUrl(data.sprites.front_default);
      } catch (error) {
        console.error(error);
      }
    };

    fetchPokemonDetails();
  }, [url]);

  return (
    <View style={styles.card}>
      <FastImage
        style={styles.image}
        source={{uri: imageUrl}}
        resizeMode={FastImage.resizeMode.contain}
      />
      <Text style={styles.name}>{name.toUpperCase()}</Text>
    </View>
  );
});

export default PokemonCard;
