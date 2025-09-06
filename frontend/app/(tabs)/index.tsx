import React, { useState } from 'react';
import { StyleSheet, View, Text, FlatList, TextInput, TouchableOpacity, Image, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

// Mock data for products - would come from API in a real app
const MOCK_PRODUCTS = [
  {
    id: '1',
    title: 'Vintage Leather Jacket',
    description: 'Authentic vintage leather jacket in excellent condition. Size M.',
    price: 75.00,
    category: 'Clothing',
    imageUrl: null, // We'll use a placeholder
    userId: 'user1'
  },
  {
    id: '2',
    title: 'iPhone 12 Pro',
    description: 'Used iPhone 12 Pro, 128GB, Pacific Blue. Minor scratches but works perfectly.',
    price: 550.00,
    category: 'Electronics',
    imageUrl: null,
    userId: 'user2'
  },
  {
    id: '3',
    title: 'Mid-Century Modern Chair',
    description: 'Authentic mid-century modern chair in teak. Some patina but structurally sound.',
    price: 120.00,
    category: 'Furniture',
    imageUrl: null,
    userId: 'user1'
  },
  {
    id: '4',
    title: 'Mountain Bike - Trek',
    description: 'Trek mountain bike, 29" wheels, hydraulic disc brakes. Well maintained.',
    price: 380.00,
    category: 'Sports',
    imageUrl: null,
    userId: 'user3'
  },
  {
    id: '5',
    title: 'Harry Potter Book Set',
    description: 'Complete Harry Potter book series. Hardcover edition with minimal wear.',
    price: 65.00,
    category: 'Books',
    imageUrl: null,
    userId: 'user2'
  }
];

// Categories for filtering
const CATEGORIES = [
  'All',
  'Clothing',
  'Electronics',
  'Furniture',
  'Books',
  'Sports',
  'Other'
];

export default function Index() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const router = useRouter();

  // Filter products based on search query and selected category
  const filteredProducts = MOCK_PRODUCTS.filter(product => {
    const matchesSearch = product.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Product item component
  const renderProduct = ({ item }) => (
    <TouchableOpacity 
      style={styles.productCard}
      onPress={() => router.push(`/product/${item.id}`)}
    >
      <View style={styles.imageContainer}>
        <Image 
          source={require('../../assets/images/splash-icon.png')}
          style={styles.productImage}
          resizeMode="cover"
        />
      </View>
      <View style={styles.productInfo}>
        <Text style={styles.productTitle} numberOfLines={1}>{item.title}</Text>
        <Text style={styles.productPrice}>${item.price.toFixed(2)}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color="#757575" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search products..."
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      {/* Categories */}
      <View style={styles.categoriesContainer}>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoriesScrollView}
        >
          {CATEGORIES.map((category) => (
            <TouchableOpacity
              key={category}
              style={[
                styles.categoryButton,
                selectedCategory === category && styles.categoryButtonSelected
              ]}
              onPress={() => setSelectedCategory(category)}
            >
              <Text 
                style={[
                  styles.categoryText,
                  selectedCategory === category && styles.categoryTextSelected
                ]}
              >
                {category}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Product List */}
      <FlatList
        data={filteredProducts}
        renderItem={renderProduct}
        keyExtractor={(item) => item.id}
        numColumns={2}
        contentContainerStyle={styles.productList}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Ionicons name="search-outline" size={50} color="#BDBDBD" />
            <Text style={styles.emptyStateText}>No products found</Text>
          </View>
        }
      />

      {/* Floating Action Button for adding new product */}
      <TouchableOpacity 
        style={styles.fab}
        onPress={() => router.push('/addProduct')}
      >
        <Ionicons name="add" size={24} color="white" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    marginHorizontal: 16,
    marginTop: 16,
    marginBottom: 8,
    borderRadius: 8,
    paddingHorizontal: 12,
    height: 50,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
  },
  categoriesContainer: {
    marginVertical: 8,
  },
  categoriesScrollView: {
    paddingHorizontal: 12,
  },
  categoryButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginHorizontal: 4,
    borderRadius: 20,
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  categoryButtonSelected: {
    backgroundColor: '#2E7D32',
    borderColor: '#2E7D32',
  },
  categoryText: {
    fontSize: 14,
    color: '#757575',
  },
  categoryTextSelected: {
    color: 'white',
    fontWeight: '500',
  },
  productList: {
    padding: 8,
  },
  productCard: {
    flex: 1,
    margin: 8,
    backgroundColor: 'white',
    borderRadius: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    overflow: 'hidden',
  },
  imageContainer: {
    height: 140,
    backgroundColor: '#F5F5F5',
  },
  productImage: {
    width: '100%',
    height: '100%',
  },
  productInfo: {
    padding: 12,
  },
  productTitle: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 6,
  },
  productPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2E7D32',
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 60,
  },
  emptyStateText: {
    fontSize: 16,
    color: '#BDBDBD',
    marginTop: 12,
  },
  fab: {
    position: 'absolute',
    bottom: 24,
    right: 24,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#2E7D32',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
});
