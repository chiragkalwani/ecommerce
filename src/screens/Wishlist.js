// src/screens/WishlistScreen.js

import React, { useContext } from 'react';
import { View, Text, FlatList, TouchableOpacity, Image } from 'react-native';
import { CartContext } from '../context/CartContext';
import Icon from 'react-native-vector-icons/Ionicons';

export default function WishlistScreen({ navigation }) {
  const { wishlistItems, removeFromWishlist, addToCart } = useContext(CartContext);

  return (
    <View className="flex-1 p-4 bg-gray-100">
      <FlatList
        data={wishlistItems}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View className="flex-row bg-white p-4 mb-2 rounded shadow">
            <Image
              className="w-20 h-20 rounded"
              source={{ uri: item.image }}
              resizeMode="cover"
            />
            <View className="ml-4 flex-1">
              <Text className="font-bold text-lg">{item.title}</Text>
              <Text className="text-gray-500 mt-1">₹{item.price}</Text>
              <View className="flex-row mt-2">
                <TouchableOpacity
                  onPress={() => {
                    addToCart(item);
                    removeFromWishlist(item);
                  }}
                  className="bg-blue-500 p-2 rounded"
                >
                  <Text className="text-white">Add to Cart</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => removeFromWishlist(item)}
                  className="ml-2 bg-red-500 p-2 rounded"
                >
                  <Text className="text-white">Remove</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )}
      />
    </View>
  );
}
