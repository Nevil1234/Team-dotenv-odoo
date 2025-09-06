import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState, useEffect } from 'react';
import { Alert, Image, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { mockStorage } from '../../utils/storage/mockStorage';

// Default user data if no user is found
const DEFAULT_USER = {
  id: 'user1',
  displayName: 'Ramesh',
  name: 'Ramesh',
  email: 'guest@example.com',
  phone: '1234567890',

};

export default function Profile() {
  // Get user from mockStorage or use default
  const storedUser: any = mockStorage.getUser();
  const initialUser = storedUser ? {
    ...DEFAULT_USER,
    id: storedUser.id || 'user1',
    name: storedUser.displayName || 'Guest User',
    displayName: storedUser.displayName || 'Guest User',
    email: storedUser.email || 'guest@example.com',
    phone: storedUser.phoneNumber || '+1 (555) 123-4567'
  } : DEFAULT_USER;
  
  const [user, setUser] = useState(initialUser);
  const [isEditing, setIsEditing] = useState(false);
  const [editedUser, setEditedUser] = useState({ ...initialUser });
  const router = useRouter();

  const handleSave = () => {
    if (!editedUser.name.trim()) {
      Alert.alert('Error', 'Name cannot be empty');
      return;
    }
    if (!editedUser.email.trim()) {
      Alert.alert('Error', 'Email cannot be empty');
      return;
    }
    setUser(editedUser);
    setIsEditing(false);
    Alert.alert('Success', 'Profile updated successfully!');
  };

  const handleLogout = () => {
    Alert.alert(
      'Confirm Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Logout', 
          onPress: () => {
            // Clear the auth state
            mockStorage.logout();
            // Navigate to login screen
            router.replace('/login');
          } 
        }
      ]
    );
  };

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.profileImageContainer}>
          <Image 
            source={require('../../assets/images/icon.png')}
            style={styles.profileImage}
          />
        </View>
        <Text style={styles.username}>{user.name}</Text>
        <Text style={styles.joinDate}>Member since {formatDate(user.joinDate)}</Text>
        {!isEditing && (
          <TouchableOpacity style={styles.editButton} onPress={() => setIsEditing(true)}>
            <Ionicons name="pencil" size={17} color="#FFFFFF" />
            <Text style={styles.editButtonText}>EDIT PROFILE</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Content */}
      <View style={styles.content}>
        {isEditing ? (
          // Edit Profile Form
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Edit Profile</Text>
            <Text style={styles.label}>Name</Text>
            <TextInput
              style={styles.input}
              value={editedUser.name}
              onChangeText={(text) => setEditedUser({ ...editedUser, name: text })}
              placeholder="Enter your name"
            />
            <Text style={styles.label}>Email</Text>
            <TextInput
              style={styles.input}
              value={editedUser.email}
              onChangeText={(text) => setEditedUser({ ...editedUser, email: text })}
              keyboardType="email-address"
              placeholder="Enter your email"
            />
            <Text style={styles.label}>Phone</Text>
            <TextInput
              style={styles.input}
              value={editedUser.phone}
              onChangeText={(text) => setEditedUser({ ...editedUser, phone: text })}
              keyboardType="phone-pad"
              placeholder="Enter your phone number"
            />
            <View style={styles.formActions}>
              <TouchableOpacity
                style={[styles.actionButton, styles.cancelButton]}
                onPress={() => {
                  setEditedUser({ ...user });
                  setIsEditing(false);
                }}
              >
                <Text style={styles.cancelButtonText}>CANCEL</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.actionButton, styles.saveButton]} onPress={handleSave}>
                <Text style={styles.saveButtonText}>SAVE CHANGES</Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          <>
            {/* Profile Details */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Profile Details</Text>
              <View style={styles.detailRow}>
                <Ionicons name="mail" size={20} color="#2E7D32" style={styles.detailIcon} />
                <View>
                  <Text style={styles.detailLabel}>Email</Text>
                  <Text style={styles.detailValue}>{user.email}</Text>
                </View>
              </View>
              <View style={styles.detailRow}>
                <Ionicons name="call" size={20} color="#2E7D32" style={styles.detailIcon} />
                <View>
                  <Text style={styles.detailLabel}>Phone</Text>
                  <Text style={styles.detailValue}>{user.phone}</Text>
                </View>
              </View>

            </View>

            {/* My Activity Card */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>My Activity</Text>
              <View style={styles.activityButtons}>
                <TouchableOpacity
                  style={[styles.activityButton, styles.listingsButton]}
                  onPress={() => router.push('/(tabs)/mylistings')}
                >
                  <Ionicons name="storefront" size={22} color="#FFFFFF" />
                  <Text style={styles.activityButtonText}>MY LISTINGS</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.activityButton, styles.purchasesButton]}
                  onPress={() => router.push('/(tabs)/purchases')}
                >
                  <Ionicons name="cart" size={22} color="#FFFFFF" />
                  <Text style={styles.activityButtonText}>MY PURCHASES</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Logout Button */}
            <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
              <Ionicons name="log-out" size={22} color="#EF4444" />
              <Text style={styles.logoutButtonText}>LOGOUT</Text>
            </TouchableOpacity>
          </>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F7F7',
  },
  header: {
    backgroundColor: '#2E7D32',
    paddingTop: 40,
    paddingBottom: 24,
    alignItems: 'center',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  profileImageContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    borderWidth: 4,
    borderColor: '#E8F5E9',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 4,
  },
  profileImage: {
    width: 108,
    height: 108,
    borderRadius: 54,
  },
  username: {
    fontSize: 26,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  joinDate: {
    fontSize: 14,
    color: '#E8F5E9',
    marginBottom: 16,
  },
  editButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1B5E20',
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
  },
  editButtonText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
    marginLeft: 8,
    letterSpacing: 0.5,
  },
  content: {
    padding: 20,
  },
  section: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 16,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  detailIcon: {
    marginRight: 12,
    marginTop: 4,
    color: '#2E7D32',
  },
  detailLabel: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '500',
    marginBottom: 4,
  },
  detailValue: {
    fontSize: 16,
    color: '#1F2937',
    fontWeight: '500',
  },
  editForm: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  textArea: {
    height: 120,
    paddingTop: 12,
  },
  formActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
    marginHorizontal: 4,
  },
  actionButton: {
    flex: 1,
    height: 52,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
  cancelButton: {
    backgroundColor: '#F3F4F6',
    marginRight: 10,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  saveButton: {
    backgroundColor: '#2E7D32',
    marginLeft: 10,
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#4B5563',
    letterSpacing: 0.5,
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
  activityButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 4,
    gap: 16,
  },
  activityButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 13,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 5,
    elevation: 2,
  },
  listingsButton: {
    backgroundColor: '#2E7D32',
  },
  purchasesButton: {
    backgroundColor: '#2E7D32',
  },
  activityButtonText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#FFFFFF',
    marginLeft: 5,
    letterSpacing: 0.5,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderWidth: 1.5,
    borderColor: '#EF4444',
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    marginTop: 20,
    marginHorizontal: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  logoutButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#EF4444',
    marginLeft: 10,
    letterSpacing: 0.5,
  },
});