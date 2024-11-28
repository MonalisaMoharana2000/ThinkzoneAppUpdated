import React, {useEffect, useRef, useMemo, useState} from 'react';
import {FlatList, TouchableOpacity, View, Text, Dimensions} from 'react-native';
import CarouselImage from './CarouselImage';

const {width} = Dimensions.get('window');

const ImageSlider = ({imageSlider, handlePageChange}) => {
  const flatListRef = useRef(null);
  const currentIndex = useRef(0);
  const [visibleIndex, setVisibleIndex] = useState(0);

  useEffect(() => {
    if (imageSlider.length === 0) return; // Don't set up interval if there's no images

    const interval = setInterval(() => {
      currentIndex.current = (currentIndex.current + 1) % imageSlider.length;
      flatListRef.current?.scrollToIndex({
        index: currentIndex.current,
        animated: true,
      });
    }, 3000); // Change this duration as needed

    return () => clearInterval(interval); // Cleanup on component unmount
  }, [imageSlider.length]);

  const onViewableItemsChanged = useRef(({viewableItems}) => {
    if (viewableItems.length > 0) {
      setVisibleIndex(viewableItems[0].index); // Set the visible index
    }
  }).current;

  // Memoize the renderItem for performance
  const renderItem = useMemo(
    () =>
      ({item}) =>
        (
          <TouchableOpacity onPress={() => handlePageChange(item?.navigateTo)}>
            <View
              style={{
                width: width - 40, // Width adjustment for each image
                overflow: 'hidden', // Prevent any overflow issues
              }}>
              <CarouselImage data={item.mediaUrl} />
            </View>
          </TouchableOpacity>
        ),
    [handlePageChange],
  );

  return (
    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
      <FlatList
        ref={flatListRef}
        data={imageSlider}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        renderItem={renderItem}
        keyExtractor={(item, index) => index.toString()}
        snapToAlignment="center"
        snapToInterval={width - 40 + 10} // Snap to the width of the item plus separator
        decelerationRate="fast" // Smooth scrolling with fast deceleration
        bounces={false} // Prevent bouncing at the edges
        style={{width, marginLeft: '10%'}} // Set width for FlatList
        contentContainerStyle={{
          paddingHorizontal: 40, // Equal space on sides
        }}
        ItemSeparatorComponent={() => (
          <View style={{width: 20, marginLeft: 25}} />
        )} // Gap between items
        onScrollToIndexFailed={info => {
          console.warn('Index failed to scroll: ', info); // Handle failed index scroll
        }}
        initialNumToRender={5} // Render a few items initially for better performance
        maxToRenderPerBatch={5} // Limit the number of items rendered at once
        windowSize={10} // Preload 10 items in the viewport
        onViewableItemsChanged={onViewableItemsChanged} // Track visible index
      />

      {/* Display Dots Navigation Below the Slider */}
      <View style={{flexDirection: 'row', marginBottom: -8}}>
        {imageSlider.map((_, index) => (
          <View
            key={index}
            style={{
              width: 7,
              height: 7,
              borderRadius: 4,
              margin: 4,
              backgroundColor: index === visibleIndex ? '#000' : '#ccc', // Highlight active dot
            }}
          />
        ))}
      </View>
    </View>
  );
};

export default ImageSlider;
