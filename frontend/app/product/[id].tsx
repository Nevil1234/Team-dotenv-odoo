import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Alert, Dimensions, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const { width } = Dimensions.get('window');

// Mock product data
const MOCK_PRODUCTS = [
  {
    id: '1',
    title: 'Vintage Leather Jacket',
    description: 'Authentic vintage leather jacket in excellent condition. Size M. Premium leather with a beautiful patina. Intact lining, smooth zippers. A timeless piece.',
    price: 75.00,
    category: 'Clothing',
    imageUrl: null,
    userId: 'user1',
    seller: 'VintageFinds'
  },
  {
    id: '2',
    title: 'iPhone 12 Pro',
    description: 'Used iPhone 12 Pro, 128GB, Pacific Blue. Minor scratches, 88% battery health. Includes charger and box. Perfectly functional.',
    price: 550.00,
    category: 'Electronics',
    imageUrl: null,
    userId: 'user2',
    seller: 'TechRecycle'
  },
  {
    id: '3',
    title: 'Mid-Century Modern Chair',
    description: '1960s Danish teak chair with warm patina. Structurally sound, recently reupholstered cushions. A stunning mid-century piece.',
    price: 120.00,
    category: 'Furniture',
    imageUrl: null,
    userId: 'user1',
    seller: 'VintageFinds'
  },
  {
    id: '4',
    title: 'Mountain Bike - Trek',
    description: 'Trek mountain bike, 29" wheels, hydraulic disc brakes. Lightweight aluminum frame, Shimano gears. Well-maintained for trails or city.',
    price: 380.00,
    category: 'Sports',
    imageUrl: null,
    userId: 'user3',
    seller: 'ActiveLife'
  },
  {
    id: '5',
    title: 'Harry Potter Book Set',
    description: 'Complete hardcover Harry Potter series. Minimal wear, intact dust jackets. Perfect for fans, no damage to pages.',
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
  const [isLoading, setIsLoading] = useState(false);

  const product = MOCK_PRODUCTS.find(p => p.id === id);

  if (!product) {
    return (
      <View style={styles.notFoundContainer}>
        <Ionicons name="alert-circle-outline" size={60} color="#6B7280" />
        <Text style={styles.notFoundTitle}>Product Not Found</Text>
        <Text style={styles.notFoundText}>We couldn't find the product you're looking for.</Text>
        <TouchableOpacity style={styles.goBackButton} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={20} color="#FFFFFF" />
          <Text style={styles.goBackText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const handleAddToCart = async () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      Alert.alert(
        'Added to Cart!',
        `${product.title} has been added to your cart`,
        [
          { text: 'Continue Shopping', style: 'default' },
          { text: 'View Cart', style: 'default', onPress: () => router.push('/cart') }
        ]
      );
    }, 800);
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Hero Image */}
      <View style={styles.heroSection}>
        <View style={styles.imageContainer}>
          <Image
            source={require('../../assets/images/splash-icon.png')}
            style={styles.productImage}
            resizeMode="cover"
          />
          <View style={styles.verifiedBadge}>
            <Ionicons name="checkmark-circle" size={16} color="#10B981" />
            <Text style={styles.verifiedText}>Verified</Text>
          </View>
          <TouchableOpacity style={styles.heartButton}>
            <Ionicons name="heart-outline" size={24} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
        <View style={styles.indicators}>
          {[...Array(4)].map((_, index) => (
            <View
              key={index}
              style={[styles.indicator, index === 0 ? styles.indicatorActive : styles.indicatorInactive]}
            />
          ))}
        </View>
      </View>

      {/* Content Section */}
      <View style={styles.contentSection}>
        {/* Product Info */}
        <View style={styles.productInfo}>
          <Text style={styles.productTitle}>{product.title}</Text>
          <View style={styles.priceRow}>
            <Text style={styles.currentPrice}>${product.price.toFixed(2)}</Text>
            <View style={styles.discountBadge}>
              <Text style={styles.discountText}>15% OFF</Text>
            </View>
          </View>
          <Text style={styles.originalPrice}>${(product.price * 1.15).toFixed(2)}</Text>
        </View>

        {/* Tags */}
        <View style={styles.tagsContainer}>
          <View style={[styles.tag, styles.categoryTag]}>
            <Text style={styles.tagText}>{product.category}</Text>
          </View>
          <View style={[styles.tag, styles.conditionTag]}>
            <Text style={styles.tagText}>Like New</Text>
          </View>
          <View style={[styles.tag, styles.shippingTag]}>
            <Text style={styles.tagText}>Fast Shipping</Text>
          </View>
        </View>

        {/* Seller Info */}
        <View style={styles.sellerCard}>
          <View style={styles.sellerInfo}>
            <View style={styles.sellerAvatar}>
              <Ionicons name="person" size={24} color="#10B981" />
            </View>
            <View>
              <View style={styles.sellerNameRow}>
                <Text style={styles.sellerName}>{product.seller}</Text>
                <Ionicons name="checkmark-circle" size={16} color="#10B981" />
              </View>
              <View style={styles.sellerStats}>
                <Text style={styles.ratingText}>4.8 ★ (127)</Text>
                <Text style={styles.responseText}>• 1h response</Text>
              </View>
            </View>
          </View>
          <TouchableOpacity style={styles.chatButton}>
            <Ionicons name="chatbubble-outline" size={20} color="#10B981" />
          </TouchableOpacity>
        </View>

        {/* Description */}
        <View style={styles.descriptionSection}>
          <Text style={styles.sectionTitle}>Description</Text>
          <Text style={styles.descriptionText}>{product.description}</Text>
        </View>

        {/* Features */}
        <View style={styles.featuresSection}>
          <Text style={styles.sectionTitle}>Features</Text>
          <View style={styles.featuresGrid}>
            {[
              { icon: 'shield-checkmark', title: 'Authenticated', subtitle: 'Quality assured' },
              { icon: 'refresh', title: '7-Day Returns', subtitle: 'Hassle-free' },
              { icon: 'leaf', title: 'Sustainable', subtitle: 'Eco-friendly' },
              { icon: 'rocket', title: 'Fast Shipping', subtitle: '2-3 days' },
            ].map((feature, index) => (
              <View key={index} style={styles.featureCard}>
                <Ionicons name={feature.icon} size={24} color="#10B981" />
                <Text style={styles.featureTitle}>{feature.title}</Text>
                <Text style={styles.featureSubtitle}>{feature.subtitle}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Protection */}
        <View style={styles.protectionSection}>
          <View style={styles.protectionHeader}>
            <Ionicons name="shield-checkmark" size={20} color="#10B981" />
            <Text style={styles.protectionTitle}>Purchase Protection</Text>
          </View>
          <Text style={styles.protectionText}>
            Protected by EcoFinds Guarantee. Full refund if the item doesn't match the description.
          </Text>
        </View>
      </View>

      {/* Action Buttons */}
      <View style={styles.actionSection}>
        <View style={styles.priceSummary}>
          <Text style={styles.totalPrice}>${product.price.toFixed(2)}</Text>
          <Text style={styles.freeShippingText}>Free shipping on orders over $50</Text>
        </View>
        <View style={styles.actionButtons}>
          <TouchableOpacity style={styles.favoriteButton}>
            <Ionicons name="heart-outline" size={24} color="#10B981" />
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.addToCartButton, isLoading && styles.addToCartLoading]}
            onPress={handleAddToCart}
            disabled={isLoading}
          >
            <Ionicons name={isLoading ? 'hourglass-outline' : 'cart-outline'} size={20} color="#FFFFFF" />
            <Text style={styles.addToCartText}>
              {isLoading ? 'Adding...' : 'Add to Cart'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F7F7',
  },
  notFoundContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    backgroundColor: '#FFFFFF',
  },
  notFoundTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1F2937',
    marginTop: 16,
    marginBottom: 8,
  },
  notFoundText: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 24,
  },
  goBackButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#10B981',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 12,
  },
  goBackText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    marginLeft: 8,
  },
  heroSection: {
    backgroundColor: '#FFFFFF',
    paddingTop: 16,
    paddingBottom: 24,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  imageContainer: {
    width: width * 0.9,
    height: width * 0.9,
    maxWidth: 360,
    maxHeight: 360,
    backgroundColor: '#F3F4F6',
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 6,
  },
  productImage: {
    width: '90%',
    height: '90%',
    borderRadius: 16,
  },
  verifiedBadge: {
    position: 'absolute',
    top: 16,
    left: 16,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 16,
  },
  verifiedText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#10B981',
    marginLeft: 4,
  },
  heartButton: {
    position: 'absolute',
    top: 16,
    right: 16,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(16, 185, 129, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  indicators: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 16,
    gap: 8,
  },
  indicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  indicatorActive: {
    backgroundColor: '#10B981',
  },
  indicatorInactive: {
    backgroundColor: '#D1D5DB',
  },
  contentSection: {
    padding: 20,
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    marginTop: 16,
  },
  productInfo: {
    marginBottom: 20,
  },
  productTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 12,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  currentPrice: {
    fontSize: 24,
    fontWeight: '700',
    color: '#10B981',
  },
  discountBadge: {
    backgroundColor: '#EF4444',
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 12,
    marginLeft: 12,
  },
  discountText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  originalPrice: {
    fontSize: 16,
    color: '#6B7280',
    textDecorationLine: 'line-through',
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 20,
  },
  tag: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 16,
    borderWidth: 1,
  },
  tagText: {
    fontSize: 12,
    fontWeight: '600',
  },
  categoryTag: {
    backgroundColor: '#EFF6FF',
    borderColor: '#BFDBFE',
  },
  conditionTag: {
    backgroundColor: '#FEF3C7',
    borderColor: '#FDE68A',
  },
  shippingTag: {
    backgroundColor: '#D1FAE5',
    borderColor: '#6EE7B7',
  },
  sellerCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#F9FAFB',
    padding: 16,
    borderRadius: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  sellerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sellerAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#D1FAE5',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  sellerNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  sellerName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginRight: 8,
  },
  sellerStats: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  ratingText: {
    fontSize: 14,
    color: '#6B7280',
  },
  responseText: {
    fontSize: 14,
    color: '#6B7280',
  },
  chatButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#D1FAE5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  descriptionSection: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 12,
  },
  descriptionText: {
    fontSize: 16,
    color: '#4B5563',
    lineHeight: 24,
  },
  featuresSection: {
    marginBottom: 20,
  },
  featuresGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  featureCard: {
    width: (width - 52) / 2,
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  featureTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1F2937',
    marginVertical: 8,
  },
  featureSubtitle: {
    fontSize: 12,
    color: '#6B7280',
    textAlign: 'center',
  },
  protectionSection: {
    backgroundColor: '#D1FAE5',
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
  },
  protectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  protectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#065F46',
    marginLeft: 8,
  },
  protectionText: {
    fontSize: 14,
    color: '#065F46',
    lineHeight: 20,
  },
  actionSection: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  priceSummary: {
    marginBottom: 16,
  },
  totalPrice: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 4,
  },
  freeShippingText: {
    fontSize: 12,
    color: '#10B981',
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  favoriteButton: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  addToCartButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#10B981',
    paddingVertical: 14,
    borderRadius: 12,
  },
  addToCartLoading: {
    backgroundColor: '#6EE7B7',
  },
  addToCartText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    marginLeft: 8,
  },
});