import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Alert, FlatList, Image, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { getProductImage } from '../../utils/images/productImages';
import { mockStorage } from '../../utils/storage/mockStorage';
import { useFocusEffect } from '@react-navigation/native';

// Constants
const SORT_OPTIONS = ['Price: low', 'Price: high', 'Name'];
const FILTER_OPTIONS = ['Active', 'Sold', 'Clothing', 'Electronics', 'Furniture'];
const GROUP_OPTIONS = ['Category', 'Status'];

/**
 * Represents a product listing in the marketplace
 */
interface Listing {
  /** Unique identifier for the listing */
  id: string;
  /** Title/name of the product */
  title: string;
  /** Detailed description of the product */
  description: string;
  /** Price of the product in currency units */
  price: number;
  /** Category classification (e.g., Clothing, Electronics) */
  category: string;
  /** URL to the product image */
  imageUrl: { uri: string } | null;
  /** ID of the user who owns this listing */
  userId: string;
  /** Current status of the listing (e.g., active, sold) */
  status: string;
}

const MOCK_MY_LISTINGS: Listing[] = [
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
    imageUrl: { uri: 'https://images.unsplash.com/photo-1611486212557-88be5ff6f941?auto=format&fit=crop&w=500&h=500&q=80' },
    userId: 'user1',
    status: 'active'
  },
  {
    id: '6',
    title: 'Polaroid Camera',
    description: 'Vintage Polaroid camera from the 1980s. Still works perfectly.',
    price: 40.00,
    category: 'Electronics',
    imageUrl: { uri: 'https://images.unsplash.com/photo-1495121553079-4c61bcce1894?auto=format&fit=crop&w=500&h=500&q=80' },
    userId: 'user1',
    status: 'sold'
  }
];

