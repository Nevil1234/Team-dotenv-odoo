import React from 'react';
import { StyleSheet, View, Text, Image, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

// Mock data for products - would come from API in a real app
const MOCK_PRODUCTS = [
  {
    id: '1',
    title: 'Vintage Leather Jacket',
    description: 'Authentic vintage leather jacket in excellent condition. Size M. This jacket features premium leather that has developed a beautiful patina over time. The lining is intact with no tears, and all zippers work smoothly. A true vintage piece that will last for many more years to come.',
    price: 75.00,
    category: 'Clothing',
    imageUrl: null, // We'll use a placeholder
    userId: 'user1',
    seller: 'VintageFinds'
  },
  {
    id: '2',
    title: 'iPhone 12 Pro',
    description: 'Used iPhone 12 Pro, 128GB, Pacific Blue. Minor scratches but works perfectly. Battery health is at 88%. Comes with original charger and box. Screen has always had a protector on it. No hardware issues, selling because upgraded to newer model.',
    price: 550.00,
    category: 'Electronics',
    imageUrl: null,
    userId: 'user2',
    seller: 'TechRecycle'
  },
  {
    id: '3',
    title: 'Mid-Century Modern Chair',
    description: 'Authentic mid-century modern chair in teak. Some patina but structurally sound. This chair was manufactured in Denmark in the 1960s. The teak has developed a warm patina that only comes with age. The cushions have been recently reupholstered with high-quality fabric. A beautiful statement piece for any home.',
    price: 120.00,
    category: 'Furniture',
    imageUrl: null,
    userId: 'user1',
    seller: 'VintageFinds'
  },
  {
    id: '4',
    title: 'Mountain Bike - Trek',
    description: 'Trek mountain bike, 29" wheels, hydraulic disc brakes. Well maintained. This bike has been well taken care of and regularly serviced. It has a lightweight aluminum frame, Shimano gears, and hydraulic disc brakes for excellent stopping power. Perfect for trails or city riding.',
    price: 380.00,
    category: 'Sports',
    imageUrl: null,
    userId: 'user3',
    seller: 'ActiveLife'
  },
  {
    id: '5',
    title: 'Harry Potter Book Set',
    description: 'Complete Harry Potter book series. Hardcover edition with minimal wear. All seven books in the series, hardcover editions published by Scholastic. These books are in excellent condition with no writing, highlighting, or damage to the pages. Dust jackets are intact with minor shelf wear. A must-have for any Harry Potter fan!',
    price: 65.00,
    category: 'Books',
    imageUrl: null,
    userId: 'user2',
    seller: 'BookWorm'
  }
];

export default function ProductDetails() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  
  // Find the product with the matching ID
  const product = MOCK_PRODUCTS.find(p => p.id === id);
  
  if (!product) {
    return (
      <View style={styles.notFound}>
        <Text style={styles.notFoundText}>Product not found</Text>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.backLink}>Go back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const handleAddToCart = () => {
    // In a real app, this would add the product to a cart in state/context
    Alert.alert('Success', `${product.title} added to cart!`);
  };

  return (
    <ScrollView style={styles.container}>
      {/* Product Image */}
      <View style={styles.imageContainer}>
        <Image 
          source={require('../../assets/images/splash-icon.png')}
          style={styles.productImage}
          resizeMode="contain"
        />
      </View>
      
      {/* Product Info */}
      <View style={styles.productInfo}>
        <Text style={styles.title}>{product.title}</Text>
        <Text style={styles.price}>${product.price.toFixed(2)}</Text>
        
        <View style={styles.categoryContainer}>
          <Text style={styles.categoryLabel}>Category:</Text>
          <Text style={styles.category}>{product.category}</Text>
        </View>
        
        <View style={styles.sellerContainer}>
          <Ionicons name="person-circle-outline" size={20} color="#757575" />
          <Text style={styles.seller}>Sold by: {product.seller}</Text>
        </View>

        <View style={styles.descriptionContainer}>
          <Text style={styles.descriptionTitle}>Description</Text>
          <Text style={styles.description}>{product.description}</Text>
        </View>
      </View>
      
      {/* Action Buttons */}
      <View style={styles.actions}>
        <TouchableOpacity 
          style={styles.addToCartButton}
          onPress={handleAddToCart}
        >
          <Ionicons name="cart" size={20} color="white" />
          <Text style={styles.addToCartText}>Add to Cart</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  notFound: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  notFoundText: {
    fontSize: 18,
    marginBottom: 10,
  },
  backLink: {
    color: '#2E7D32',
    fontSize: 16,
  },
  imageContainer: {
    height: 300,
    backgroundColor: '#F5F5F5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  productImage: {
    width: '100%',
    height: '100%',
  },
  productInfo: {
    padding: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  price: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2E7D32',
    marginBottom: 16,
  },
  categoryContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  categoryLabel: {
    fontSize: 16,
    color: '#757575',
    marginRight: 8,
  },
  category: {
    fontSize: 16,
    fontWeight: '500',
  },
  sellerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  seller: {
    fontSize: 16,
    color: '#757575',
    marginLeft: 8,
  },
  descriptionContainer: {
    marginTop: 16,
  },
  descriptionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    color: '#424242',
  },
  actions: {
    padding: 16,
    marginBottom: 16,
  },
  addToCartButton: {
    backgroundColor: '#2E7D32',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 56,
    borderRadius: 8,
  },
  addToCartText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
});
