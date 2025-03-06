import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import axios from 'axios';

// Set default axios configuration
axios.defaults.baseURL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

// Set up axios interceptors for authentication
axios.interceptors.request.use(
  (config) => {
    const token = store.state.auth?.token;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Handle 401 responses
axios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      store.dispatch('auth/logout');
      router.push('/login');
    }
    return Promise.reject(error);
  }
);

const app = createApp(App);
app.use(store);
app.use(router);
app.mount('#app'); 