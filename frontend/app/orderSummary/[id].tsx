import { Ionicons } from '@expo/vector-icons';
import * as Print from 'expo-print';
import { useLocalSearchParams, useRouter } from 'expo-router';
import * as Sharing from 'expo-sharing';
import React, { useEffect, useState } from 'react';
import {
    Alert,
    Image,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';

// Define the Order type
type Seller = {
  id: string;
  name: string;
  rating: number;
};

type Product = {
  id: string;
  title: string;
  description: string;
  price: number;
  category: string;
  imageUrl: string | null;
  userId: string;
};

type Order = {
  id: string;
  product: Product;
  seller: Seller;
  date: string;
  quantity: number;
  shippingAddress: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  paymentMethod: {
    type: string;
    last4?: string;
  };
  status: string;
  orderNumber: string;
  totalAmount: number;
};

// Mock data for orders
const MOCK_ORDERS: Record<string, Order> = {
  'p1': {
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
    seller: {
      id: 'user2',
      name: 'John Doe',
      rating: 4.8
    },
    date: '2025-08-15',
    quantity: 1,
    shippingAddress: {
      street: '123 Main Street',
      city: 'San Francisco',
      state: 'CA',
      zipCode: '94105',
      country: 'USA'
    },
    paymentMethod: {
      type: 'Credit Card',
      last4: '4242'
    },
    status: 'Delivered',
    orderNumber: 'ODR-2025-08001',
    totalAmount: 550.00
  },
  'p2': {
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
    seller: {
      id: 'user2',
      name: 'Emily Smith',
      rating: 4.6
    },
    date: '2025-07-28',
    quantity: 2,
    shippingAddress: {
      street: '456 Market Street',
      city: 'San Francisco',
      state: 'CA',
      zipCode: '94105',
      country: 'USA'
    },
    paymentMethod: {
      type: 'PayPal'
    },
    status: 'Delivered',
    orderNumber: 'ODR-2025-07045',
    totalAmount: 130.00
  }
};

export default function OrderSummary() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id && typeof id === 'string') {
      if (MOCK_ORDERS[id]) {
        setOrder(MOCK_ORDERS[id]);
      } else {
        setError('Order not found');
      }
    } else {
      setError('Invalid order ID');
    }
    setLoading(false);
  }, [id]);

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const handleDownloadReceipt = async (orderNumber: string) => {
    try {
      if (!order) return;
      
      const { product, seller, date, quantity, shippingAddress, paymentMethod, totalAmount } = order;
      
      // Create HTML content for the PDF
      const htmlContent = `
        <html>
          <head>
            <style>
              body {
                font-family: 'Helvetica', sans-serif;
                margin: 0;
                padding: 20px;
                color: #333333;
              }
              .header {
                text-align: center;
                padding-bottom: 20px;
                border-bottom: 1px solid #EEEEEE;
              }
              .logo {
                font-size: 24px;
                font-weight: bold;
                color: #2E7D32;
              }
              .receipt-title {
                font-size: 20px;
                margin: 20px 0 10px;
              }
              .order-number {
                font-size: 14px;
                color: #4B5563;
              }
              .section {
                margin: 20px 0;
                padding-bottom: 15px;
                border-bottom: 1px solid #EEEEEE;
              }
              .section-title {
                font-size: 16px;
                font-weight: bold;
                margin-bottom: 10px;
              }
              .item {
                display: flex;
                justify-content: space-between;
                margin-bottom: 5px;
              }
              .total {
                font-weight: bold;
                margin-top: 10px;
              }
              .address, .payment {
                margin-bottom: 20px;
              }
              .footer {
                text-align: center;
                font-size: 12px;
                color: #4B5563;
                margin-top: 40px;
              }
            </style>
          </head>
          <body>
            <div class="header">
              <div class="logo">Green Market</div>
              <div class="receipt-title">Order Receipt</div>
              <div class="order-number">Order #: ${orderNumber}</div>
              <div class="order-date">Date: ${formatDate(date)}</div>
            </div>
            
            <div class="section">
              <div class="section-title">Item Purchased</div>
              <div class="item">
                <div>${product.title} (${product.category}) x ${quantity}</div>
                <div>$${product.price.toFixed(2)}/each</div>
              </div>
              <div style="margin-top: 10px;">
                <div style="font-size: 11px; font-weight: bold; color: #2E7D32; margin-bottom: 4px;">SELLER</div>
                <div style="font-size: 13px; color: #333333;">${seller.name} <span style="color: #4B5563; font-size: 12px;">(Rating: ${seller.rating}/5)</span></div>
              </div>
            </div>
            
            <div class="section">
              <div class="section-title">Order Summary</div>
              <div class="item">
                <div>Item(s) Subtotal:</div>
                <div>$${(product.price * quantity).toFixed(2)}</div>
              </div>
              <div class="item">
                <div>Shipping:</div>
                <div>Free</div>
              </div>
              <div class="item total">
                <div>Total:</div>
                <div>$${totalAmount.toFixed(2)}</div>
              </div>
            </div>
            
            <div class="section">
              <div class="section-title">Shipping Address</div>
              <div class="address">
                ${shippingAddress.street}<br>
                ${shippingAddress.city}, ${shippingAddress.state} ${shippingAddress.zipCode}<br>
                ${shippingAddress.country}
              </div>
            </div>
            
            <div class="section">
              <div class="section-title">Payment Method</div>
              <div class="payment">
                ${paymentMethod.type} ${paymentMethod.last4 ? `ending in ${paymentMethod.last4}` : ''}
              </div>
            </div>
            
            <div class="footer">
              Thank you for your purchase! For any questions, please contact support.
            </div>
          </body>
        </html>
      `;
      
      // Generate the PDF
      const { uri } = await Print.printToFileAsync({
        html: htmlContent,
        base64: false
      });
      
      // Check if sharing is available
      const isSharingAvailable = await Sharing.isAvailableAsync();
      
      if (isSharingAvailable) {
        // Share the PDF
        await Sharing.shareAsync(uri, {
          mimeType: 'application/pdf',
          dialogTitle: `Order Receipt - ${orderNumber}`,
          UTI: 'com.adobe.pdf'
        });
      } else {
        Alert.alert('Sharing not available', 'Sharing is not available on your device');
      }
    } catch (error) {
      console.error('Error generating or sharing PDF:', error);
      Alert.alert('Error', 'There was an error generating your receipt. Please try again.');
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.loadingContainer}>
          <Ionicons name="hourglass-outline" size={40} color="#2E7D32" />
          <Text style={styles.loadingText}>Loading order details...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (error || !order) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.errorContainer}>
          <Ionicons name="alert-circle-outline" size={48} color="#FF5722" />
          <Text style={styles.errorText}>{error || 'An error occurred'}</Text>
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={20} color="#FFFFFF" />
            <Text style={styles.backButtonText}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const { product, seller, date, quantity, shippingAddress, paymentMethod, status, orderNumber, totalAmount } = order;

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButtonContainer} onPress={() => router.back()}>
            <Ionicons name="chevron-back" size={24} color="#2E7D32" />
            <Text style={styles.backText}>Back</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Order Details</Text>
          <View style={{ width: 40 }} />
        </View>

        {/* Status Banner */}
        <View style={[styles.statusBanner, {
          backgroundColor: status === 'Delivered' ? '#2E7D32' : '#FF9800',
        }]}>
          <Text style={styles.statusText}>{status}</Text>
          <Text style={styles.orderNumberText}>Order #{orderNumber}</Text>
        </View>

        {/* Product Details */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Item Purchased</Text>
          <View style={styles.productContainer}>
            <Image
              source={require('../../assets/images/splash-icon.png')}
              style={styles.productImage}
              resizeMode="cover"
            />
            <View style={styles.productDetails}>
              <Text style={styles.productTitle}>{product.title}</Text>
              <Text style={styles.productCategory}>{product.category}</Text>
              <Text style={styles.productPrice}>${product.price.toFixed(2)}</Text>
              <Text style={styles.productQuantity}>Qty: {quantity}</Text>
              
              {/* Seller Info within Product Card */}
              <View style={styles.divider} />
              <View style={styles.sellerTag}>
                <Text style={styles.sellerTagText}>SELLER</Text>
              </View>
              <View style={styles.sellerInfoCompact}>
                <Ionicons name="person" size={16} color="#2E7D32" style={styles.sellerIcon} />
                <Text style={styles.sellerNameCompact}>{seller.name}</Text>
                <View style={styles.ratingContainerCompact}>
                  <Ionicons name="star" size={14} color="#F59E0B" />
                  <Text style={styles.ratingTextCompact}>{seller.rating}</Text>
                </View>
              </View>
            </View>
          </View>
        </View>

        {/* Order Summary */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Order Summary</Text>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>Date Purchased</Text>
            <Text style={styles.summaryValue}>{formatDate(date)}</Text>
          </View>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>Item Price</Text>
            <Text style={styles.summaryValue}>${product.price.toFixed(2)} x {quantity}</Text>
          </View>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>Shipping</Text>
            <Text style={styles.summaryValue}>Free</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.summaryItem}>
            <Text style={styles.totalLabel}>Total Amount</Text>
            <Text style={styles.totalValue}>${totalAmount.toFixed(2)}</Text>
          </View>
        </View>



        {/* Shipping Information */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Shipping Address</Text>
          <View style={styles.addressContainer}>
            <Ionicons name="location" size={20} color="#2E7D32" style={styles.addressIcon} />
            <View>
              <Text style={styles.addressText}>{shippingAddress.street}</Text>
              <Text style={styles.addressText}>
                {shippingAddress.city}, {shippingAddress.state} {shippingAddress.zipCode}
              </Text>
              <Text style={styles.addressText}>{shippingAddress.country}</Text>
            </View>
          </View>
        </View>

        {/* Payment Method */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Payment Method</Text>
          <View style={styles.paymentContainer}>
            <Ionicons
              name={paymentMethod.type === 'Credit Card' ? 'card' : 'logo-paypal'}
              size={24}
              color="#2E7D32"
              style={styles.paymentIcon}
            />
            <Text style={styles.paymentText}>
              {paymentMethod.type} {paymentMethod.last4 ? `ending in ${paymentMethod.last4}` : ''}
            </Text>
          </View>
        </View>

        {/* Actions */}
        <View style={styles.actionsContainer}>
          <TouchableOpacity 
            style={styles.actionButton} 
            onPress={() => handleDownloadReceipt(order.orderNumber)}
          >
            <Ionicons name="document-text" size={20} color="#FFFFFF" />
            <Text style={styles.actionButtonText}>Download Receipt</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  loadingText: {
    fontSize: 16,
    color: '#2E7D32',
    marginTop: 12,
    fontWeight: '500',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
    backgroundColor: '#FFFFFF',
  },
  errorText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FF5722',
    marginBottom: 24,
    textAlign: 'center',
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2E7D32',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  backButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    marginLeft: 8,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
    marginTop: 12, // Fix for header position
  },
  backButtonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#2E7D32',
    marginLeft: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#333333',
  },
  statusBanner: {
    padding: 16,
    alignItems: 'center',
    marginHorizontal: 16,
    marginVertical: 16,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  statusText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 4,
  },
  orderNumberText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '500',
  },
  section: {
    backgroundColor: '#FFFFFF',
    marginBottom: 16,
    padding: 20,
    borderRadius: 8,
    marginHorizontal: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333333',
    marginBottom: 16,
  },
  productContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  productImage: {
    width: 100,
    height: 100,
    borderRadius: 8,
    marginRight: 16,
    backgroundColor: '#F5F5F5',
  },
  productDetails: {
    flex: 1,
  },
  productTitle: {
    fontSize: 18,
    fontWeight: '500',
    color: '#333333',
    marginBottom: 4,
  },
  productCategory: {
    fontSize: 14,
    color: '#4B5563', // Updated for better contrast
    marginBottom: 4,
  },
  productPrice: {
    fontSize: 16,
    fontWeight: '700',
    color: '#2E7D32', // Updated to match app theme
    marginBottom: 4,
  },
  productQuantity: {
    fontSize: 14,
    color: '#4B5563', // Updated for better contrast
    marginBottom: 8,
  },
  sellerTag: {
    marginTop: 4,
    marginBottom: 4,
  },
  sellerTagText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#2E7D32',
    letterSpacing: 1,
  },
  sellerInfoCompact: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  sellerIcon: {
    marginRight: 6,
  },
  sellerNameCompact: {
    fontSize: 13,
    fontWeight: '500',
    color: '#333333',
    marginRight: 10,
  },
  ratingContainerCompact: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingTextCompact: {
    fontSize: 13,
    color: '#4B5563',
    marginLeft: 4,
    fontWeight: '500',
  },
  summaryItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
  },
  summaryLabel: {
    fontSize: 14,
    color: '#4B5563', // Slightly darker gray for better contrast
    fontWeight: '500',
  },
  summaryValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333333', // Updated for consistency
  },
  divider: {
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    marginVertical: 12,
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1F2937',
  },
  totalValue: {
    fontSize: 16,
    fontWeight: '700',
    color: '#2E7D32', // Updated to match app theme
  },
  sellerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  sellerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sellerAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#E8F5E9', // Lighter green to match theme
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  sellerDetails: {
    flex: 1,
  },
  sellerName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333333',
    marginBottom: 4,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingText: {
    fontSize: 14,
    color: '#4B5563', // Updated for better contrast
    marginLeft: 8,
    fontWeight: '500',
  },
  contactButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  contactButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#2E7D32', // Updated to match app theme
    marginLeft: 8,
  },
  addressContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  addressIcon: {
    marginRight: 12,
    marginTop: 2,
  },
  addressText: {
    fontSize: 14,
    color: '#333333', // Updated for consistency
    lineHeight: 22,
  },
  paymentContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  paymentIcon: {
    marginRight: 12,
  },
  paymentText: {
    fontSize: 14,
    color: '#333333', // Updated for consistency
    fontWeight: '500',
  },
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingHorizontal: 16,
    paddingVertical: 20,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#EEEEEE',
  },
  actionButton: {
    width: '95%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#2E7D32', // Updated to match app theme
    paddingVertical: 14,
    borderRadius: 8,
    marginHorizontal: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  actionButtonText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#FFFFFF',
    marginLeft: 8,
  },
});