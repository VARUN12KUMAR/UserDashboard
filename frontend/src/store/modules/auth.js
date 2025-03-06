import axios from 'axios';

const state = {
  token: localStorage.getItem('auth_token'),
  user: null,
  isLoading: false,
  error: null
};

const mutations = {
  setToken(state, token) {
    state.token = token;
    if (token) {
      localStorage.setItem('auth_token', token);
      // Set default auth header
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
      localStorage.removeItem('auth_token');
      delete axios.defaults.headers.common['Authorization'];
    }
  },
  setUser(state, user) {
    state.user = user;
  },
  setLoading(state, isLoading) {
    state.isLoading = isLoading;
  },
  setError(state, error) {
    state.error = error;
  },
  clearError(state) {
    state.error = null;
  }
};

const actions = {
  async login({ commit }, credentials) {
    try {
      commit('setLoading', true);
      commit('clearError');
      
      const response = await axios.post('/api/auth/login', credentials);
      const { token } = response.data.data; // Updated to match new API response format
      
      commit('setToken', token);
      
      // Fetch user profile after successful login
      const userResponse = await axios.get('/api/auth/profile');
      commit('setUser', userResponse.data.data.user);
      
      return true; // Return true to indicate successful login
    } catch (error) {
      const message = error.response?.data?.message || 'Login failed. Please try again.';
      commit('setError', message);
      throw error;
    } finally {
      commit('setLoading', false);
    }
  },

  async register({ commit }, credentials) {
    try {
      commit('setLoading', true);
      commit('clearError');
      
      const response = await axios.post('/api/auth/register', credentials);
      const { token } = response.data.data;
      
      commit('setToken', token);
      
      // Fetch user profile after successful registration
      const userResponse = await axios.get('/api/auth/profile');
      commit('setUser', userResponse.data.data.user);
      
      return true;
    } catch (error) {
      const message = error.response?.data?.message || 'Registration failed';
      commit('setError', message);
      throw error;
    } finally {
      commit('setLoading', false);
    }
  },

  async fetchProfile({ commit }) {
    try {
      const response = await axios.get('/api/auth/profile');
      commit('setUser', response.data.data.user);
    } catch (error) {
      console.error('Error fetching profile:', error);
      throw error;
    }
  },

  logout({ commit }) {
    commit('setToken', null);
    commit('setUser', null);
    commit('clearError');
  }
};

const getters = {
  isAuthenticated: state => !!state.token,
  currentUser: state => state.user,
  authError: state => state.error
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
}; 