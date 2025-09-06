// app/index.tsx
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  Dimensions,
  FlatList,
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';

const { width } = Dimensions.get('window');

const MOCK_PRODUCTS = [
  { id: '1', title: 'Vintage Leather Jacket', price: 75, category: 'Clothing' },
  { id: '2', title: 'iPhone 12 Pro', price: 550, category: 'Electronics' },
  { id: '3', title: 'Mid-Century Chair', price: 120, category: 'Furniture' },
  { id: '4', title: 'Trek Mountain Bike', price: 380, category: 'Sports' },
  { id: '5', title: 'Harry Potter Set', price: 65, category: 'Books' },
];

const CATEGORIES = [
  { name: 'Clothing', icon: 'shirt' },
  { name: 'Electronics', icon: 'phone-portrait' },
  { name: 'Furniture', icon: 'cube' },
  { name: 'Sports', icon: 'bicycle' },
  { name: 'Books', icon: 'book' },
];

const BANNERS = [
  'https://picsum.photos/800/300?random=1',
  'https://picsum.photos/800/300?random=2',
  'https://picsum.photos/800/300?random=3',
];


export default function Index() {
  const router = useRouter();
  const [search, setSearch] = useState('');
  const [sortOpen, setSortOpen] = useState(false);
  const [filterOpen, setFilterOpen] = useState(false);
  const [groupOpen, setGroupOpen] = useState(false);
  const [selectedSort, setSelectedSort] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('');
  const [selectedGroup, setSelectedGroup] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');

  /* ---------- filtering ---------- */
  const filtered = MOCK_PRODUCTS.filter((p) => {
    // Apply search filter
    const matchesSearch = p.title.toLowerCase().includes(search.toLowerCase());
    
    // Apply category filter if selected
    const matchesCategory = selectedCategory ? p.category === selectedCategory : true;
    
    // Apply condition filter if selected
    let matchesCondition = true;
    if (selectedFilter === 'New') {
      // Simulating condition - in a real app this would be a product property
      matchesCondition = parseInt(p.id) % 2 === 0; // Even IDs are "New" for demo
    } else if (selectedFilter === 'Used') {
      matchesCondition = parseInt(p.id) % 2 !== 0; // Odd IDs are "Used" for demo
    } else if (selectedFilter === 'Free-ship') {
      matchesCondition = p.price > 100; // Items over $100 have free shipping for demo
    }
    
    return matchesSearch && matchesCategory && matchesCondition;
  });

  /* ---------- sorting ---------- */
  const sortedProducts = [...filtered].sort((a, b) => {
    if (selectedSort === 'Price: low') {
      return a.price - b.price;
    } else if (selectedSort === 'Price: high') {
      return b.price - a.price;
    } else if (selectedSort === 'Name') {
      return a.title.localeCompare(b.title);
    }
    return 0; // Default: no sorting
  });

  /* ---------- grouping ---------- */
  const groupedProducts = () => {
    if (selectedGroup === 'Category') {
      // Group by category
      const groups: Record<string, typeof MOCK_PRODUCTS> = {};
      sortedProducts.forEach(product => {
        if (!groups[product.category]) {
          groups[product.category] = [];
        }
        groups[product.category].push(product);
      });
      return groups;
    } else if (selectedGroup === 'Price') {
      // Group by price range
      const groups: Record<string, typeof MOCK_PRODUCTS> = {
        'Under $100': [],
        '$100 - $300': [],
        'Over $300': []
      };
      
      sortedProducts.forEach(product => {
        if (product.price < 100) {
          groups['Under $100'].push(product);
        } else if (product.price <= 300) {
          groups['$100 - $300'].push(product);
        } else {
          groups['Over $300'].push(product);
        }
      });
      return groups;
    }
    
    // No grouping
    return null;
  };
  
  const productsToDisplay = selectedGroup ? null : sortedProducts;

  /* ---------- renderers ---------- */
  const renderProduct = ({ item }: any) => (
    <TouchableOpacity
      style={styles.productCard}
      onPress={() => router.push(`/product/${item.id}`)}>
      <Image
        source={require('../../assets/images/splash-icon.png')}
        style={styles.productImage}
      />
      <Text style={styles.productTitle} numberOfLines={1}>
        {item.title}
      </Text>
      <Text style={styles.productPrice}>${item.price.toFixed(2)}</Text>
    </TouchableOpacity>
  );

  const renderCategory = ({ item }: any) => (
    <TouchableOpacity
      style={[styles.catCard, selectedCategory === item.name && styles.selectedCatCard]}
      onPress={() => setSelectedCategory(selectedCategory === item.name ? '' : item.name)}>
      <Ionicons 
        name={item.icon as any} 
        size={28} 
        color={selectedCategory === item.name ? "#ffffff" : "#166534"} 
      />
      <Text 
        style={[styles.catLabel, selectedCategory === item.name && styles.selectedCatLabel]}
      >
        {item.name}
      </Text>
    </TouchableOpacity>
  );

  const renderBanner = ({ item }: any) => (
    <Image source={{ uri: item }} style={styles.bannerImage} />
  );

  /* ---------- UI ---------- */
  // Determine what to render based on grouping
  const renderContent = () => {
    if (selectedGroup) {
      const groups = groupedProducts();
      if (!groups) return null;
      
      return (
        <>
          {Object.entries(groups).map(([groupName, products]) => (
            <View key={groupName}>
              <Text style={styles.groupHeader}>{groupName} ({products.length})</Text>
              <View style={styles.colWrap}>
                {products.map(product => (
                  <View key={product.id} style={{ width: '48%' }}>
                    {renderProduct({ item: product })}
                  </View>
                ))}
              </View>
            </View>
          ))}
        </>
      );
    }
    
    // Default rendering with FlatList when no grouping
    return (
      <FlatList
        data={sortedProducts}
        keyExtractor={(i) => i.id}
        numColumns={2}
        renderItem={renderProduct}
        ListEmptyComponent={<Text style={styles.empty}>No products found</Text>}
        columnWrapperStyle={styles.colWrap}
      />
    );
  };
  
  return (
    <FlatList
      data={selectedGroup ? [] : sortedProducts}
      keyExtractor={(i) => i.id}
      numColumns={2}
      renderItem={renderProduct}
      ListHeaderComponent={
        <>
          {/* 1. Search ------------------------------------------------------- */}
          <View style={styles.searchWrap}>
            <Ionicons name="search" size={20} color="#6b7280" />
            <TextInput
              style={styles.searchInput}
              placeholder="Search products…"
              value={search}
              onChangeText={setSearch}
            />
          </View>

          {/* 2. Dropdowns ---------------------------------------------------- */}
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
              options={['New', 'Used', 'Free-ship']}
              selectedOption={selectedFilter}
              onSelect={setSelectedFilter}
            />
            <Dropdown
              label="Group"
              open={groupOpen}
              setOpen={setGroupOpen}
              options={['Category', 'Price']}
              selectedOption={selectedGroup}
              onSelect={setSelectedGroup}
            />
          </View>

          {/* 3. Banners ------------------------------------------------------ */}
          <FlatList
            data={BANNERS}
            renderItem={renderBanner}
            keyExtractor={(_, i) => i.toString()}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            style={styles.bannerList}
          />

          {/* 4. Category cards ---------------------------------------------- */}
          <Text style={styles.sectionTitle}>Categories</Text>
          <FlatList
            data={CATEGORIES}
            renderItem={renderCategory}
            keyExtractor={(c) => c.name}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.catList}
          />

          {/* 5. Products title ---------------------------------------------- */}
          <Text style={styles.sectionTitle}>All Products</Text>
        </>
      }
      contentContainerStyle={styles.listContainer}
      columnWrapperStyle={styles.colWrap}
      ListEmptyComponent={
        selectedGroup ? null : <Text style={styles.empty}>No products found</Text>
      }
      ListFooterComponent={
        selectedGroup ? renderContent() : null
      }
    />
  );
}

