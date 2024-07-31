import React, { useState } from 'react';
import { View, Text, TextInput, Button, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('mor_2314');
  const [password, setPassword] = useState('83r5^_');
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({
    email: '',
    password: '',
  });

  const handleLogin = async () => {
    let valid = true;
    let errorMessages = { email: '', password: '' };

    // Validate Email
    if (!email) {
      errorMessages.email = 'Email is required';
      valid = false;
    } 

    // Validate Password
    if (password.length < 6) {
      errorMessages.password = 'Password must be at least 6 characters long';
      valid = false;
    }

    setErrors(errorMessages);

    if (valid) {
      try {
        const response = await fetch('https://fakestoreapi.com/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username: email, password }),
        });

        const responseBody = await response.text();

        if (response.ok) {
          const jsonResponse = JSON.parse(responseBody);
          if (jsonResponse.token) {
            navigation.navigate('Products'); 
          } else {
            setErrors({ ...errors, password: 'Unexpected response format' });
          }
        } else {
          if (response.status === 401) {
            setErrors({ ...errors, password: 'Invalid username or password' });
          } else {
            setErrors({ ...errors, password: 'An unexpected error occurred' });
          }
        }
      } catch (err) {
        setErrors({ ...errors, password: 'An error occurred. Please try again.' });
      }
    }
  };

  return (
    <View className="flex-1 justify-center p-6 bg-gray-100">
      <View className="bg-white p-6 rounded-lg shadow-lg">
        <Text className="text-2xl font-bold mb-4 text-center text-gray-800">Login</Text>

        <TextInput
          className="h-12 border border-gray-300 px-4 mb-4 rounded-lg"
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
        />
        {errors.email ? <Text className="text-red-500 mb-2">{errors.email}</Text> : null}

        <View className="relative mb-4">
          <TextInput
            className="h-12 border border-gray-300 px-4 rounded-lg"
            placeholder="Password"
            secureTextEntry={!showPassword}
            value={password}
            onChangeText={setPassword}
          />
          <TouchableOpacity
            onPress={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-3"
          >
            <Icon name={showPassword ? 'eye-off' : 'eye'} size={24} color="gray" />
          </TouchableOpacity>
        </View>
        {errors.password ? <Text className="text-red-500 mb-4">{errors.password}</Text> : null}

        <Button title="Login" onPress={handleLogin} color="#007BFF" />

        <View className="mt-6">
          <Text className="text-center text-gray-700">
            Not a user?{' '}
            <TouchableOpacity onPress={() => navigation.navigate('Signup')}>
              <Text className="text-blue-600 font-semibold">Sign Up here</Text>
            </TouchableOpacity>
          </Text>
        </View>
      </View>
    </View>
  );
}
