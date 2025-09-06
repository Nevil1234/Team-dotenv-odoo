import React, { useState, useEffect } from 'react';
import * as ImagePicker from 'expo-image-picker';
import { StyleSheet, View, Text, TextInput, TouchableOpacity, ScrollView, Alert, Image, Modal, FlatList } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { getProductImage } from '../../utils/images/productImages';

// Categories for product
const CATEGORIES = [
  'Select a category',
  'Clothing',
  'Electronics',
  'Furniture',
  'Books',
  'Sports',
  'Other'
];

// Mock data for products (should be replaced with API in real app)
const MOCK_PRODUCTS = [
  {
    id: '1',
    title: 'Vintage Leather Jacket',
    description: 'Authentic vintage leather jacket in excellent condition. Size M.',
    price: 75.00,
    category: 'Clothing',
    imageUrl: { uri: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8bGVhdGhlciUyMGphY2tldHxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=500&q=60' },
    userId: 'user1',
    status: 'active'
  },
  {
    id: '3',
    title: 'Mid-Century Modern Chair',
    description: 'Authentic mid-century modern chair in teak. Some patina but structurally sound.',
    price: 120.00,
    category: 'Furniture',
    imageUrl: { uri: 'https://images.unsplash.com/photo-1561677843-39dee7a319ca?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8bWlkJTIwY2VudHVyeSUyMGNoYWlyfGVufDB8fDB8fHww&auto=format&fit=crop&w=500&q=60' },
    userId: 'user1',
    status: 'active'
  },
  {
    id: '6',
    title: 'Polaroid Camera',
    description: 'Vintage Polaroid camera from the 1980s. Still works perfectly.',
    price: 40.00,
    category: 'Electronics',
    imageUrl: { uri: 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8cG9sYXJvaWQlMjBjYW1lcmF8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=500&q=60' },
    userId: 'user1',
    status: 'sold'
  }
];

export default function EditProduct() {
  const { id } = useLocalSearchParams();
  const router = useRouter();

  // Find the product to edit
  const product = MOCK_PRODUCTS.find(p => p.id === id);

  // State for form fields
  const [title, setTitle] = useState(product ? product.title : '');
  const [description, setDescription] = useState(product ? product.description : '');
  const [category, setCategory] = useState(product ? product.category : CATEGORIES[0]);
  const [price, setPrice] = useState(product ? String(product.price) : '');
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [dropdownVisible, setDropdownVisible] = useState(false);

  useEffect(() => {
    if (!product) {
      Alert.alert('Error', 'Product not found', [
        { text: 'OK', onPress: () => router.back() }
      ]);
    }
  }, [product]);

  const handleSubmit = () => {
    // Validate inputs
    if (!title.trim()) {
      Alert.alert('Error', 'Please enter a title');
      return;
    }
    if (!description.trim()) {
      Alert.alert('Error', 'Please enter a description');
      return;
    }
    if (category === CATEGORIES[0]) {
      Alert.alert('Error', 'Please select a category');
      return;
    }
    if (!price.trim() || isNaN(parseFloat(price)) || parseFloat(price) <= 0) {
      Alert.alert('Error', 'Please enter a valid price');
      return;
    }
    // Here you would typically make an API call to update the product
    Alert.alert('Success', 'Product updated successfully!', [
      { text: 'OK', onPress: () => router.push('/(tabs)/mylistings') }
    ]);
  };

  const handleAddImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission Denied', 'Permission to access media library is required!');
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });
    if (!result.canceled && result.assets && result.assets.length > 0) {
      setImageUri(result.assets[0].uri);
    }
  };

  if (!product) {
    return null;
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Edit Product</Text>
        {/* Product Title Input */}
        <Text style={styles.label}>Product Title</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter product title"
          value={title}
          onChangeText={setTitle}
          maxLength={100}
        />
        {/* Category Dropdown */}
        <Text style={styles.label}>Category</Text>
        <TouchableOpacity 
          style={styles.pickerContainer}
          onPress={() => setDropdownVisible(true)}
        >
          <Text style={styles.pickerText}>{category}</Text>
          <Ionicons name="chevron-down" size={20} color="#757575" />
        </TouchableOpacity>
        {/* Category Modal */}
        <Modal
          visible={dropdownVisible}
          transparent={true}
          animationType="fade"
          onRequestClose={() => setDropdownVisible(false)}
        >
          <TouchableOpacity
            style={styles.modalOverlay}
            activeOpacity={1}
            onPress={() => setDropdownVisible(false)}
          >
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Select a Category</Text>
              <FlatList
                data={CATEGORIES}
                keyExtractor={(item: string) => item}
                renderItem={({ item }: { item: string }) => (
                  <TouchableOpacity
                    style={styles.categoryItem}
                    onPress={() => {
                      setCategory(item);
                      setDropdownVisible(false);
                    }}
                  >
                    <Text style={[
                      styles.categoryItemText,
                      category === item && styles.selectedCategoryText
                    ]}>
                      {item}
                    </Text>
                    {category === item && (
                      <Ionicons name="checkmark" size={20} color="#2E7D32" />
                    )}
                  </TouchableOpacity>
                )}
              />
            </View>
          </TouchableOpacity>
        </Modal>
        {/* Price Input */}
        <Text style={styles.label}>Price (₹)</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter price"
          value={price}
          onChangeText={setPrice}
          keyboardType="numeric"
        />
        {/* Description Input */}
        <Text style={styles.label}>Description</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          placeholder="Enter detailed description of your product"
          value={description}
          onChangeText={setDescription}
          multiline
          textAlignVertical="top"
          numberOfLines={6}
        />
        {/* Image Upload */}
        <Text style={styles.label}>Product Image</Text>
        <TouchableOpacity 
          style={styles.imageUploadContainer}
          onPress={handleAddImage}
        >
          {imageUri ? (
            <View style={styles.imagePreviewContainer}>
              <Image
                source={{ uri: imageUri }}
                style={{ width: '100%', height: 170, borderRadius: 10, backgroundColor: '#eee' }}
                resizeMode="cover"
              />
              <Text style={styles.imageAddedText}>Image Selected</Text>
            </View>
          ) : (
            <View style={styles.imagePreviewContainer}>
              <Image 
                source={product.imageUrl || getProductImage(title, category)}
                style={{ width: '100%', height: 170, borderRadius: 10 }}
                resizeMode="cover"
              />
              <Text style={styles.imagePlaceholderText}>Tap to change image</Text>
            </View>
          )}
        </TouchableOpacity>
        {/* Submit Button */}
        <TouchableOpacity 
          style={styles.submitButton}
          onPress={handleSubmit}
        >
          <Text style={styles.submitButtonText}>Update Product</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  content: {
    margin: 16,
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    paddingBottom: 40,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 28,
    color: '#1A1A1A',
    letterSpacing: 0.5,
    textAlign: 'center',
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    color: '#222',
    marginLeft: 2,
  },
  input: {
    backgroundColor: '#F5F5F5',
    borderRadius: 10,
    padding: 14,
    fontSize: 16,
    marginBottom: 18,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  textArea: {
    height: 120,
    paddingTop: 12,
  },
  pickerContainer: {
    backgroundColor: '#F5F5F5',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    marginBottom: 18,
    height: 50,
    paddingHorizontal: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  pickerText: {
    fontSize: 16,
    color: '#424242',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: 'white',
    width: '100%',
    borderRadius: 12,
    padding: 18,
    maxHeight: '80%',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 18,
    textAlign: 'center',
    color: '#1A1A1A',
  },
  categoryItem: {
    paddingVertical: 13,
    paddingHorizontal: 18,
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  categoryItemText: {
    fontSize: 16,
  },
  selectedCategoryText: {
    color: '#2E7D32',
    fontWeight: '600',
  },
  imageUploadContainer: {
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    height: 200,
    marginBottom: 26,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
  },
  imagePlaceholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  imagePlaceholderText: {
    marginTop: 8,
    color: '#757575',
    fontSize: 16,
  },
  imagePreviewContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  imagePreview: {
    width: '100%',
    height: '80%',
    borderRadius: 10,
  },
  imageAddedText: {
    marginTop: 8,
    color: '#2E7D32',
    fontSize: 15,
    fontWeight: '600',
  },
  submitButton: {
    backgroundColor: '#2E7D32',
    height: 56,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.12,
    shadowRadius: 2,
  },
  submitButtonText: {
    color: 'white',
    fontSize: 17,
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
});