/* -------------------------------------------------------------------------- */
/*                               Dropdown                                     */
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
              <Text style={selectedOption === o ? styles.selectedDropdownText : null}>{o}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  );
}

/* -------------------------------------------------------------------------- */
/*                               Styles                                       */
/* -------------------------------------------------------------------------- */
const styles = StyleSheet.create({
  listContainer: { paddingBottom: 32, backgroundColor: '#f5f5f5' },
  searchWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    margin: 16,
    marginBottom: 5,
    paddingHorizontal: 10,
    height: 48,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  searchInput: { flex: 1, marginLeft: 8, fontSize: 16 },
  dropdownRow: { flexDirection: 'row', gap: 8, paddingHorizontal: 16, marginBottom: 12 },
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
  dropdownLbl: { fontSize: 14, color: '#374151' },
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
  bannerList: { height: 320, marginBottom: 10 },
  bannerImage: { width: width - 32, height: 320, borderRadius: 10, marginHorizontal: 16 },
  sectionTitle: { fontSize: 18, fontWeight: '600', marginLeft: 16, marginBottom: 12, color: '#111' },
  catList: { paddingHorizontal: 16, marginBottom: 20 },
  catCard: {
    width: 80,
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingVertical: 12,
    marginRight: 12,
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  selectedCatCard: {
    backgroundColor: '#15803d',
  },
  catLabel: { marginTop: 6, fontSize: 12, color: '#374151' },
  selectedCatLabel: { color: '#ffffff' },
  colWrap: { justifyContent: 'space-between', paddingHorizontal: 16 },
  productCard: {
    width: '48%',
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 8,
    marginBottom: 12,
    elevation: 1,
  },
  productImage: { width: '100%', height: 120, borderRadius: 8, marginBottom: 8 },
  productTitle: { fontSize: 14, fontWeight: '500' },
  productPrice: { fontSize: 16, fontWeight: 'bold', color: '#15803d', marginTop: 4 },
  empty: { textAlign: 'center', marginTop: 40, color: '#9ca3af' },
  groupHeader: {
    fontSize: 16,
    fontWeight: '600',
    backgroundColor: '#f9fafb',
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginBottom: 8,
  },
});