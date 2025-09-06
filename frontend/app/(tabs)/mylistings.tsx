import React, { useState } from 'react';
import { StyleSheet, View, Text, FlatList, TouchableOpacity, Image, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

// Mock data for user's listings - would come from API in a real app
const MOCK_MY_LISTINGS = [
  {
    id: '1',
    title: 'Vintage Leather Jacket',
    description: 'Authentic vintage leather jacket in excellent condition. Size M.',
    price: 75.00,
    category: 'Clothing',
    imageUrl: null, // We'll use a placeholder
    userId: 'user1',
    status: 'active'
  },
  {
    id: '3',
    title: 'Mid-Century Modern Chair',
    description: 'Authentic mid-century modern chair in teak. Some patina but structurally sound.',
    price: 120.00,
    category: 'Furniture',
    imageUrl: null,
    userId: 'user1',
    status: 'active'
  },
  {
    id: '6',
    title: 'Polaroid Camera',
    description: 'Vintage Polaroid camera from the 1980s. Still works perfectly.',
    price: 40.00,
    category: 'Electronics',
    imageUrl: null,
    userId: 'user1',
    status: 'sold'
  }
];

export default function MyListings() {
  const [listings, setListings] = useState(MOCK_MY_LISTINGS);
  const router = useRouter();

  const handleDelete = (id) => {
    Alert.alert(
      'Delete Listing',
      'Are you sure you want to delete this listing?',
      [
        {
          text: 'Cancel',
          style: 'cancel'
        },
        {
          text: 'Delete',
          onPress: () => {
            // In a real app, this would make an API call to delete the listing
            setListings(listings.filter(item => item.id !== id));
          },
          style: 'destructive'
        }
      ]
    );
  };

  const renderListingItem = ({ item }) => (
    <View style={styles.listingItem}>
      <TouchableOpacity 
        style={styles.listingContent}
        onPress={() => router.push(`/product/${item.id}`)}
      >
        <View style={styles.imageContainer}>
          <Image 
            source={require('../../assets/images/splash-icon.png')}
            style={styles.productImage}
            resizeMode="cover"
          />
          {item.status === 'sold' && (
            <View style={styles.soldOverlay}>
              <Text style={styles.soldText}>SOLD</Text>
            </View>
          )}
        </View>
        
        <View style={styles.itemInfo}>
          <Text style={styles.itemTitle} numberOfLines={1}>{item.title}</Text>
          <Text style={styles.itemPrice}>${item.price.toFixed(2)}</Text>
          <Text style={styles.itemCategory}>{item.category}</Text>
        </View>
      </TouchableOpacity>
      
      <View style={styles.actionsContainer}>
        <TouchableOpacity 
          style={[styles.actionButton, styles.editButton]}
          onPress={() => router.push(`/editProduct/${item.id}`)}
        >
          <Ionicons name="create-outline" size={18} color="#2E7D32" />
          <Text style={styles.editButtonText}>Edit</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.actionButton, styles.deleteButton]}
          onPress={() => handleDelete(item.id)}
        >
          <Ionicons name="trash-outline" size={18} color="#FF5722" />
          <Text style={styles.deleteButtonText}>Delete</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>My Listings</Text>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => router.push('/addProduct')}
        >
          <Ionicons name="add" size={22} color="white" />
          <Text style={styles.addButtonText}>Add New</Text>
        </TouchableOpacity>
      </View>
      
      {listings.length > 0 ? (
        <FlatList
          data={listings}
          renderItem={renderListingItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listingsContainer}
        />
      ) : (
        <View style={styles.emptyState}>
          <Ionicons name="list" size={80} color="#BDBDBD" />
          <Text style={styles.emptyStateTitle}>No Listings Yet</Text>
          <Text style={styles.emptyStateDescription}>
            You haven't created any product listings yet
          </Text>
          
          <TouchableOpacity 
            style={styles.createListingButton}
            onPress={() => router.push('/addProduct')}
          >
            <Text style={styles.createListingButtonText}>Create Listing</Text>
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2E7D32',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
  addButtonText: {
    color: 'white',
    fontWeight: '500',
    marginLeft: 4,
  },
  listingsContainer: {
    paddingBottom: 20,
  },
  listingItem: {
    backgroundColor: 'white',
    borderRadius: 8,
    marginBottom: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#EEEEEE',
  },
  listingContent: {
    flexDirection: 'row',
    padding: 12,
  },
  imageContainer: {
    width: 80,
    height: 80,
    borderRadius: 8,
    backgroundColor: '#F5F5F5',
    marginRight: 16,
    overflow: 'hidden',
    position: 'relative',
  },
  productImage: {
    width: '100%',
    height: '100%',
  },
  soldOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  soldText: {
    color: 'white',
    fontWeight: 'bold',
  },
  itemInfo: {
    flex: 1,
    justifyContent: 'center',
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
  itemCategory: {
    fontSize: 14,
    color: '#757575',
  },
  actionsContainer: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: '#EEEEEE',
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
  },
  editButton: {
    borderRightWidth: 1,
    borderRightColor: '#EEEEEE',
  },
  deleteButton: {},
  editButtonText: {
    color: '#2E7D32',
    marginLeft: 8,
    fontWeight: '500',
  },
  deleteButtonText: {
    color: '#FF5722',
    marginLeft: 8,
    fontWeight: '500',
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
  createListingButton: {
    backgroundColor: '#2E7D32',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  createListingButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '500',
  },
});
