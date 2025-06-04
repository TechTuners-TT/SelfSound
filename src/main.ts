import "./assets/main.css";

import { createApp } from "vue";
import { createPinia } from "pinia";

import App from "./App.vue";
import router from "./router";

// 🔥 GLOBAL MOBILE AUTH FIX - Add this before creating the app
// This automatically enhances ALL fetch requests to your API with mobile authentication

// Store the original fetch function
const originalFetch = window.fetch;

// Create enhanced fetch that automatically adds auth headers
window.fetch = async function(input: RequestInfo | URL, init: RequestInit = {}) {
  // Only enhance requests to your API
  const API_URL = import.meta.env.VITE_API_URL;
  const url = typeof input === 'string' ? input : input instanceof URL ? input.href : input.url;
  
  if (url && url.includes(API_URL)) {
    console.log('🔧 Auto-enhancing API request with mobile auth:', url);
    
    // Get token from storage (mobile-first approach)
    const token = localStorage.getItem('authToken') || 
                 sessionStorage.getItem('authToken') || 
                 localStorage.getItem('auth_backup');
    
    if (token) {
      console.log('📱 Auto-adding Authorization header');
      
      // Clone the init object to avoid mutating the original
      const enhancedInit: RequestInit = { ...init };
      enhancedInit.headers = {
        ...enhancedInit.headers,
        'Authorization': `Bearer ${token}`
      };
      
      // Call original fetch with enhanced headers
      return originalFetch(input, enhancedInit);
    } else {
      console.log('🍪 No token found, using original request (cookies only)');
    }
  }
  
  // For non-API requests or no token, use original fetch
  return originalFetch(input, init);
};

console.log('✅ Global mobile auth interceptor installed');

// Original app setup continues normally
const app = createApp(App);

app.use(createPinia());
app.use(router);

app.mount("#app");
