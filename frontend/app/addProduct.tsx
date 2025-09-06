import React, { useState } from 'react';
import * as ImagePicker from 'expo-image-picker';
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

  const handleAddImage = async () => {
    // Ask for permission
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission Denied', 'Permission to access media library is required!');
      return;
    }
    // Open image picker
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
                source={{ uri: imageUri }}
                style={{ width: '100%', height: 170, borderRadius: 10, backgroundColor: '#eee' }}
                resizeMode="cover"
              />
              <Text style={styles.imageAddedText}>Image Selected</Text>
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
