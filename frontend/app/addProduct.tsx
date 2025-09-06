import React, { useState } from 'react';
import * as ImagePicker from 'expo-image-picker';
import { 
  StyleSheet, 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  ScrollView, 
  Alert, 
  Image, 
  Modal, 
  FlatList 
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { getProductImage } from '../utils/images/productImages';
import { mockStorage } from '../utils/storage/mockStorage';

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

export default function AddProduct() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [price, setPrice] = useState('');
  const [quantity, setQuantity] = useState('');
  const [condition, setCondition] = useState('');
  const [year, setYear] = useState('');
  const [brand, setBrand] = useState('');
  const [model, setModel] = useState('');
  const [length, setLength] = useState('');
  const [width, setWidth] = useState('');
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');
  const [material, setMaterial] = useState('');
  const [color, setColor] = useState('');
  const [originalPackaging, setOriginalPackaging] = useState(false);
  const [manualIncluded, setManualIncluded] = useState(false);
  const [workingCondition, setWorkingCondition] = useState('');
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [dropdownVisible, setDropdownVisible] = useState(false);

  const router = useRouter();

  /**
   * Validates the product form data
   * @returns {boolean} True if data is valid, false otherwise
   */
  const validateProductForm = () => {
    if (!title.trim()) {
      Alert.alert('Error', 'Please enter a title');
      return false;
    }
    if (!description.trim()) {
      Alert.alert('Error', 'Please enter a description');
      return false;
    }
    if (category === CATEGORIES[0]) {
      Alert.alert('Error', 'Please select a category');
      return false;
    }
    if (!price.trim() || isNaN(parseFloat(price)) || parseFloat(price) <= 0) {
      Alert.alert('Error', 'Please enter a valid price');
      return false;
    }
    if (!quantity.trim() || isNaN(parseInt(quantity)) || parseInt(quantity) <= 0) {
      Alert.alert('Error', 'Please enter a valid quantity');
      return false;
    }
    return true;
  };

  /**
   * Handles form submission and product creation
   */
  const handleSubmit = () => {
    // Validate the form data first
    if (!validateProductForm()) {
      return;
    }

    // Create the product object
    const newProduct = {
      title,
      description,
      price: parseFloat(price),
      category,
      imageUrl: imageUri ? { uri: imageUri } : (title && category !== CATEGORIES[0] ? getProductImage(title, category) : null),
      // Add additional fields as needed
      condition,
      quantity: parseInt(quantity),
      year,
      brand,
      model,
      dimensions: {
        length: length ? parseFloat(length) : null,
        width: width ? parseFloat(width) : null,
        height: height ? parseFloat(height) : null,
      },
      weight: weight ? parseFloat(weight) : null,
      material,
      color,
      originalPackaging,
      manualIncluded,
      workingCondition
    };
    
    // Save the product to mock storage
    const savedProduct = mockStorage.addProductListing(newProduct);
    console.log('Product saved successfully:', savedProduct);
    
    // Show success alert and redirect to mylistings
    Alert.alert('Success', 'Product listed successfully!', [
      { 
        text: 'OK', 
        onPress: () => {
          // Navigate directly to the mylistings tab
          router.replace("/(tabs)/mylistings");
        }
      }
    ]);
  };

  /**
   * Handles adding an image from the device's media library
   * Includes permission handling and image selection
   */
  const handleAddImage = async () => {
    try {
      // Request permission to access media library
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      
      if (status !== 'granted') {
        Alert.alert(
          'Permission Denied', 
          'Permission to access media library is required for adding product images.',
          [
            { text: 'OK' },
            { 
              text: 'App Settings', 
              onPress: () => {
                // In a real app, we would direct to settings here
                console.log('User redirected to app settings');
              }
            }
          ]
        );
        return;
      }

      // Launch image picker
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8, // Slightly reduced quality for better performance
        // Using standard options supported by ImagePicker
      });

      // Handle selected image
      if (!result.canceled && result.assets && result.assets.length > 0) {
        setImageUri(result.assets[0].uri);
        console.log('Image selected successfully:', result.assets[0].uri);
      } else {
        console.log('Image selection canceled');
      }
    } catch (error) {
      console.error('Error selecting image:', error);
      Alert.alert('Error', 'Failed to select image. Please try again.');
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Add New Product</Text>

        {/* Product Title */}
        <Text style={styles.label}>Product Title</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter product title"
          value={title}
          onChangeText={setTitle}
          maxLength={100}
        />

        {/* Category */}
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
          transparent
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
                keyExtractor={(item) => item}
                renderItem={({ item }) => (
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

        {/* Price */}
        <Text style={styles.label}>Price (₹)</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter price"
          value={price}
          onChangeText={setPrice}
          keyboardType="numeric"
        />

        {/* Quantity */}
        <Text style={styles.label}>Quantity</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter quantity"
          value={quantity}
          onChangeText={setQuantity}
          keyboardType="numeric"
        />

        {/* Condition */}
        <Text style={styles.label}>Condition</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter condition (New, Used, etc.)"
          value={condition}
          onChangeText={setCondition}
        />

        {/* Year of Manufacture */}
        <Text style={styles.label}>Year of Manufacture</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter year"
          value={year}
          onChangeText={setYear}
          keyboardType="numeric"
        />

        {/* Brand */}
        <Text style={styles.label}>Brand</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter brand"
          value={brand}
          onChangeText={setBrand}
        />

        {/* Model */}
        <Text style={styles.label}>Model</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter model"
          value={model}
          onChangeText={setModel}
        />

        {/* Dimensions */}
        <Text style={styles.label}>Dimensions (L × W × H in cm)</Text>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          <TextInput
            style={[styles.input, { flex: 1, marginRight: 5 }]}
            placeholder="Length"
            value={length}
            onChangeText={setLength}
            keyboardType="numeric"
          />
          <TextInput
            style={[styles.input, { flex: 1, marginHorizontal: 5 }]}
            placeholder="Width"
            value={width}
            onChangeText={setWidth}
            keyboardType="numeric"
          />
          <TextInput
            style={[styles.input, { flex: 1, marginLeft: 5 }]}
            placeholder="Height"
            value={height}
            onChangeText={setHeight}
            keyboardType="numeric"
          />
        </View>

        {/* Weight */}
        <Text style={styles.label}>Weight (kg)</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter weight"
          value={weight}
          onChangeText={setWeight}
          keyboardType="numeric"
        />

        {/* Material */}
        <Text style={styles.label}>Material</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter material"
          value={material}
          onChangeText={setMaterial}
        />

        {/* Color */}
        <Text style={styles.label}>Color</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter color"
          value={color}
          onChangeText={setColor}
        />

        {/* Original Packaging */}
        <View style={styles.checkboxRow}>
          <TouchableOpacity onPress={() => setOriginalPackaging(!originalPackaging)}>
            <Ionicons
              name={originalPackaging ? "checkbox" : "square-outline"}
              size={24}
              color="#2E7D32"
            />
          </TouchableOpacity>
          <Text style={styles.checkboxLabel}>Original Packaging</Text>
        </View>

        {/* Manual Included */}
        <View style={styles.checkboxRow}>
          <TouchableOpacity onPress={() => setManualIncluded(!manualIncluded)}>
            <Ionicons
              name={manualIncluded ? "checkbox" : "square-outline"}
              size={24}
              color="#2E7D32"
            />
          </TouchableOpacity>
          <Text style={styles.checkboxLabel}>Manual/Instructions Included</Text>
        </View>

        {/* Working Condition */}
        <Text style={styles.label}>Working Condition</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          placeholder="Describe working condition"
          value={workingCondition}
          onChangeText={setWorkingCondition}
          multiline
          numberOfLines={4}
          textAlignVertical="top"
        />

        {/* Description */}
        <Text style={styles.label}>Product Description</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          placeholder="Enter detailed description"
          value={description}
          onChangeText={setDescription}
          multiline
          numberOfLines={6}
          textAlignVertical="top"
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
                style={{ width: '100%', height: 170, borderRadius: 10 }}
                resizeMode="cover"
              />
              <Text style={styles.imageAddedText}>Image Selected</Text>
            </View>
          ) : title && category !== CATEGORIES[0] ? (
            <View style={styles.imagePreviewContainer}>
              <Image 
                source={getProductImage(title, category)}
                style={{ width: '100%', height: 170, borderRadius: 10 }}
                resizeMode="cover"
              />
              <Text style={styles.imagePlaceholderText}>Suggested image - Tap to change</Text>
            </View>
          ) : (
            <View style={styles.imagePlaceholder}>
              <Ionicons name="camera-outline" size={40} color="#BDBDBD" />
              <Text style={styles.imagePlaceholderText}>+ Add Image</Text>
            </View>
          )}
        </TouchableOpacity>

        {/* Submit */}
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
  container: { flex: 1, backgroundColor: '#F8F9FA' },
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
    textAlign: 'center',
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    color: '#222',
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
  textArea: { height: 100, paddingTop: 12 },
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
  pickerText: { fontSize: 16, color: '#424242' },
  modalOverlay: {
    flex: 1, backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center', alignItems: 'center', padding: 20,
  },
  modalContent: {
    backgroundColor: 'white',
    width: '100%',
    borderRadius: 12,
    padding: 18,
    maxHeight: '80%',
  },
  modalTitle: {
    fontSize: 20, fontWeight: 'bold',
    marginBottom: 18, textAlign: 'center',
  },
  categoryItem: {
    paddingVertical: 13, paddingHorizontal: 18,
    borderBottomWidth: 1, borderBottomColor: '#eee',
    flexDirection: 'row', justifyContent: 'space-between',
  },
  categoryItemText: { fontSize: 16 },
  selectedCategoryText: { color: '#2E7D32', fontWeight: '600' },
  imageUploadContainer: {
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    height: 200,
    marginBottom: 26,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  imagePlaceholder: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  imagePlaceholderText: { marginTop: 8, color: '#757575', fontSize: 16 },
  imagePreviewContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  imageAddedText: { marginTop: 8, color: '#2E7D32', fontWeight: '600' },
  checkboxRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 18 },
  checkboxLabel: { marginLeft: 10, fontSize: 16 },
  submitButton: {
    backgroundColor: '#2E7D32',
    height: 56,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
  submitButtonText: { color: 'white', fontSize: 17, fontWeight: 'bold' },
});
