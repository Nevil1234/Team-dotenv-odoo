/**
 * A simple mock storage system for demo purposes
 * This module provides a mock implementation of storage functionality
 * when the backend is not available. It keeps all data in memory.
 * 
 * @module mockStorage
 */

/**
 * In-memory storage for user and product data
 * @type {Object}
 * @property {Array} users - Array to store registered users
 * @property {Object|null} currentUser - Currently logged in user
 * @property {boolean} isAuthenticated - Authentication state
 * @property {Array} myListings - Array of product listings
 */
let mockStore = {
  users: [], // Array to store all registered users
  currentUser: null,
  isAuthenticated: false,
  myListings: [], // Array to store user's product listings
};

export const mockStorage = {
  /**
   * Stores a new user in the users array
   * 
   * @param {Object} userData - User data to store
   * @returns {Object} The stored user data
   * @throws {Error} If userData is invalid
   */
  storeUser: (userData) => {
    if (!userData || typeof userData !== 'object') {
      throw new Error('Invalid user data');
    }
    
    try {
      // Add the user to the users array
      mockStore.users.push(userData);
      console.log('User registered in mock storage:', userData);
      return userData;
    } catch (error) {
      console.error('Error storing user:', error);
      throw new Error('Failed to store user data');
    }
  },
  
  /**
   * Sets the current logged in user
   * 
   * @param {Object} userData - User data for logged in user
   * @returns {Object} The user data
   */
  setCurrentUser: (userData) => {
    if (!userData) {
      console.warn('Attempted to set empty user data');
      return null;
    }
    
    mockStore.currentUser = userData;
    mockStore.isAuthenticated = true;
    console.log('User logged in:', userData);
    return userData;
  },
  
  /**
   * Gets the current logged in user
   * 
   * @returns {Object|null} The current user or null if not logged in
   */
  getUser: () => {
    return mockStore.currentUser;
  },
  
  /**
   * Gets all registered users
   * 
   * @returns {Array} Array of all registered users
   */
  getAllUsers: () => {
    return [...mockStore.users]; // Return a copy to prevent direct mutation
  },
  
  /**
   * Checks if a user is logged in
   * 
   * @returns {boolean} True if a user is logged in, false otherwise
   */
  isAuthenticated: () => {
    return mockStore.isAuthenticated;
  },
  
  /**
   * Logs out the current user
   */
  logout: () => {
    mockStore.currentUser = null;
    mockStore.isAuthenticated = false;
    console.log('User logged out from mock storage');
  },
  
  /**
   * Adds a new product listing
   * 
   * @param {Object} product - The product data to add
   * @returns {Object} The created product with generated ID
   * @throws {Error} If product data is invalid
   */
  addProductListing: (product) => {
    if (!product || typeof product !== 'object') {
      throw new Error('Invalid product data');
    }
    
    try {
      // Generate a unique ID for the product
      const id = `p${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      const newProduct = {
        ...product,
        id,
        userId: mockStore.currentUser ? mockStore.currentUser.id : 'user1',
        status: 'active',
        createdAt: new Date().toISOString()
      };
      mockStore.myListings.push(newProduct);
      console.log('Product added to mock storage:', newProduct);
      return newProduct;
    } catch (error) {
      console.error('Error adding product listing:', error);
      throw new Error('Failed to add product listing');
    }
  },
  
  /**
   * Gets all product listings
   * 
   * @returns {Array} Array of all product listings
   */
  getProductListings: () => {
    return [...mockStore.myListings]; // Return a copy to prevent direct mutation
  },
  
  /**
   * Updates an existing product listing
   * 
   * @param {string} id - The ID of the product to update
   * @param {Object} updatedData - The new data to apply
   * @returns {Object|null} The updated product or null if not found
   * @throws {Error} If parameters are invalid
   */
  updateProductListing: (id, updatedData) => {
    if (!id || typeof id !== 'string') {
      throw new Error('Invalid product ID');
    }
    
    if (!updatedData || typeof updatedData !== 'object') {
      throw new Error('Invalid update data');
    }
    
    try {
      const index = mockStore.myListings.findIndex(product => product.id === id);
      if (index !== -1) {
        mockStore.myListings[index] = { 
          ...mockStore.myListings[index], 
          ...updatedData,
          updatedAt: new Date().toISOString() 
        };
        console.log(`Product ${id} updated successfully`);
        return mockStore.myListings[index];
      }
      console.warn(`Product ${id} not found for update`);
      return null;
    } catch (error) {
      console.error('Error updating product listing:', error);
      throw new Error('Failed to update product listing');
    }
  },
  
  /**
   * Deletes a product listing
   * 
   * @param {string} id - The ID of the product to delete
   * @returns {Object|null} The deleted product or null if not found
   * @throws {Error} If ID is invalid
   */
  deleteProductListing: (id) => {
    if (!id || typeof id !== 'string') {
      throw new Error('Invalid product ID');
    }
    
    try {
      const index = mockStore.myListings.findIndex(product => product.id === id);
      if (index !== -1) {
        const deletedProduct = mockStore.myListings[index];
        mockStore.myListings.splice(index, 1);
        console.log(`Product ${id} deleted successfully`);
        return deletedProduct;
      }
      console.warn(`Product ${id} not found for deletion`);
      return null;
    } catch (error) {
      console.error('Error deleting product listing:', error);
      throw new Error('Failed to delete product listing');
    }
  }
};
