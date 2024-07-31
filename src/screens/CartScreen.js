import React, { useContext } from 'react';
import { View, Text, FlatList, Image, Pressable, TouchableOpacity, Button } from 'react-native';
import { CartContext } from '../context/CartContext'; // Adjust path as needed
import Icon from 'react-native-vector-icons/Ionicons';

export default function CartScreen({ navigation }) {
  const { cartItems, removeFromCart, increaseQuantity, decreaseQuantity } = useContext(CartContext);

  const calculateTotalPrice = () => {
    console.log('Calculating total price...');
    const total = cartItems.reduce((total, item) => {
      const itemPrice = parseFloat(item.price) || 0; // Ensure price is a number
      const itemQuantity = parseInt(item.quantity, 10) || 0; // Ensure quantity is an integer
      return total + (itemPrice * itemQuantity);
    }, 0);
    console.log('Total price:', total);
    return total.toFixed(2);
  };

  return (
    <View className="flex-1 p-4">
      {cartItems.length === 0 ? (
        <View className="flex-1 justify-center items-center">
          <Text className="font-bold mb-4 text-center text-lg">
            Your Cart is Empty
          </Text>
          <Button
            title="Let's do some shopping"
            onPress={() => navigation.navigate('Products')}
          />
        </View>
      ) : (
        <>
          <FlatList
            data={cartItems}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <View className="flex-row w-full bg-white shadow-md rounded p-2 mb-4">
                <Image
                  className="w-1/4 h-24 rounded mr-4"
                  source={{ uri: item.image }}
                  resizeMode="cover"
                />
                <View className="flex-1 flex-col justify-between relative">
                  <Text className="font-bold text-lg">{item.title.slice(0, 20)}</Text>
                  <Text className="text-gray-700 mt-1 capitalize text-xs">{item.category}</Text>
                  <Text className="text-gray-500 my-1 capitalize text-sm">{item.description.slice(0, 25)}...</Text>
                  <Text className="font-bold mb-2 text-lg">₹{item.price}</Text>
                  
                  <View className="flex-row items-center mb-2">
                    <TouchableOpacity
                      onPress={() => {
                        console.log('Decreasing quantity for:', item);
                        decreaseQuantity(item);
                      }}
                      className="bg-gray-200 px-2 rounded"
                    >
                      <Text className="text-lg">-</Text>
                    </TouchableOpacity>
                    <Text className="mx-2 text-lg">{item.quantity}</Text>
                    <TouchableOpacity
                      onPress={() => {
                        console.log('Increasing quantity for:', item);
                        increaseQuantity(item);
                      }}
                      className="bg-gray-200 px-2 rounded"
                    >
                      <Text className="text-lg">+</Text>
                    </TouchableOpacity>
                  </View>
                  
                  <Pressable onPress={() => removeFromCart(item)} className="absolute top-2 right-2">
                    <Icon name="close" size={25} color="#000" />
                  </Pressable>
                </View>
              </View>
            )}
          />
          <View className="bg-white p-4 shadow-md rounded mt-4">
            <Text className="font-bold text-lg mb-2">Cart Summary</Text>
            <View className="flex-row justify-between mb-2">
              <Text className="text-gray-700">Total Items:</Text>
              <Text className="font-bold">{cartItems.reduce((total, item) => total + (item.quantity || 0), 0)}</Text>
            </View>
            <View className="flex-row justify-between mb-2">
              <Text className="text-gray-700">Total Price:</Text>
              <Text className="font-bold">₹{calculateTotalPrice()}</Text>
            </View>
            <Button
              title={`Proceed to Checkout (₹${calculateTotalPrice()})`}
              onPress={() => navigation.navigate('Checkout')}
            />
          </View>
        </>
      )}
    </View>
  );
}
