import React, { useContext } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { CartProvider, CartContext } from './src/context/CartContext';
import LoginScreen from './src/screens/LoginScreen';
import SignupScreen from './src/screens/SignupScreen';
import ProductListScreen from './src/screens/ProductListScreen';
import CartScreen from './src/screens/CartScreen';
import CheckoutScreen from './src/screens/CheckoutScreen';
import WishlistScreen from './src/screens/Wishlist';
import { View, Text, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

const Stack = createStackNavigator();

function CartIcon({ navigation }) {
  const { cartItems } = useContext(CartContext);
  const cartCount = cartItems.length;

  return (
    <TouchableOpacity onPress={() => navigation.navigate('Cart')} style={{ marginRight: 20 }}>
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <Icon name="cart" size={25} color="#000" />
        {cartCount > 0 && (
          <View
            style={{
              position: 'absolute',
              right: -10,
              top: -10,
              backgroundColor: 'red',
              borderRadius: 10,
              width: 20,
              height: 20,
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <Text style={{ color: 'white', fontSize: 12 }}>{cartCount}</Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
}

function WishlistIcon({ navigation }) {
  const { wishlistItems } = useContext(CartContext);
  const wishlistCount = wishlistItems.length;

  return (
    <TouchableOpacity onPress={() => navigation.navigate('Wishlist')} style={{ marginRight: 20 }}>
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <Icon name="heart-outline" size={25} color="#000" />
        {wishlistCount > 0 && (
          <View
            style={{
              position: 'absolute',
              right: -10,
              top: -10,
              backgroundColor: 'red',
              borderRadius: 10,
              width: 20,
              height: 20,
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <Text style={{ color: 'white', fontSize: 12 }}>{wishlistCount}</Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
}

export default function App() {
  return (
    <CartProvider>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Login">
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Signup" component={SignupScreen} />
          <Stack.Screen
            name="Products"
            component={ProductListScreen}
            options={({ navigation }) => ({
              headerRight: () => (
                <View style={{ flexDirection: 'row' }}>
                  <CartIcon navigation={navigation} />
                  <WishlistIcon navigation={navigation} />
                </View>
              ),
            })}
          />
          <Stack.Screen name="Cart" component={CartScreen} />
          <Stack.Screen name="Checkout" component={CheckoutScreen} />
          <Stack.Screen name="Wishlist" component={WishlistScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </CartProvider>
  );
}
