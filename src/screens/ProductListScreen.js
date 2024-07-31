import React, { useState, useEffect, useContext } from 'react';
import { View, Text, FlatList, TextInput, Image, ScrollView, TouchableOpacity, Pressable } from 'react-native';
import { getProducts, getCategories } from '../api/api';
import { CartContext } from '../context/CartContext';
import Icon from 'react-native-vector-icons/Ionicons';


export default function ProductListScreen({ navigation }) {

  useEffect(() => {
    navigation.setOptions({
      headerLeft: () => null,
    });
  }, [navigation]);

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState(['All']);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [priceRange, setPriceRange] = useState('All');
  const [sortOrder, setSortOrder] = useState('None');
  const [error, setError] = useState(null);
  const [filtersVisible, setFiltersVisible] = useState(false);
  const { addToCart, removeFromCart, cartItems, addToWishlist, removeFromWishlist, wishlistItems } = useContext(CartContext);

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, [priceRange, sortOrder]);

  const fetchProducts = async () => {
    try {
      const response = await getProducts();
      if (Array.isArray(response)) {
        setProducts(response);
      } else {
        console.error('Invalid products data format');
        setError('Invalid products data format');
        setProducts([]);
      }
    } catch (error) {
      console.error('Failed to fetch products:', error);
      setError('Failed to fetch products');
      setProducts([]);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await getCategories();
      if (Array.isArray(response)) {
        setCategories(['All', ...response]);
      } else {
        console.error('Invalid categories data format');
        setError('Invalid categories data format');
        setCategories(['All']);
      }
    } catch (error) {
      console.error('Failed to fetch categories:', error);
      setError('Failed to fetch categories');
      setCategories(['All']);
    }
  };

  const filteredProducts = products.filter(product =>
    product.title.toLowerCase().includes(search.toLowerCase()) &&
    (selectedCategory === 'All' || product.category === selectedCategory) &&
    (priceRange === 'All' || (priceRange === '0-100' && product.price <= 100) || (priceRange === '100-500' && product.price > 100 && product.price <= 500) || (priceRange === '500+' && product.price > 500))
  );

  const sortedProducts = (() => {
    switch (sortOrder) {
      case 'Price Low to High':
        return [...filteredProducts].sort((a, b) => a.price - b.price);
      case 'Price High to Low':
        return [...filteredProducts].sort((a, b) => b.price - a.price);
      default:
        return filteredProducts;
    }
  })();

  return (
    <View className="flex-1 p-4 bg-gray-100">
      {error && <Text className="text-red-500 mb-4">{error}</Text>}
      
      <TextInput
        className="h-12 border border-gray-300 mb-4 px-4 rounded bg-white"
        placeholder="Search products"
        value={search}
        onChangeText={setSearch}
      />
      
      <View className="flex-row items-center mb-4">
        <ScrollView horizontal showsHorizontalScrollIndicator={false} className="flex-1">
          {categories.map((category, index) => (
            <TouchableOpacity
              key={index}
              className={`border border-gray-300 rounded mr-2 p-3 ${selectedCategory === category ? 'bg-gray-300' : 'bg-white'}`}
              onPress={() => setSelectedCategory(category)}
            >
              <Text className="text-center text-sm capitalize">{category}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
        
        <Pressable onPress={() => setFiltersVisible(!filtersVisible)} className="ml-4">
          <Icon name='filter' size={24} color="#000" />
        </Pressable>
      </View>
      
      {filtersVisible && (
        <View className="mb-4">
          <View className="flex-row mb-4">
            <View className="flex-1">
              <Text className="font-bold text-lg mb-2">Price Range</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                {['All', '0-100', '100-500', '500+'].map(range => (
                  <TouchableOpacity
                    key={range}
                    className={`border border-gray-300 rounded mr-2 p-2 ${priceRange === range ? 'bg-gray-300' : 'bg-white'}`}
                    onPress={() => setPriceRange(range)}
                  >
                    <Text className="text-center text-sm">{range}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
            <View className="flex-1">
              <Text className="font-bold text-lg mb-2">Sort By</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                {['None', 'Price Low to High', 'Price High to Low'].map(option => (
                  <TouchableOpacity
                    key={option}
                    className={`border border-gray-300 rounded mr-2 p-2 ${sortOrder === option ? 'bg-gray-300' : 'bg-white'}`}
                    onPress={() => setSortOrder(option)}
                  >
                    <Text className="text-center text-sm">{option}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          </View>
        </View>
      )}
      
      <FlatList
        data={sortedProducts}
        keyExtractor={(item) => item.id.toString()}
        numColumns={2}
        columnWrapperStyle={{ justifyContent: 'space-between', marginBottom: 16 }}
        renderItem={({ item }) => {
          const isInCart = cartItems.some(cartItem => cartItem.id === item.id);
          const isInWishlist = wishlistItems.some(wishlistItem => wishlistItem.id === item.id);
          return (
            <View className="relative w-[47.5%]">
              <View className="p-2 bg-white shadow-md rounded">
                <Image
                  className="w-full h-48 rounded"
                  source={{ uri: item.image }}
                  resizeMode="cover"
                  onError={() => console.error('Failed to load image:', item.image)}
                />
                <Pressable
                  onPress={() => isInWishlist ? removeFromWishlist(item) : addToWishlist(item)}
                  className="absolute top-2 right-2"
                >
                  <Icon name={isInWishlist ? 'heart' : 'heart-outline'} size={24} color='red' />
                </Pressable>
                <Text className="text-gray-700 mt-1 capitalize text-xs">{item.category}</Text>
                <Text className="font-bold text-lg">{item.title.slice(0, 20)}</Text>
                <Text className="text-gray-500 my-1 text-sm">{item.description.slice(0, 25)}...</Text>
                <Text className="font-bold mb-2 text-lg">₹{item.price}</Text>
                <TouchableOpacity
                  onPress={() => isInCart ? removeFromCart(item) : addToCart(item)}
                  className={`py-2 px-4 rounded ${isInCart ? 'bg-red-500' : 'bg-blue-500'}`}
                >
                  <Text className={`text-white text-center ${isInCart ? 'font-normal' : 'font-bold'}`}>
                    {isInCart ? 'Remove from Cart' : 'Add to Cart'}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          );
        }}
      />
      {cartItems.length === 0?'':( <TouchableOpacity className="bg-blue-500 py-3 px-4 rounded  "onPress={() => navigation.navigate('Cart')}  >
        <Text className="text-white text-center text-base">
        {`Go to Cart (${cartItems.length})`}
        </Text>
       </TouchableOpacity>)

      }
      
     
    </View>
  );
}