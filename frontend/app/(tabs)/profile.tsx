import React, { useState } from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity, Image, ScrollView, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

// Mock user data - would come from API in a real app
const MOCK_USER = {
  id: 'user1',
  name: 'John Doe',
  email: 'john.doe@example.com',
  phone: '+1 (555) 123-4567',
  location: 'San Francisco, CA',
  bio: 'Passionate about sustainability and finding unique second-hand items.',
  joinDate: '2025-06-01'
};

export default function Profile() {
  const [user, setUser] = useState(MOCK_USER);
  const [isEditing, setIsEditing] = useState(false);
  const [editedUser, setEditedUser] = useState({ ...MOCK_USER });
  const router = useRouter();

  const handleSave = () => {
    // Validate inputs
    if (!editedUser.name.trim()) {
      Alert.alert('Error', 'Name cannot be empty');
      return;
    }

    if (!editedUser.email.trim()) {
      Alert.alert('Error', 'Email cannot be empty');
      return;
    }

    // In a real app, this would make an API call to update the user
    setUser(editedUser);
    setIsEditing(false);
    Alert.alert('Success', 'Profile updated successfully!');
  };

  const handleLogout = () => {
    // In a real app, this would clear auth tokens etc.
    Alert.alert(
      'Confirm Logout',
      'Are you sure you want to logout?',
      [
        {
          text: 'Cancel',
          style: 'cancel'
        },
        {
          text: 'Logout',
          onPress: () => {
            // Navigate to login screen
            router.replace('/login');
          }
        }
      ]
    );
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.profileImageContainer}>
          <Image 
            source={require('../../assets/images/icon.png')} // Replace with user avatar
            style={styles.profileImage}
          />
        </View>
        
        <Text style={styles.username}>{user.name}</Text>
        <Text style={styles.joinDate}>Member since {formatDate(user.joinDate)}</Text>
        
        {!isEditing && (
          <TouchableOpacity 
            style={styles.editButton}
            onPress={() => setIsEditing(true)}
          >
            <Ionicons name="pencil" size={16} color="white" />
            <Text style={styles.editButtonText}>Edit Profile</Text>
          </TouchableOpacity>
        )}
      </View>
      
      <View style={styles.content}>
        {isEditing ? (
          // Edit Profile Form
          <View style={styles.editForm}>
            <Text style={styles.sectionTitle}>Edit Profile</Text>
            
            <Text style={styles.label}>Name</Text>
            <TextInput
              style={styles.input}
              value={editedUser.name}
              onChangeText={(text) => setEditedUser({...editedUser, name: text})}
            />
            
            <Text style={styles.label}>Email</Text>
            <TextInput
              style={styles.input}
              value={editedUser.email}
              onChangeText={(text) => setEditedUser({...editedUser, email: text})}
              keyboardType="email-address"
            />
            
            <Text style={styles.label}>Phone</Text>
            <TextInput
              style={styles.input}
              value={editedUser.phone}
              onChangeText={(text) => setEditedUser({...editedUser, phone: text})}
              keyboardType="phone-pad"
            />
            
            <Text style={styles.label}>Location</Text>
            <TextInput
              style={styles.input}
              value={editedUser.location}
              onChangeText={(text) => setEditedUser({...editedUser, location: text})}
            />
            
            <Text style={styles.label}>Bio</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              value={editedUser.bio}
              onChangeText={(text) => setEditedUser({...editedUser, bio: text})}
              multiline
              numberOfLines={4}
              textAlignVertical="top"
            />
            
            <View style={styles.formActions}>
              <TouchableOpacity 
                style={[styles.actionButton, styles.cancelButton]}
                onPress={() => {
                  setEditedUser({...user});
                  setIsEditing(false);
                }}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[styles.actionButton, styles.saveButton]}
                onPress={handleSave}
              >
                <Text style={styles.saveButtonText}>Save Changes</Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          // Profile Details
          <View style={styles.profileDetails}>
            <Text style={styles.sectionTitle}>Profile Details</Text>
            
            <View style={styles.detailRow}>
              <Ionicons name="mail-outline" size={20} color="#757575" style={styles.detailIcon} />
              <View>
                <Text style={styles.detailLabel}>Email</Text>
                <Text style={styles.detailValue}>{user.email}</Text>
              </View>
            </View>
            
            <View style={styles.detailRow}>
              <Ionicons name="call-outline" size={20} color="#757575" style={styles.detailIcon} />
              <View>
                <Text style={styles.detailLabel}>Phone</Text>
                <Text style={styles.detailValue}>{user.phone}</Text>
              </View>
            </View>
            
            <View style={styles.detailRow}>
              <Ionicons name="location-outline" size={20} color="#757575" style={styles.detailIcon} />
              <View>
                <Text style={styles.detailLabel}>Location</Text>
                <Text style={styles.detailValue}>{user.location}</Text>
              </View>
            </View>
            
            <View style={styles.bioSection}>
              <Text style={styles.bioLabel}>About Me</Text>
              <Text style={styles.bioValue}>{user.bio}</Text>
            </View>
          </View>
        )}
        
        {!isEditing && (
          <TouchableOpacity 
            style={styles.logoutButton}
            onPress={handleLogout}
          >
            <Ionicons name="log-out-outline" size={20} color="#FF5722" />
            <Text style={styles.logoutButtonText}>Logout</Text>
          </TouchableOpacity>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    backgroundColor: '#2E7D32',
    paddingTop: 20,
    paddingBottom: 30,
    alignItems: 'center',
  },
  profileImageContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  profileImage: {
    width: 90,
    height: 90,
    borderRadius: 45,
  },
  username: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 4,
  },
  joinDate: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    marginBottom: 16,
  },
  editButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  editButtonText: {
    color: 'white',
    marginLeft: 8,
  },
  content: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  profileDetails: {
    marginBottom: 20,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  detailIcon: {
    marginRight: 16,
    marginTop: 2,
  },
  detailLabel: {
    fontSize: 14,
    color: '#757575',
    marginBottom: 4,
  },
  detailValue: {
    fontSize: 16,
  },
  bioSection: {
    marginTop: 12,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#EEEEEE',
  },
  bioLabel: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 8,
  },
  bioValue: {
    fontSize: 16,
    lineHeight: 24,
    color: '#424242',
  },
  editForm: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 8,
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
  formActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  actionButton: {
    flex: 1,
    height: 48,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelButton: {
    backgroundColor: '#F5F5F5',
    marginRight: 8,
  },
  saveButton: {
    backgroundColor: '#2E7D32',
    marginLeft: 8,
  },
  cancelButtonText: {
    color: '#757575',
    fontSize: 16,
    fontWeight: '500',
  },
  saveButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '500',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    borderWidth: 1,
    borderColor: '#FF5722',
    borderRadius: 8,
    marginTop: 20,
  },
  logoutButtonText: {
    color: '#FF5722',
    fontSize: 16,
    fontWeight: '500',
    marginLeft: 8,
  },
});
