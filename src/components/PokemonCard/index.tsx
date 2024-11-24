import React, {useState, useEffect, memo} from 'react';
import {Text} from 'react-native';
import FastImage from 'react-native-fast-image';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from 'react-native-reanimated';

import {styles} from './styles';

interface PokemonCardProps {
  name: string;
  url: string;
}

const PokemonCard: React.FC<PokemonCardProps> = memo(({name, url}) => {
  const [imageUrl, setImageUrl] = useState<string>('');
  const opacity = useSharedValue(0);
  const translateY = useSharedValue(20);

  useEffect(() => {
    opacity.value = withTiming(1, {duration: 2000});
    translateY.value = withTiming(0, {duration: 2000});

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [url]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{translateY: translateY.value}],
  }));

  return (
    <Animated.View style={[styles.card, animatedStyle]}>
      <FastImage
        style={styles.image}
        source={{uri: imageUrl}}
        resizeMode={FastImage.resizeMode.contain}
      />
      <Text style={styles.name}>{name.toUpperCase()}</Text>
    </Animated.View>
  );
});

export default PokemonCard;
