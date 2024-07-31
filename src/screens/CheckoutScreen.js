import React, { useState, useContext } from 'react';
import { View, Text, TextInput, Modal, Pressable } from 'react-native';
import ConfettiCannon from 'react-native-confetti-cannon';
import { CartContext } from '../context/CartContext';

export default function CheckoutScreen({ navigation }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [number, setNumber] = useState('');
  const [address, setAddress] = useState('');
  const [success, setSuccess] = useState(false);
  const [errors, setErrors] = useState({});
  const { cartItems, clearCart } = useContext(CartContext);

  const validateForm = () => {
    const newErrors = {};
    if (!name.trim()) newErrors.name = 'Name is required';
    if (!email.trim() || !/\S+@\S+\.\S+/.test(email)) newErrors.email = 'Valid email is required';
    if (!number.trim() || !/^\d{10}$/.test(number)) newErrors.number = 'Valid phone number is required';
    if (!address.trim()) newErrors.address = 'Address is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleCheckout = () => {
    if (validateForm()) {
      setSuccess(true);
      clearCart();
    }
  };

  const calculateTotalPrice = () => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0).toFixed(2);
  };

  return (
    <View className="flex-1 p-6 bg-gray-100">
      <View className="bg-white p-4 rounded-lg shadow-md">
        <Text className="text-lg font-semibold mb-2">Personal Information</Text>
        <TextInput
          className={`h-12 border ${errors.name ? 'border-red-500' : 'border-gray-300'} mb-3 px-4 rounded`}
          placeholder="Name"
          value={name}
          onChangeText={setName}
        />
        {errors.name && <Text className="text-red-500 mb-2">{errors.name}</Text>}
        
        <TextInput
          className={`h-12 border ${errors.email ? 'border-red-500' : 'border-gray-300'} mb-3 px-4 rounded`}
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
        />
        {errors.email && <Text className="text-red-500 mb-2">{errors.email}</Text>}
        
        <TextInput
          className={`h-12 border ${errors.number ? 'border-red-500' : 'border-gray-300'} mb-3 px-4 rounded`}
          placeholder="Phone Number"
          value={number}
          onChangeText={setNumber}
          keyboardType="numeric"
        />
        {errors.number && <Text className="text-red-500 mb-2">{errors.number}</Text>}
        
        <TextInput
          className={`h-12 border ${errors.address ? 'border-red-500' : 'border-gray-300'} mb-3 px-4 rounded`}
          placeholder="Address"
          value={address}
          onChangeText={setAddress}
        />
        {errors.address && <Text className="text-red-500 mb-2">{errors.address}</Text>}
      </View>

      <View className="bg-white p-4 mt-4 rounded-lg shadow-md">
        <Text className="text-lg font-semibold mb-2">Order Summary</Text>
        {cartItems.map(item => (
          <View key={item.id} className="flex-row justify-between mb-2 items-center">
            <View className="flex-row items-center w-4/5">
              <Text className="text-gray-700 flex-1">{item.title}</Text>
              <Text className="text-gray-700 mx-2">x{item.quantity}</Text>
            </View>
            <Text className="text-gray-700 w-1/5 text-right">₹{(item.price * item.quantity).toFixed(2)}</Text>
          </View>
        ))}
        <View className="flex-row justify-between border-t border-gray-300 pt-2">
          <Text className="text-gray-700 font-bold">Total:</Text>
          <Text className="text-gray-700 font-bold">₹{calculateTotalPrice()}</Text>
        </View>
        <Text className="text-gray-700 mt-2">Payment Method: Cash on Delivery</Text>
      </View>

      <Pressable onPress={handleCheckout} className="bg-blue-500 py-3 px-4 rounded mt-4">
        <Text className="text-white text-center text-base">Place Order</Text>
      </Pressable>

      {success && (
        <Modal
          animationType="slide"
          transparent={true}
          visible={success}
          onRequestClose={() => setSuccess(false)}
        >
          <View className="flex-1 justify-center items-center bg-gray-900 bg-opacity-75">
            <View className="bg-white p-6 rounded-lg shadow-md relative">
              <Text className="text-2xl font-bold mb-4 text-center">Order Placed!</Text>
              <Text className="text-center mb-4">Your order has been placed successfully.</Text>

              <Pressable
                onPress={() => { setSuccess(false); navigation.navigate('Products'); }}
                className="bg-blue-500 py-3 px-4 rounded mb-4"
              >
                <Text className="text-white text-center text-base">OK</Text>
              </Pressable>
              <ConfettiCannon
                count={200}
                origin={{ x: 0, y: 0 }}
                fadeOut={true}
                autoStart={true}
                duration={3000}
                style={{ position: 'absolute', width: '100%', height: '100%' }}
              />
            </View>
          </View>
        </Modal>
      )}
    </View>
  );
}
