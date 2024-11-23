import React from 'react';
import {
  View,
  Dimensions,
  FlatList,
  StyleSheet,
  NativeScrollEvent,
  NativeSyntheticEvent,
} from 'react-native';
import {useSharedValue} from 'react-native-reanimated';
import CarouselItem from '../CarrouselItem';

const {width} = Dimensions.get('window');

// Tipos para las props del carrusel
interface CarouselProps {
  images: string[]; // Array de URLs de imágenes
}

const Carousel: React.FC<CarouselProps> = ({images}) => {
  const scrollX = useSharedValue(0); // Valor compartido para animación

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    scrollX.value = event.nativeEvent.contentOffset.x;
  };

  const handleMomentumScrollEnd = (
    event: NativeSyntheticEvent<NativeScrollEvent>,
  ) => {
    const offset = event.nativeEvent.contentOffset.x;
    const index = Math.round(offset / width); // Calcula el índice actual
    scrollX.value = index * width; // Ajusta el valor compartido
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={images}
        keyExtractor={(_, index) => index.toString()}
        horizontal
        pagingEnabled={false} // Deshabilitamos el comportamiento automático
        snapToInterval={width} // Asegura que cada imagen ocupe el ancho completo
        decelerationRate="fast" // Hace que el scroll sea más fluido y rápido
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
        onMomentumScrollEnd={handleMomentumScrollEnd} // Ajusta la posición final
        scrollEventThrottle={16} // Frecuencia de actualización
        bounces={true}
        renderItem={({item, index}) => (
          <CarouselItem item={item} index={index} scrollX={scrollX} />
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 300,
  },
});

export default Carousel;
