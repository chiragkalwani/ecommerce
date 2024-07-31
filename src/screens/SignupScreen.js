import React, { useState } from 'react';
import { View, Text, TextInput, Button, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

export default function SignUpScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone, setPhone] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    phone: '',
  });

  const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const validatePhone = (phone) => /^\d{10}$/.test(phone);

  const handleSignUp = async () => {
    let valid = true;
    let errorMessages = {
      email: '',
      password: '',
      firstName: '',
      lastName: '',
      phone: '',
    };

    if (!validateEmail(email)) {
      errorMessages.email = 'Invalid email format';
      valid = false;
    }
    if (password.length < 6) {
      errorMessages.password = 'Password must be at least 6 characters long';
      valid = false;
    }
    if (!firstName) {
      errorMessages.firstName = 'First name is required';
      valid = false;
    }
    if (!lastName) {
      errorMessages.lastName = 'Last name is required';
      valid = false;
    }
    if (!validatePhone(phone)) {
      errorMessages.phone = 'Phone number must be 10 digits';
      valid = false;
    }

    setErrors(errorMessages);

    if (valid) {
      try {
        const response = await fetch('https://fakestoreapi.com/users', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email,
            username: email, // Using email as username
            password,
            name: { firstname: firstName, lastname: lastName },
            phone,
          }),
        });

        const textResponse = await response.text();

        if (response.ok) {
          const json = JSON.parse(textResponse);
          if (json.id) {
            navigation.navigate('Products'); 
          } else {
            setErrors({ ...errors, email: 'Unexpected response format' });
          }
        } else {
          setErrors({ ...errors, email: 'Sign-up failed' });
        }
      } catch (err) {
        setErrors({ ...errors, password: 'An error occurred. Please try again.' });
      }
    }
  };

  return (
    <View className="flex-1 justify-center p-6 bg-gray-100">
      <View className="bg-white p-6 rounded-lg shadow-lg mx-4 sm:mx-auto" style={{ maxWidth: 500 }}>
        <Text className="text-2xl font-bold mb-4 text-center text-gray-800">Sign Up</Text>

        <View className="flex flex-row mb-4">
          <TextInput
            className="h-12 border border-gray-300 px-4 flex-1 mr-2 rounded-lg"
            placeholder="First Name"
            value={firstName}
            onChangeText={setFirstName}
          />
          <TextInput
            className="h-12 border border-gray-300 px-4 flex-1 rounded-lg"
            placeholder="Last Name"
            value={lastName}
            onChangeText={setLastName}
          />
        </View>
        {errors.firstName || errors.lastName ? (
          <Text className="text-red-500 mb-2 text-center">{errors.firstName || errors.lastName}</Text>
        ) : null}

        <TextInput
          className="h-12 border border-gray-300 px-4 mb-2 rounded-lg"
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
        />
        {errors.email ? <Text className="text-red-500 mb-2 text-center">{errors.email}</Text> : null}

        <TextInput
          className="h-12 border border-gray-300 px-4 mb-2 rounded-lg"
          placeholder="Phone Number"
          value={phone}
          onChangeText={setPhone}
          keyboardType="numeric"
        />
        {errors.phone ? <Text className="text-red-500 mb-2 text-center">{errors.phone}</Text> : null}

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
        {errors.password ? <Text className="text-red-500 mb-4 text-center">{errors.password}</Text> : null}

        <Button title="Sign Up" onPress={handleSignUp} color="#007BFF" />

        <View className="mt-6">
          <Text className="text-center text-gray-700">
            Already have an account?{' '}
            <TouchableOpacity onPress={() => navigation.navigate('Login')}>
              <Text className="text-blue-600 font-semibold">Login here</Text>
            </TouchableOpacity>
          </Text>
        </View>
      </View>
    </View>
  );
}
