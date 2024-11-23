import React from 'react';
import {Dimensions} from 'react-native';
import Animated, {
  useAnimatedStyle,
  interpolate,
  SharedValue,
} from 'react-native-reanimated';
import {styles} from './styles';

const {width} = Dimensions.get('window');

interface CarouselItemProps {
  item: string;
  index: number;
  scrollX: SharedValue<number>;
}

const CarouselItem: React.FC<CarouselItemProps> = ({item, index, scrollX}) => {
  const imageAnimatedStyle = useAnimatedStyle(() => {
    const imageWidth = interpolate(
      scrollX.value,
      [
        (index - 1) * width, // Previous image
        index * width, // Actual image
        (index + 1) * width, // Next image
      ],
      [150, 300, 150], // Dynamic size: smaller on the sides, larger in the center
    );

    const imageHeight = interpolate(
      scrollX.value,
      [(index - 1) * width, index * width, (index + 1) * width],
      [50, 300, 50],
    );
    const opacity = interpolate(
      scrollX.value,
      [(index - 1) * width, index * width, (index + 1) * width],
      [0.3, 1, 0.3],
    );
    return {
      width: imageWidth,
      height: imageHeight,
      opacity,
    };
  });

  return (
    <Animated.View style={styles.itemContainer}>
      <Animated.Image
        source={{uri: item}}
        style={[styles.image, imageAnimatedStyle]}
      />
    </Animated.View>
  );
};

export default CarouselItem;
