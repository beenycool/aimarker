"use client";

// Backend URL configuration
const PRODUCTION_BACKEND_URL = 'https://165.232.94.215:3000';
const LOCAL_BACKEND_URL = 'http://localhost:3000';

// Get the API base URL based on environment
export function getApiBaseUrl() {
  if (typeof window !== 'undefined') {
    // Use local backend during development
    if (window.location.hostname === 'localhost' ||
        window.location.hostname === '127.0.0.1') {
      return LOCAL_BACKEND_URL;
    }
  }
  return PRODUCTION_BACKEND_URL;
};

// Construct API URL
export const constructApiUrl = (endpoint) => {
  const API_BASE_URL = getApiBaseUrl();
  
  // Ensure endpoint starts with 'api/'
  if (!endpoint.startsWith('api/')) {
    endpoint = endpoint.startsWith('/')
      ? `api${endpoint}`
      : `api/${endpoint}`;
  } else if (endpoint.startsWith('/api/')) {
    endpoint = endpoint.substring(1);
  }
  
  return `${API_BASE_URL}/${endpoint}`;
};

// Safe API request function
export const safeApiRequest = async (endpoint, options = {}) => {
  try {
    const apiUrl = constructApiUrl(endpoint);
    const response = await fetch(apiUrl, {
      ...options,
      signal: AbortSignal.timeout(10000) // 10 second timeout
    });
    
    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }
    return response;
  } catch (error) {
    console.error(`API request to ${endpoint} failed:`, error);
    throw error;
  }
};

// Initialize the API helpers in the global scope
export const initializeApiHelpers = () => {
  if (typeof window !== 'undefined') {
    try {
      window.API_HELPERS = window.API_HELPERS || {};
      window.BACKEND_STATUS = window.BACKEND_STATUS || { status: 'checking' };
      
      window.constructApiUrl = constructApiUrl;
      window.API_BASE_URL = getApiBaseUrl();
      
      // Set backend status
      window.BACKEND_STATUS = {
        status: 'online',
        lastChecked: new Date().toLocaleTimeString(),
        usingRemoteAPI: true
      };
      
      console.log(`Using API URL: ${getApiBaseUrl()}`);
      return true;
    } catch (error) {
      console.error('Error initializing API helpers:', error);
      
      // Create simple fallback
      window.API_HELPERS = window.API_HELPERS || {};
      window.BACKEND_STATUS = window.BACKEND_STATUS || { status: 'offline' };
      
      window.constructApiUrl = (endpoint) => {
        return `${PRODUCTION_BACKEND_URL}/${endpoint}`;
      };
      
      console.log('API helpers fallback initialized');
      return false;
    }
  }
  return false;
};
