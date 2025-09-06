import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { FlatList, Image, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { getProductImage } from '../../utils/images/productImages';

// Mock data for previous purchases - would come from API in a real app
const MOCK_PURCHASES = [
  {
    id: 'p1',
    product: {
      id: '2',
      title: 'iPhone 12 Pro',
      description: 'Used iPhone 12 Pro, 128GB, Pacific Blue. Minor scratches but works perfectly.',
      price: 550.00,
      category: 'Electronics',
      imageUrl: { uri: 'https://images.unsplash.com/photo-1603921326210-6edd2d60ca68?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OXx8aXBob25lJTIwMTIlMjBwcm98ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=500&q=60' },
      userId: 'user2'
    },
    seller: {
      id: 'user2',
      name: 'John Doe',
      rating: 4.8
    },
    date: '2025-08-15',
    quantity: 1
  },
  {
    id: 'p2',
    product: {
      id: '5',
      title: 'Harry Potter Book Set',
      description: 'Complete Harry Potter book series. Hardcover edition with minimal wear.',
      price: 65.00,
      category: 'Books',
      imageUrl: { uri: 'https://images.unsplash.com/photo-1598153346810-860daa814c4b?auto=format&fit=crop&w=500&h=500&q=80' },
      userId: 'user2'
    },
    seller: {
      id: 'user2',
      name: 'Emily Smith',
      rating: 4.6
    },
    date: '2025-07-28',
    quantity: 1
  }
];

export default function Purchases() {
  const [purchases] = useState(MOCK_PURCHASES);
  const [search, setSearch] = useState('');
  const [sortOpen, setSortOpen] = useState(false);
  const [filterOpen, setFilterOpen] = useState(false);
  const [groupOpen, setGroupOpen] = useState(false);
  const [selectedSort, setSelectedSort] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('');
  const [selectedGroup, setSelectedGroup] = useState('');
  
  const router = useRouter();

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Filter and sort purchases based on search, filters, and sort options
  const filteredPurchases = purchases.filter((purchase) => {
    // Apply search filter
    const matchesSearch = purchase.product.title.toLowerCase().includes(search.toLowerCase());
    
    // Apply filter based on selected filter
    let matchesFilter = true;
    if (selectedFilter === 'Last 30 days') {
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      matchesFilter = new Date(purchase.date) >= thirtyDaysAgo;
    } else if (selectedFilter === 'Electronics') {
      matchesFilter = purchase.product.category === 'Electronics';
    } else if (selectedFilter === 'Books') {
      matchesFilter = purchase.product.category === 'Books';
    }
    
    return matchesSearch && matchesFilter;
  });

  // Sort purchases based on selected sort option
  const sortedPurchases = [...filteredPurchases].sort((a, b) => {
    if (selectedSort === 'Date: newest') {
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    } else if (selectedSort === 'Date: oldest') {
      return new Date(a.date).getTime() - new Date(b.date).getTime();
    } else if (selectedSort === 'Price: low') {
      return a.product.price - b.product.price;
    } else if (selectedSort === 'Price: high') {
      return b.product.price - a.product.price;
    } else if (selectedSort === 'Name') {
      return a.product.title.localeCompare(b.product.title);
    }
    return 0; // Default: newest first
  });

  // Group purchases based on selected group option
  const groupedPurchases = () => {
    if (selectedGroup === 'Category') {
      // Group by category
      const groups: Record<string, typeof purchases> = {};
      sortedPurchases.forEach(purchase => {
        if (!groups[purchase.product.category]) {
          groups[purchase.product.category] = [];
        }
        groups[purchase.product.category].push(purchase);
      });
      return groups;
    } else if (selectedGroup === 'Date') {
      // Group by month/year
      const groups: Record<string, typeof purchases> = {};
      sortedPurchases.forEach(purchase => {
        const date = new Date(purchase.date);
        const monthYear = `${date.toLocaleString('default', { month: 'long' })} ${date.getFullYear()}`;
        if (!groups[monthYear]) {
          groups[monthYear] = [];
        }
        groups[monthYear].push(purchase);
      });
      return groups;
    }
    
    // No grouping
    return null;
  };
  
  const purchasesToDisplay = selectedGroup ? null : sortedPurchases;

  const renderPurchaseItem = ({ item }: { item: typeof purchases[0] }) => (
    <TouchableOpacity 
      style={styles.purchaseItem}
      onPress={() => router.push(`/orderSummary/${item.id}`)}
    >
      <View style={styles.imageContainer}>
        <Image 
          source={item.product.imageUrl || getProductImage(item.product.title, item.product.category)}
          style={styles.productImage}
          resizeMode="cover"
        />
      </View>
      
      <View style={styles.itemInfo}>
        <View style={styles.titleRow}>
          <Text style={styles.itemTitle} numberOfLines={1}>{item.product.title}</Text>
          <Text style={styles.itemCategory}>{item.product.category}</Text>
        </View>
        
        <Text style={styles.itemPrice}>₹{item.product.price.toFixed(2)}</Text>
        
        <View style={styles.sellerRow}>
          <Ionicons name="person-outline" size={14} color="#757575" style={styles.icon} />
          <Text style={styles.sellerText}>
            Seller: {item.seller.name}
          </Text>
        </View>
        
        <View style={styles.dateRow}>
          <Ionicons name="calendar-outline" size={14} color="#757575" style={styles.icon} />
          <Text style={styles.itemDate}>Purchased on {formatDate(item.date)}</Text>
        </View>
      </View>
      
      <Ionicons name="chevron-forward" size={24} color="#BDBDBD" />
    </TouchableOpacity>
  );

  // Render content based on grouping
  const renderContent = () => {
    if (selectedGroup) {
      const groups = groupedPurchases();
      if (!groups) return null;
      
      return (
        <>
          {Object.entries(groups).map(([groupName, groupPurchases]) => (
            <View key={groupName}>
              <Text style={styles.groupHeader}>{groupName} ({groupPurchases.length})</Text>
              {groupPurchases.map(purchase => (
                <View key={purchase.id}>
                  {renderPurchaseItem({ item: purchase })}
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
        data={sortedPurchases}
        renderItem={renderPurchaseItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.purchasesList}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Ionicons name="bag-handle-outline" size={80} color="#BDBDBD" />
            <Text style={styles.emptyStateTitle}>No purchases yet</Text>
            <Text style={styles.emptyStateDescription}>
              Your purchase history will appear here
            </Text>
            
            <TouchableOpacity 
              style={styles.shopNowButton}
              onPress={() => router.push('/')}
            >
              <Text style={styles.shopNowButtonText}>Shop Now</Text>
            </TouchableOpacity>
          </View>
        }
      />
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Purchase History</Text>
      
      {/* Search Bar */}
      <View style={styles.searchWrap}>
        <Ionicons name="search" size={20} color="#6b7280" />
        <TextInput
          style={styles.searchInput}
          placeholder="Search purchases…"
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
          options={['Date: newest', 'Date: oldest', 'Price: low', 'Price: high', 'Name']}
          selectedOption={selectedSort}
          onSelect={setSelectedSort}
        />
        <Dropdown
          label="Filter"
          open={filterOpen}
          setOpen={setFilterOpen}
          options={['Last 30 days', 'Electronics', 'Books']}
          selectedOption={selectedFilter}
          onSelect={setSelectedFilter}
        />
        <Dropdown
          label="Group"
          open={groupOpen}
          setOpen={setGroupOpen}
          options={['Category', 'Date']}
          selectedOption={selectedGroup}
          onSelect={setSelectedGroup}
        />
      </View>
      
      {/* Content */}
      {purchases.length > 0 ? (
        renderContent()
      ) : (
        <View style={styles.emptyState}>
          <Ionicons name="bag-handle-outline" size={80} color="#BDBDBD" />
          <Text style={styles.emptyStateTitle}>No purchases yet</Text>
          <Text style={styles.emptyStateDescription}>
            Your purchase history will appear here
          </Text>
          
          <TouchableOpacity 
            style={styles.shopNowButton}
            onPress={() => router.push('/')}
          >
            <Text style={styles.shopNowButtonText}>Shop Now</Text>
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
    backgroundColor: '#fff',
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
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
  purchasesList: {
    flexGrow: 1,
  },
  purchaseItem: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
    paddingVertical: 16,
  },
  imageContainer: {
    width: 70,
    height: 70,
    borderRadius: 8,
    backgroundColor: '#F5F5F5',
    marginRight: 16,
    overflow: 'hidden',
  },
  productImage: {
    width: '100%',
    height: '100%',
  },
  itemInfo: {
    flex: 1,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  itemTitle: {
    fontSize: 16,
    fontWeight: '500',
    flex: 1,
  },
  itemCategory: {
    fontSize: 12,
    color: '#ffffff',
    backgroundColor: '#4CAF50',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
    overflow: 'hidden',
    marginLeft: 8,
  },
  itemPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2E7D32',
    marginBottom: 6,
  },
  sellerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  dateRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    marginRight: 4,
  },
  sellerText: {
    fontSize: 14,
    color: '#424242',
  },
  itemDate: {
    fontSize: 14,
    color: '#757575',
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
  shopNowButton: {
    backgroundColor: '#2E7D32',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  shopNowButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '500',
  },
});
