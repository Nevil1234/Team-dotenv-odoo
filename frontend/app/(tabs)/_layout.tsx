import { Ionicons } from "@expo/vector-icons";
import { Tabs, useRouter } from "expo-router";
import { StyleSheet, Text, TouchableOpacity, View, Platform } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";


// Custom Header Component
function CustomHeader({ title, showCartIcon = true, showBackButton = false }: { title: string; showCartIcon?: boolean; showBackButton?: boolean }) {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  
  return (
    <View style={[styles.header, { paddingTop: insets.top + 12 }]}>
      <View style={styles.headerLeft}>
        {showBackButton ? (
          <TouchableOpacity 
            onPress={() => router.back()}
            style={styles.headerButton}
          >
            <Ionicons name="arrow-back" size={24} color="#2E7D32" />
          </TouchableOpacity>
        ) : (
          <View style={styles.logoContainer}>
            <Ionicons name="leaf" size={24} color="#2E7D32" />
            <Text style={styles.logoText}>EcoFinds</Text>
          </View>
        )}
      </View>
      
      {/* Show title only when there's a back button (like cart page) */}
      {showBackButton ? (
        <Text style={styles.headerTitle}>{title}</Text>
      ) : (
        <View style={styles.headerCenter} />
      )}
      
      <View style={styles.headerRight}>
        {showCartIcon && !showBackButton && (
          <TouchableOpacity 
            onPress={() => router.push('/cart')}
            style={[styles.headerButton, styles.cartButton]}
          >
            <Ionicons name="cart-outline" size={24} color="#2E7D32" />
            <View style={styles.cartBadge}>
              <Text style={styles.cartBadgeText}>2</Text>
            </View>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

export default function TabsLayout() {
  const insets = useSafeAreaInsets();
  
  return (
    <Tabs
      screenOptions={{
        headerShown: true,
        header: ({ route }) => {
          const getTitle = () => {
            switch (route.name) {
              case 'index':
                return 'Discover';
              case 'mylistings':
                return 'My Listings';
              case 'purchases':
                return 'My Orders';
              case 'profile':
                return 'Profile';
              case 'cart':
                return 'Shopping Cart';
              default:
                return 'EcoFinds';
            }
          };
          
          // Show back button and title only for cart page
          const showBackButton = route.name === 'cart';
          
          return (
            <CustomHeader 
              title={getTitle()} 
              showCartIcon={route.name !== 'cart'}
              showBackButton={showBackButton}
            />
          );
        },
        tabBarActiveTintColor: '#2E7D32',
        tabBarInactiveTintColor: '#666',
        tabBarStyle: {
          backgroundColor: 'white',
          borderTopColor: '#E8F5E8',
          paddingBottom: insets.bottom || 8, // Use bottom inset or fallback to 8
          paddingTop: 8,
          height: 70 + (insets.bottom || 0), // Adjust height based on insets
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
          marginTop: 4,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home-outline" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="mylistings"
        options={{
          title: 'Listings',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="list-outline" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="purchases"
        options={{
          title: 'Orders',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="receipt-outline" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person-outline" size={size} color={color} />
          ),
        }}
      />
      
      {/* Cart screen - hidden from tab bar but accessible via header */}
      <Tabs.Screen
        name="cart"
        options={{
          href: null, // This hides it from the tab bar
          headerShown: false, // This hides the header for cart page
          tabBarStyle: { display: 'none' }, // This hides the tab bar on the cart page
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#E8F5E8',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  headerLeft: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerCenter: {
    flex: 2,
  },
  headerButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: '#F8F9FA',
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#2E7D32',
    marginLeft: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1A1A1A',
    textAlign: 'center',
    flex: 2,
  },
  headerRight: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  cartButton: {
    marginRight: 8,
    position: 'relative',
  },
  cartBadge: {
    position: 'absolute',
    top: -2,
    right: -2,
    backgroundColor: '#FF5722',
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: 'white',
  },
  cartBadgeText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
});