export default function MyListings() {
  // Initialize with mock data and then add any new products from mockStorage
  const [listings, setListings] = useState(MOCK_MY_LISTINGS);
  const [search, setSearch] = useState('');
  const [sortOpen, setSortOpen] = useState(false);
  const [filterOpen, setFilterOpen] = useState(false);
  const [groupOpen, setGroupOpen] = useState(false);
  const [selectedSort, setSelectedSort] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('');
  const [selectedGroup, setSelectedGroup] = useState('');

  const router = useRouter();
  
  /**
   * Loads product listings from both mock data and storage
   * Combines listings while avoiding duplicates based on ID
   */
  const loadListings = useCallback(() => {
    // Get stored listings from mock storage
    const storedListings = mockStorage.getProductListings() || [];
    
    // Create a Set of mock listing IDs for efficient lookup
    const mockListingIds = new Set(MOCK_MY_LISTINGS.map(item => item.id));
    
    // Cast storedListings to the right type and filter out duplicates
    const typedStoredListings = storedListings as Listing[];
    const uniqueStoredListings = typedStoredListings.filter(item => !mockListingIds.has(item.id));
    
    // Combine mock data with unique stored listings and update state
    setListings([...MOCK_MY_LISTINGS, ...uniqueStoredListings]);
    
    // Log for debugging purposes
    console.log('Total listings loaded:', MOCK_MY_LISTINGS.length + uniqueStoredListings.length);
  }, []);
  
  // Load listings from mockStorage when component mounts
  useEffect(() => {
    // Initial load of listings
    loadListings();
  }, [loadListings]);
  
  // Reload listings whenever the screen comes into focus
  useFocusEffect(
    useCallback(() => {
      console.log('MyListings screen focused - reloading data');
      loadListings();
      
      return () => {
        // Cleanup if needed when screen loses focus
      };
    }, [loadListings])
  );

  /**
   * Handles deletion of a product listing with confirmation
   * @param id - ID of the listing to delete
   */
  const handleDelete = useCallback((id: string) => {
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
            try {
              // Delete from mockStorage and update local state
              const deleted = mockStorage.deleteProductListing(id);
              if (deleted) {
                setListings(prevListings => prevListings.filter(item => item.id !== id));
                console.log(`Successfully deleted listing with ID: ${id}`);
              } else {
                console.warn(`Failed to delete listing with ID: ${id}`);
              }
            } catch (error) {
              console.error('Error deleting listing:', error);
              Alert.alert('Error', 'Failed to delete the listing. Please try again.');
            }
          },
          style: 'destructive'
        }
      ]
    );
  }, []);

  /**
   * Filters listings based on search text and filter options
   */
  const filteredListings = useMemo(() => {
    return listings.filter((listing) => {
      // Apply search filter (case-insensitive)
      const query = search.toLowerCase();
      const matchesSearch = !query || 
        listing.title.toLowerCase().includes(query) || 
        listing.description.toLowerCase().includes(query);
      
      // Apply filter based on selected filter option
      let matchesFilter = true;
      
      // Status filters
      if (selectedFilter === 'Active') {
        matchesFilter = listing.status === 'active';
      } else if (selectedFilter === 'Sold') {
        matchesFilter = listing.status === 'sold';
      }
      // Category filters
      else if (selectedFilter === 'Clothing') {
        matchesFilter = listing.category === 'Clothing';
      } else if (selectedFilter === 'Electronics') {
        matchesFilter = listing.category === 'Electronics';
      } else if (selectedFilter === 'Furniture') {
        matchesFilter = listing.category === 'Furniture';
      }
      
      return matchesSearch && matchesFilter;
    });
  }, [listings, search, selectedFilter]);

  /**
   * Sorts the filtered listings based on selected sort option
   */
  const sortedListings = useMemo(() => {
    const listingsCopy = [...filteredListings];
    
    switch (selectedSort) {
      case 'Price: low':
        return listingsCopy.sort((a, b) => a.price - b.price);
      case 'Price: high':
        return listingsCopy.sort((a, b) => b.price - a.price);
      case 'Name':
        return listingsCopy.sort((a, b) => a.title.localeCompare(b.title));
      default:
        return listingsCopy;
    }
  }, [filteredListings, selectedSort]);

  /**
   * Groups listings based on selected grouping option
   * @returns Record of grouped listings or null if no grouping is applied
   */
  const groupedListings = useMemo(() => {
    if (selectedGroup === 'Category') {
      // Group by category
      const groups: Record<string, Listing[]> = {};
      sortedListings.forEach((listing: Listing) => {
        if (!groups[listing.category]) {
          groups[listing.category] = [];
        }
        groups[listing.category].push(listing);
      });
      return groups;
    } else if (selectedGroup === 'Status') {
      // Group by status
      const groups: Record<string, Listing[]> = {
        'Active': [],
        'Sold': []
      };
      
      sortedListings.forEach((listing: Listing) => {
        if (listing.status === 'active') {
          groups['Active'].push(listing);
        } else if (listing.status === 'sold') {
          groups['Sold'].push(listing);
        }
      });
      return groups;
    }
    
    // No grouping
    return null;
  }, [sortedListings, selectedGroup]);

  /**
   * Renders a single listing item
   * @param props - Component props containing the item to render
   * @returns JSX element for a listing item
   */
  /**
   * Renders a single listing item
   * @param props - Component props containing the item to render
   * @returns JSX element for a listing item
   */
  const renderListingItem = ({ item }: { item: typeof listings[0] }) => {
    return (
      <View style={styles.listingItem}>
        <TouchableOpacity 
          style={styles.listingContent}
          onPress={() => router.push(`/product/${item.id}`)}
          activeOpacity={0.85}
        >
          <View style={styles.imageContainer}>
            <Image 
              source={item.imageUrl || getProductImage(item.title, item.category)}
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
            <Text style={styles.itemPrice}>₹{item.price.toFixed(2)}</Text>
            <Text style={styles.itemCategory}>{item.category}</Text>
          </View>
        </TouchableOpacity>
        <View style={styles.actionsContainer}>
          <TouchableOpacity 
            style={[styles.actionButton, styles.editButton]}
            onPress={() => router.push(`/product/${item.id}`)}
          >
            <Ionicons name="create-outline" size={18} color="#2E7D32" />
            <Text style={styles.editButtonText}>Edit</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.actionButton, styles.deleteButton, {backgroundColor: '#FFEBEE', borderTopRightRadius: 8}]}
            onPress={() => handleDelete(item.id)}
            activeOpacity={0.8}
          >
            <Ionicons name="trash-outline" size={18} color="#FF5722" />
            <Text style={styles.deleteButtonText}>Delete</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  /**
   * EmptyListingState component to show when no listings are available
   */
  const EmptyListingState = () => (
    <View style={styles.emptyState}>
      <Ionicons name="list" size={80} color="#BDBDBD" />
      <Text style={styles.emptyStateTitle}>No Listings Yet</Text>
      <Text style={styles.emptyStateDescription}>
        You haven&apos;t created any product listings yet
      </Text>
      
      <TouchableOpacity 
        style={styles.createListingButton}
        onPress={() => router.push('/addProduct')}
      >
        <Text style={styles.createListingButtonText}>Create Listing</Text>
      </TouchableOpacity>
    </View>
  );

  /**
   * Renders content based on whether grouping is applied
   * @returns JSX element with either grouped listings or a FlatList
   */
  const renderContent = () => {
    if (selectedGroup && groupedListings) {
      return (
        <>
          {Object.entries(groupedListings).map(([groupName, groupListings]: [string, Listing[]]) => (
            <View key={groupName}>
              <Text style={styles.groupHeader}>{groupName} ({groupListings.length})</Text>
              {groupListings.map((listing: Listing) => (
                <View key={listing.id}>
                  {renderListingItem({ item: listing })}
                </View>
              ))}
            </View>
          ))}
        </>
      );
    }
    
    // Default rendering with FlatList when no grouping
    return (
      <FlatList
        data={sortedListings}
        renderItem={renderListingItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listingsContainer}
        ListEmptyComponent={<EmptyListingState />}
      />
    );
  };

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
      
      {/* Search Bar */}
      <View style={styles.searchWrap}>
        <Ionicons name="search" size={20} color="#6b7280" />
        <TextInput
          style={styles.searchInput}
          placeholder="Search listings…"
          value={search}
          onChangeText={setSearch}
        />
      </View>

      {/* Dropdowns */}
      <View style={styles.dropdownRow}>
        <Dropdown
          label="Sort"
          open={sortOpen}
          setOpen={setSortOpen}
          options={SORT_OPTIONS}
          selectedOption={selectedSort}
          onSelect={setSelectedSort}
        />
        <Dropdown
          label="Filter"
          open={filterOpen}
          setOpen={setFilterOpen}
          options={FILTER_OPTIONS}
          selectedOption={selectedFilter}
          onSelect={setSelectedFilter}
        />
        <Dropdown
          label="Group"
          open={groupOpen}
          setOpen={setGroupOpen}
          options={GROUP_OPTIONS}
          selectedOption={selectedGroup}
          onSelect={setSelectedGroup}
        />
      </View>
      
      {/* Content */}
      {listings.length > 0 ? (
        renderContent()
      ) : (
        <View style={styles.emptyState}>
          <Ionicons name="list" size={80} color="#BDBDBD" />
          <Text style={styles.emptyStateTitle}>No Listings Yet</Text>
          <Text style={styles.emptyStateDescription}>
            You haven&apos;t created any product listings yet
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

/* -------------------------------------------------------------------------- */
/*                               Dropdown Component                               */
/* -------------------------------------------------------------------------- */
/**
 * Dropdown component for selecting options from a list
 * 
 * @param props - Component properties
 * @param props.label - Label to display for the dropdown
 * @param props.open - Whether the dropdown is open
 * @param props.setOpen - Function to set the open state
 * @param props.options - Array of options to display
 * @param props.selectedOption - Currently selected option
 * @param props.onSelect - Function called when an option is selected
 * @returns Dropdown component
 */
function Dropdown({
  label,
  open,
  setOpen,
  options,
  selectedOption,
  onSelect,
}: {
  label: string;
  open: boolean;
  setOpen: (v: boolean) => void;
  options: string[];
  selectedOption: string;
  onSelect: (option: string) => void;
}): React.JSX.Element {
  // Toggle dropdown open/closed
  const toggleDropdown = useCallback(() => setOpen(!open), [open, setOpen]);
  
  // Handle option selection
  const handleSelect = useCallback((option: string) => {
    onSelect(option);
    setOpen(false);
  }, [onSelect, setOpen]);
  
  // Handle clear selection
  const handleClear = useCallback(() => handleSelect(''), [handleSelect]);

  return (
    <View style={{ flex: 1 }}>
      <TouchableOpacity style={styles.dropdownBtn} onPress={toggleDropdown}>
        <Text style={styles.dropdownLbl}>
          {selectedOption ? `${label}: ${selectedOption}` : label}
        </Text>
        <Ionicons name={open ? 'chevron-up' : 'chevron-down'} size={16} color="#6b7280" />
      </TouchableOpacity>
      {open && (
        <View style={styles.dropdownMenu}>
          <TouchableOpacity 
            key="clear" 
            style={styles.dropdownItem}
            onPress={handleClear}
          >
            <Text>Clear</Text>
          </TouchableOpacity>
          {options.map((option) => (
            <TouchableOpacity 
              key={option} 
              style={[
                styles.dropdownItem,
                selectedOption === option && styles.selectedDropdownItem
              ]}
              onPress={() => handleSelect(option)}
            >
              <Text style={selectedOption === option ? styles.selectedDropdownText : undefined}>
                {option}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
    padding: 12,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    paddingHorizontal: 4,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#1A1A1A',
    letterSpacing: 0.5,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2E7D32',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  addButtonText: {
    color: 'white',
    fontWeight: '500',
    marginLeft: 4,
  },
  // Search bar styles
  searchWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    marginBottom: 12,
    paddingHorizontal: 10,
    height: 48,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  searchInput: { 
    flex: 1, 
    marginLeft: 8, 
    fontSize: 16 
  },
  // Dropdown styles
  dropdownRow: { 
    flexDirection: 'row', 
    gap: 8, 
    marginBottom: 16 
  },
  dropdownBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#e0e0e0',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 8,
  },
  dropdownLbl: { 
    fontSize: 14, 
    color: '#374151' 
  },
  dropdownMenu: {
    position: 'absolute',
    top: '100%',
    left: 0,
    right: 0,
    zIndex: 10,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    marginTop: 4,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  dropdownItem: { 
    padding: 10, 
    borderBottomWidth: 1, 
    borderColor: '#f3f4f6' 
  },
  selectedDropdownItem: {
    backgroundColor: '#f0fdf4',
  },
  selectedDropdownText: {
    color: '#15803d',
    fontWeight: '500',
  },
  // Group header style
  groupHeader: {
    fontSize: 16,
    fontWeight: '600',
    backgroundColor: '#f9fafb',
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginBottom: 8,
  },
  listingsContainer: {
    paddingBottom: 20,
    paddingHorizontal: 2,
  },
  listingItem: {
    backgroundColor: 'white',
    borderRadius: 12,
    marginBottom: 18,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
  },
  listingContent: {
    flexDirection: 'row',
    padding: 14,
    alignItems: 'center',
  },
  imageContainer: {
    width: 80,
    height: 80,
    borderRadius: 10,
    backgroundColor: '#F5F5F5',
    marginRight: 18,
    overflow: 'hidden',
    position: 'relative',
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  productImage: {
    width: '100%',
    height: '100%',
    borderRadius: 10,
  },
  soldOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.55)',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
  },
  soldText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 18,
    letterSpacing: 1,
  },
  itemInfo: {
    flex: 1,
    justifyContent: 'center',
    minHeight: 70,
  },
  itemTitle: {
    fontSize: 17,
    fontWeight: '600',
    marginBottom: 4,
    color: '#222',
  },
  itemPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2E7D32',
    marginBottom: 2,
  },
  itemCategory: {
    fontSize: 14,
    color: '#757575',
    marginTop: 2,
  },
  actionsContainer: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
    backgroundColor: '#F7F7F7',
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 13,
    borderTopWidth: 0,
  },
  editButton: {
    borderRightWidth: 1,
    borderRightColor: '#E0E0E0',
  },
  deleteButton: {},
  editButtonText: {
    color: '#2E7D32',
    marginLeft: 8,
    fontWeight: '600',
    fontSize: 15,
  },
  deleteButtonText: {
    color: '#FF5722',
    marginLeft: 8,
    fontWeight: '600',
    fontSize: 15,
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
    paddingHorizontal: 10,
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
