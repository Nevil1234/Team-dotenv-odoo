import React, { useState } from 'react';
import { StyleSheet, View, Text, FlatList, TouchableOpacity, Image, Alert, SafeAreaView, Dimensions, Platform, StatusBar } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { getProductImage } from '../../utils/images/productImages';

const { width } = Dimensions.get('window');

// Mock data for cart items - would typically come from context/state/API
const MOCK_CART_ITEMS = [
  {
    id: '1',
    product: {
      id: '1',
      title: 'Vintage Leather Jacket',
      description: 'Authentic vintage leather jacket in excellent condition. Size M.',
      price: 75.00,
      category: 'Clothing',
      imageUrl: { uri: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8bGVhdGhlciUyMGphY2tldHxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=500&q=60' },
      userId: 'user1'
    },
    quantity: 1
  },
  {
    id: '2',
    product: {
      id: '2',
      title: 'Mid-Century Modern Chair',
      description: 'Authentic mid-century modern chair in teak. Some patina but structurally sound.',
      price: 120.00,
      category: 'Furniture',
      imageUrl: { uri: 'https://images.unsplash.com/photo-1611486212557-88be5ff6f941?auto=format&fit=crop&w=500&h=500&q=80' },
      userId: 'user1'
    },
    quantity: 1
  },
    {
    id: '3',
    product: {
      id: '3',
      title: 'Vintage Leather',
      description: 'Authentic vintage leather jacket in excellent condition. Size M.',
      price: 75.00,
      category: 'Clothing',
      imageUrl: { uri: 'https://images.unsplash.com/photo-1509113590018-7e0f14a640ba?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OHx8bGVhdGhlciUyMGphY2tldHxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=500&q=60' },
      userId: 'user1'
    },
    quantity: 1
  }
];

export default function Cart() {
  const [cartItems, setCartItems] = useState(MOCK_CART_ITEMS);
  const router = useRouter();
  const insets = useSafeAreaInsets();

  // Calculate total
  const totalPrice = cartItems.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);

  const handleRemoveItem = (id) => {
    setCartItems(cartItems.filter(item => item.id !== id));
  };

  const handleQuantityChange = (id, change) => {
    setCartItems(cartItems.map(item => {
      if (item.id === id) {
        const newQuantity = Math.max(1, item.quantity + change);
        return { ...item, quantity: newQuantity };
      }
      return item;
    }));
  };

  const handleCheckout = () => {
    // In a real app, this would process the order
    Alert.alert('Order Placed', 'Your order has been placed successfully!', [
      { 
        text: 'OK', 
        onPress: () => {
          setCartItems([]);
          router.push('/');
        }
      }
    ]);
  };

  const renderCartItem = ({ item }: { item: any }) => (
    <View style={styles.cartItem}>
      <View style={styles.cardShadow}>
        <View style={styles.imageContainer}>
          <Image 
            source={item.product.imageUrl || getProductImage(item.product.title, item.product.category)}
            style={styles.productImage}
            resizeMode="cover"
          />
          <View style={styles.imageOverlay} />
        </View>
        
        <View style={styles.itemInfo}>
          <View style={styles.itemHeader}>
            <Text style={styles.itemTitle} numberOfLines={2}>{item.product.title}</Text>
            <TouchableOpacity 
              style={styles.removeButton}
              onPress={() => handleRemoveItem(item.id)}
            >
              <Ionicons name="close-circle" size={24} color="#FF5722" />
            </TouchableOpacity>
          </View>
          
          <Text style={styles.itemCategory}>{item.product.category}</Text>
          <Text style={styles.itemPrice}>₹{item.product.price.toFixed(2)}</Text>
          
          <View style={styles.quantityContainer}>
            <Text style={styles.quantityLabel}>Quantity:</Text>
            <View style={styles.quantityControls}>
              <TouchableOpacity 
                style={[styles.quantityButton, styles.decreaseButton]}
                onPress={() => handleQuantityChange(item.id, -1)}
              >
                <Ionicons name="remove" size={16} color="white" />
              </TouchableOpacity>
              
              <View style={styles.quantityDisplay}>
                <Text style={styles.quantityText}>{item.quantity}</Text>
              </View>
              
              <TouchableOpacity 
                style={[styles.quantityButton, styles.increaseButton]}
                onPress={() => handleQuantityChange(item.id, 1)}
              >
                <Ionicons name="add" size={16} color="white" />
              </TouchableOpacity>
            </View>
          </View>
          
          <View style={styles.itemTotal}>
            <Text style={styles.itemTotalLabel}>Subtotal:</Text>
            <Text style={styles.itemTotalPrice}>₹{(item.product.price * item.quantity).toFixed(2)}</Text>
          </View>
        </View>
      </View>
    </View>
  );

  return (
    <View style={[styles.container]}>
      <View style={[styles.header, { marginTop: insets.top }]}>
        <TouchableOpacity 
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={24} color="#2E7D32" />
        </TouchableOpacity>
        <Text style={styles.title}>Shopping Cart</Text>
        <Text style={styles.itemCount}>{cartItems.length} {cartItems.length === 1 ? 'item' : 'items'}</Text>
      </View>
      
      {cartItems.length > 0 ? (
        <View style={styles.mainContent}>
          <View style={styles.cartListContainer}>
            <FlatList
              data={cartItems}
              renderItem={renderCartItem}
              keyExtractor={(item) => item.id}
              contentContainerStyle={styles.cartList}
              showsVerticalScrollIndicator={true}
              bounces={true}
              removeClippedSubviews={false}
              initialNumToRender={cartItems.length}
              ListFooterComponent={() => (
                <View style={[styles.summary]}>
                  <View style={styles.summaryCard}>
                    <View style={styles.summaryHeader}>
                      <Ionicons name="receipt-outline" size={24} color="#2E7D32" />
                      <Text style={styles.summaryTitle}>Order Summary</Text>
                    </View>
                    
                    <View style={styles.summaryRow}>
                      <Text style={styles.summaryLabel}>Subtotal ({cartItems.length} items)</Text>
                      <Text style={styles.summaryValue}>₹{totalPrice.toFixed(2)}</Text>
                    </View>
                    
                    <View style={styles.summaryRow}>
                      <Text style={styles.summaryLabel}>Shipping</Text>
                      <Text style={styles.summaryValue}>Free</Text>
                    </View>
                    
                    <View style={styles.divider} />
                    
                    <View style={styles.totalRow}>
                      <Text style={styles.totalLabel}>Total</Text>
                      <Text style={styles.totalPrice}>₹{totalPrice.toFixed(2)}</Text>
                    </View>
                    
                    <TouchableOpacity 
                      style={styles.checkoutButton}
                      onPress={handleCheckout}
                      activeOpacity={0.8}
                    >
                      <Ionicons name="card" size={20} color="white" style={styles.checkoutIcon} />
                      <Text style={styles.checkoutButtonText}>Proceed to Checkout</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              )}
            />
          </View>
        </View>
      ) : (
        <View style={styles.emptyState}>
          <View style={styles.emptyIconContainer}>
            <Ionicons name="cart-outline" size={80} color="#E0E0E0" />
          </View>
          <Text style={styles.emptyStateTitle}>Your cart is empty</Text>
          <Text style={styles.emptyStateDescription}>Discover amazing sustainable products{'\n'}and add them to your cart</Text>
          
          <TouchableOpacity 
            style={styles.shopNowButton}
            onPress={() => router.push('/')}
            activeOpacity={0.8}
          >
            <Ionicons name="storefront" size={20} color="white" style={styles.shopIcon} />
            <Text style={styles.shopNowButtonText}>Start Shopping</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  mainContent: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: '#F8F9FA',
  },
  cartListContainer: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    marginBottom: 8,
  },
  backButton: {
    padding: 8,
    marginRight: 8,
    borderRadius: 20,
    backgroundColor: '#F8F9FA',
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1A1A1A',
    flex: 1,
  },
  itemCount: {
    fontSize: 14,
    color: '#2E7D32',
    backgroundColor: '#E8F5E8',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    overflow: 'hidden',
    fontWeight: '600',
  },
  cartList: {
    paddingHorizontal: 12,
    paddingTop: 12,
    paddingBottom: 0,
  },
  cartItem: {
    marginBottom: 12,
    marginHorizontal: 8,
  },
  cardShadow: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 10,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    borderWidth: 1,
    borderColor: '#F0F0F0',
    flexDirection: 'row',
    alignItems: 'center',
  },
  imageContainer: {
    width: 70,
    height: 70,
    borderRadius: 10,
    backgroundColor: '#F5F5F5',
    overflow: 'hidden',
    position: 'relative',
    marginRight: 12,
  },
  productImage: {
    width: '100%',
    height: '100%',
  },
  imageOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(46, 125, 50, 0.05)',
  },
  itemInfo: {
    flex: 1,
    marginLeft: 2,
  },
  itemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 6,
  },
  itemTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1A1A1A',
    flex: 1,
    marginRight: 8,
    lineHeight: 20,
  },
  itemCategory: {
    fontSize: 13,
    color: '#666',
    marginBottom: 4,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  itemPrice: {
    fontSize: 18,
    fontWeight: '700',
    color: '#2E7D32',
    marginBottom: 12,
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  quantityLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#666',
  },
  quantityControls: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  quantityButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  decreaseButton: {
    backgroundColor: '#FF5722',
  },
  increaseButton: {
    backgroundColor: '#2E7D32',
  },
  quantityDisplay: {
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginHorizontal: 12,
  },
  quantityText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1A1A1A',
  },
  removeButton: {
    padding: 4,
  },
  itemTotal: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
  },
  itemTotalLabel: {
    fontSize: 14,
    color: '#666',
  },
  itemTotalPrice: {
    fontSize: 16,
    fontWeight: '700',
    color: '#2E7D32',
  },
  summary: {
    backgroundColor: 'white',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    width: width, // Use full screen width
    marginLeft: -12, // Compensate for parent padding
    marginTop: 12,
  },
  summaryCard: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
    paddingBottom: 90, // Add extra padding for bottom tab navigation
  },
  summaryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  summaryTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1A1A1A',
    marginLeft: 8,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  summaryLabel: {
    fontSize: 14,
    color: '#666',
  },
  summaryValue: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1A1A1A',
  },
  divider: {
    height: 1,
    backgroundColor: '#E0E0E0',
    marginVertical: 12,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  totalLabel: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1A1A1A',
  },
  totalPrice: {
    fontSize: 24,
    fontWeight: '700',
    color: '#2E7D32',
  },
  checkoutButton: {
    backgroundColor: '#2E7D32',
    height: 56,
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4,
    shadowColor: '#2E7D32',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  checkoutIcon: {
    marginRight: 8,
  },
  checkoutButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 40,
  },
  emptyIconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#F5F5F5',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  emptyStateTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1A1A1A',
    marginBottom: 12,
  },
  emptyStateDescription: {
    fontSize: 16,
    textAlign: 'center',
    color: '#666',
    lineHeight: 24,
    marginBottom: 32,
  },
  shopNowButton: {
    backgroundColor: '#2E7D32',
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#2E7D32',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  shopIcon: {
    marginRight: 8,
  },
  shopNowButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
});
