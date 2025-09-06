import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Alert, FlatList, Image, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

// Mock data for user's listings - would come from API in a real app
type Listing = {
  id: string;
  title: string;
  description: string;
  price: number;
  category: string;
  imageUrl: string | null;
  userId: string;
  status: string;
};

const MOCK_MY_LISTINGS: Listing[] = [
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
<<<<<<< Updated upstream
  const [listings, setListings] = useState(MOCK_MY_LISTINGS);
  const [search, setSearch] = useState('');
  const [sortOpen, setSortOpen] = useState(false);
  const [filterOpen, setFilterOpen] = useState(false);
  const [groupOpen, setGroupOpen] = useState(false);
  const [selectedSort, setSelectedSort] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('');
  const [selectedGroup, setSelectedGroup] = useState('');
=======
  const [listings, setListings] = useState<Listing[]>(MOCK_MY_LISTINGS);
>>>>>>> Stashed changes
  const router = useRouter();

  const handleDelete = (id: string) => {
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

<<<<<<< Updated upstream
  // Filter listings based on search and filter options
  const filteredListings = listings.filter((listing) => {
    // Apply search filter
    const matchesSearch = listing.title.toLowerCase().includes(search.toLowerCase()) || 
                          listing.description.toLowerCase().includes(search.toLowerCase());
    
    // Apply filter based on selected filter
    let matchesFilter = true;
    if (selectedFilter === 'Active') {
      matchesFilter = listing.status === 'active';
    } else if (selectedFilter === 'Sold') {
      matchesFilter = listing.status === 'sold';
    } else if (selectedFilter === 'Clothing') {
      matchesFilter = listing.category === 'Clothing';
    } else if (selectedFilter === 'Electronics') {
      matchesFilter = listing.category === 'Electronics';
    } else if (selectedFilter === 'Furniture') {
      matchesFilter = listing.category === 'Furniture';
    }
    
    return matchesSearch && matchesFilter;
  });

  // Sort listings based on selected sort option
  const sortedListings = [...filteredListings].sort((a, b) => {
    if (selectedSort === 'Price: low') {
      return a.price - b.price;
    } else if (selectedSort === 'Price: high') {
      return b.price - a.price;
    } else if (selectedSort === 'Name') {
      return a.title.localeCompare(b.title);
    }
    return 0; // Default: no sorting
  });

  // Group listings based on selected group option
  const groupedListings = () => {
    if (selectedGroup === 'Category') {
      // Group by category
      const groups: Record<string, typeof listings> = {};
      sortedListings.forEach(listing => {
        if (!groups[listing.category]) {
          groups[listing.category] = [];
        }
        groups[listing.category].push(listing);
      });
      return groups;
    } else if (selectedGroup === 'Status') {
      // Group by status
      const groups: Record<string, typeof listings> = {
        'Active': [],
        'Sold': []
      };
      
      sortedListings.forEach(listing => {
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
  };
  
  const listingsToDisplay = selectedGroup ? null : sortedListings;

  const renderListingItem = ({ item }: { item: typeof listings[0] }) => (
=======
  const renderListingItem = ({ item }: { item: Listing }) => (
>>>>>>> Stashed changes
    <View style={styles.listingItem}>
      <TouchableOpacity 
        style={styles.listingContent}
        onPress={() => router.push(`/product/${item.id}`)}
        activeOpacity={0.85}
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
<<<<<<< Updated upstream
          style={[styles.actionButton, styles.editButton]}
          onPress={() => router.push(`/product/${item.id}`)}
=======
          style={[styles.actionButton, styles.editButton, {backgroundColor: '#E8F5E9', borderTopLeftRadius: 8}]}
          onPress={() => router.push(`/editProduct/${item.id}`)}
          activeOpacity={0.8}
>>>>>>> Stashed changes
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

  // Render content based on grouping
  const renderContent = () => {
    if (selectedGroup) {
      const groups = groupedListings();
      if (!groups) return null;
      
      return (
        <>
          {Object.entries(groups).map(([groupName, groupListings]) => (
            <View key={groupName}>
              <Text style={styles.groupHeader}>{groupName} ({groupListings.length})</Text>
              {groupListings.map(listing => (
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
        ListEmptyComponent={
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
        }
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
          options={['Price: low', 'Price: high', 'Name']}
          selectedOption={selectedSort}
          onSelect={setSelectedSort}
        />
        <Dropdown
          label="Filter"
          open={filterOpen}
          setOpen={setFilterOpen}
          options={['Active', 'Sold', 'Clothing', 'Electronics', 'Furniture']}
          selectedOption={selectedFilter}
          onSelect={setSelectedFilter}
        />
        <Dropdown
          label="Group"
          open={groupOpen}
          setOpen={setGroupOpen}
          options={['Category', 'Status']}
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
}) {
  return (
    <View style={{ flex: 1 }}>
      <TouchableOpacity style={styles.dropdownBtn} onPress={() => setOpen(!open)}>
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
            onPress={() => {
              onSelect('');
              setOpen(false);
            }}
          >
            <Text>Clear</Text>
          </TouchableOpacity>
          {options.map((o) => (
            <TouchableOpacity 
              key={o} 
              style={[
                styles.dropdownItem,
                selectedOption === o && styles.selectedDropdownItem
              ]}
              onPress={() => {
                onSelect(o);
                setOpen(false);
              }}
            >
              <Text style={selectedOption === o ? styles.selectedDropdownText : undefined}>{o}</Text>
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
