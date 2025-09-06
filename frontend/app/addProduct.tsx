import React, { useState } from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity, ScrollView, Alert, Image, Modal, FlatList } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

// Categories for product
const CATEGORIES = [
  'Select a category', // Default option
  'Clothing',
  'Electronics',
  'Furniture',
  'Books',
  'Sports',
  'Other'
];

export default function AddProduct() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [price, setPrice] = useState('');
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const router = useRouter();

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

    // Here you would typically make an API call to create the product
    // For now, we'll just simulate success and navigate back
    Alert.alert('Success', 'Product listed successfully!', [
      { 
        text: 'OK', 
        onPress: () => router.push('/') 
      }
    ]);
  };

  const handleAddImage = () => {
    // In a real app, this would open the image picker
    // For now, we'll just set a placeholder
    setImageUri('placeholder');
    Alert.alert('Image Added', 'Image placeholder added successfully');
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Add New Product</Text>
        
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
        <Text style={styles.label}>Price ($)</Text>
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
                source={require('../assets/images/splash-icon.png')}
                style={styles.imagePreview}
                resizeMode="contain"
              />
              <Text style={styles.imageAddedText}>Image Added (Placeholder)</Text>
            </View>
          ) : (
            <View style={styles.imagePlaceholder}>
              <Ionicons name="camera-outline" size={40} color="#BDBDBD" />
              <Text style={styles.imagePlaceholderText}>+ Add Image</Text>
            </View>
          )}
        </TouchableOpacity>
        
        {/* Submit Button */}
        <TouchableOpacity 
          style={styles.submitButton}
          onPress={handleSubmit}
        >
          <Text style={styles.submitButtonText}>Submit Listing</Text>
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
  content: {
    padding: 16,
    paddingBottom: 40,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 8,
    color: '#424242',
  },
  input: {
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  textArea: {
    height: 120,
    paddingTop: 12,
  },
  pickerContainer: {
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    marginBottom: 16,
    height: 50,
    paddingHorizontal: 12,
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
    borderRadius: 8,
    padding: 16,
    maxHeight: '80%',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  categoryItem: {
    paddingVertical: 12,
    paddingHorizontal: 16,
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
    fontWeight: '500',
  },
  imageUploadContainer: {
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    height: 200,
    marginBottom: 24,
    overflow: 'hidden',
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
  },
  imageAddedText: {
    marginTop: 8,
    color: '#2E7D32',
    fontSize: 14,
  },
  submitButton: {
    backgroundColor: '#2E7D32',
    height: 56,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  submitButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
