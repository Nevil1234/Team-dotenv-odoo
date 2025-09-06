import React, { useState } from 'react';
import { StyleSheet, View, Text, FlatList, Image, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

// Mock data for previous purchases - would come from API in a real app
const MOCK_PURCHASES = [
  {
    id: 'p1',
    product: {
      id: '2',
      title: 'iPhone 12 Pro',
      description: 'Used iPhone 12 Pro, 128GB, Pacific Blue. Minor scratches but works perfectly.',
      price: 550.00,
      category: 'Electronics',
      imageUrl: null,
      userId: 'user2'
    },
    date: '2025-08-15',
    quantity: 1
  },
  {
    id: 'p2',
    product: {
      id: '5',
      title: 'Harry Potter Book Set',
      description: 'Complete Harry Potter book series. Hardcover edition with minimal wear.',
      price: 65.00,
      category: 'Books',
      imageUrl: null,
      userId: 'user2'
    },
    date: '2025-07-28',
    quantity: 1
  }
];

export default function Purchases() {
  const [purchases] = useState(MOCK_PURCHASES);
  const router = useRouter();

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const renderPurchaseItem = ({ item }) => (
    <TouchableOpacity 
      style={styles.purchaseItem}
      onPress={() => router.push(`/product/${item.product.id}`)}
    >
      <View style={styles.imageContainer}>
        <Image 
          source={require('../../assets/images/splash-icon.png')}
          style={styles.productImage}
          resizeMode="cover"
        />
      </View>
      
      <View style={styles.itemInfo}>
        <Text style={styles.itemTitle} numberOfLines={1}>{item.product.title}</Text>
        <Text style={styles.itemPrice}>${item.product.price.toFixed(2)}</Text>
        <Text style={styles.itemDate}>Purchased on {formatDate(item.date)}</Text>
      </View>
      
      <Ionicons name="chevron-forward" size={24} color="#BDBDBD" />
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Purchase History</Text>
      
      {purchases.length > 0 ? (
        <FlatList
          data={purchases}
          renderItem={renderPurchaseItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.purchasesList}
        />
      ) : (
        <View style={styles.emptyState}>
          <Ionicons name="bag-handle-outline" size={80} color="#BDBDBD" />
          <Text style={styles.emptyStateTitle}>No purchases yet</Text>
          <Text style={styles.emptyStateDescription}>
            Your purchase history will appear here
          </Text>
          
          <TouchableOpacity 
            style={styles.shopNowButton}
            onPress={() => router.push('/')}
          >
            <Text style={styles.shopNowButtonText}>Shop Now</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  purchasesList: {
    flexGrow: 1,
  },
  purchaseItem: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
    paddingVertical: 16,
  },
  imageContainer: {
    width: 70,
    height: 70,
    borderRadius: 8,
    backgroundColor: '#F5F5F5',
    marginRight: 16,
    overflow: 'hidden',
  },
  productImage: {
    width: '100%',
    height: '100%',
  },
  itemInfo: {
    flex: 1,
  },
  itemTitle: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 4,
  },
  itemPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2E7D32',
    marginBottom: 4,
  },
  itemDate: {
    fontSize: 14,
    color: '#757575',
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyStateTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 24,
    marginBottom: 8,
  },
  emptyStateDescription: {
    fontSize: 16,
    textAlign: 'center',
    color: '#757575',
    marginBottom: 32,
    maxWidth: '80%',
  },
  shopNowButton: {
    backgroundColor: '#2E7D32',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  shopNowButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '500',
  },
});
