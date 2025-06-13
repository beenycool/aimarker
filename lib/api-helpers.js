"use client";

// Backend URL configuration
const PRODUCTION_BACKEND_URL = 'https://api.aimarker.tech';
const BACKEND_PORT = '3000'; // Fixed backend port

// Get the backend port (always use 3000 for local development)
function getBackendPort() {
  return BACKEND_PORT;
}

// Get the current frontend port from window.location (for debugging only)
function getCurrentFrontendPort() {
  if (typeof window !== 'undefined') {
    // Handle default ports correctly
    const port = window.location.port;
    if (!port || port === '') {
      // Default ports: 80 for HTTP, 443 for HTTPS
      return window.location.protocol === 'https:' ? '443' : '80';
    }
    return port;
  }
  return '3000';
}

// Get the API base URL based on environment
export function getApiBaseUrl() {
  let url;
  if (typeof window !== 'undefined') {
    // Use local backend during development
    if (window.location.hostname === 'localhost' ||
        window.location.hostname === '127.0.0.1') {
      // Always use the backend port (3000), not the frontend port
      const backendPort = getBackendPort();
      url = `http://localhost:${backendPort}`;
    } else {
      url = PRODUCTION_BACKEND_URL;
    }
    console.log(`[API-HELPERS] Current hostname: ${window.location.hostname}, frontend port: ${getCurrentFrontendPort()}, backend port: ${getBackendPort()}, Using API URL: ${url}`);
  } else {
    url = PRODUCTION_BACKEND_URL;
    console.log(`[API-HELPERS] Server-side, Using API URL: ${url}`);
  }
  return url;
};

// Construct API URL
export const constructApiUrl = (endpoint) => {
  const API_BASE_URL = getApiBaseUrl();
  
  // Handle different endpoint formats
  let cleanEndpoint = endpoint;
  
  // Remove leading slash if present
  if (cleanEndpoint.startsWith('/')) {
    cleanEndpoint = cleanEndpoint.substring(1);
  }
  
  // Remove 'api/' prefix if present (we'll add it back)
  if (cleanEndpoint.startsWith('api/')) {
    cleanEndpoint = cleanEndpoint.substring(4);
  }
  
  // Ensure endpoint doesn't start with another slash
  if (cleanEndpoint.startsWith('/')) {
    cleanEndpoint = cleanEndpoint.substring(1);
  }
  
  return `${API_BASE_URL}/api/${cleanEndpoint}`;
};

// Safe API request function
export const safeApiRequest = async (endpoint, options = {}) => {
  try {
    const apiUrl = constructApiUrl(endpoint);
    
    // Create AbortController for timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout
    
    const response = await fetch(apiUrl, {
      ...options,
      signal: controller.signal
    });
    
    clearTimeout(timeoutId);
    
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
