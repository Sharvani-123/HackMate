import { auth } from '../firebase';

// Backend API base URL
const API_BASE_URL = 'http://localhost:5000/api';

// Helper function to get Firebase token
const getAuthToken = async () => {
  const user = auth.currentUser;
  if (!user) throw new Error('User not authenticated');
  return await user.getIdToken();
};

// Check if user profile exists in backend
export const checkIfUserProfileExists = async (uid) => {
  try {
    const token = await getAuthToken();
    const response = await fetch(`${API_BASE_URL}/users/profile`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    
    if (response.status === 404) {
      return false; // Profile doesn't exist
    }
    
    if (response.ok) {
      return true; // Profile exists
    }
    
    throw new Error('Failed to check user profile');
  } catch (error) {
    console.error('Error checking user profile:', error);
    return false; // Assume profile doesn't exist on error
  }
};

// Create user profile in backend
export const createUserProfile = async (profileData) => {
  try {
    const token = await getAuthToken();
    console.log('Creating profile with data:', profileData); // Debug log
    
    const response = await fetch(`${API_BASE_URL}/users/profile`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(profileData)
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      console.error('Backend error response:', errorData); // Debug log
      throw new Error(`Failed to create user profile: ${errorData.message || response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error creating user profile:', error);
    throw error;
  }
};

// Get user profile from backend
export const getUserProfile = async () => {
  try {
    const token = await getAuthToken();
    const response = await fetch(`${API_BASE_URL}/users/profile`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    
    if (!response.ok) {
      throw new Error('Failed to get user profile');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error getting user profile:', error);
    throw error;
  }
};

// Update user profile in backend
export const updateUserProfile = async (profileData) => {
  try {
    const token = await getAuthToken();
    const response = await fetch(`${API_BASE_URL}/users/profile`, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(profileData)
    });
    
    if (!response.ok) {
      throw new Error('Failed to update user profile');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error updating user profile:', error);
    throw error;
  }
};
