import axios from 'axios';

const state = {
  token: localStorage.getItem('auth_token'),
  isLoading: false,
  error: null
};

const mutations = {
  setToken(state, token) {
    state.token = token;
    if (token) {
      localStorage.setItem('auth_token', token);
    } else {
      localStorage.removeItem('auth_token');
    }
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
      commit('setError', null);
      const { data } = await axios.post('/api/auth/login', {
        username: credentials.username,
        email: credentials.email,
        password: credentials.password
      });
      commit('setToken', data.token);
      return data;
    } catch (error) {
      const message = error.response?.data?.message || 'Login failed. Please try again.';
      commit('setError', message);
      throw error;
    } finally {
      commit('setLoading', false);
    }
  },

  async register({ commit }, { username,email, password }) {
    try {
      commit('setLoading', true);
      commit('clearError');
      
      const response = await axios.post('/api/auth/register', {
        username,
        email,
        password
      });
      
      const token = response.data.token;
      commit('setToken', token);
      
      return token;
    } catch (error) {
      const message = error.response?.data?.message || 'Registration failed';
      commit('setError', message);
      throw error;
    } finally {
      commit('setLoading', false);
    }
  },

  logout({ commit }) {
    commit('setToken', null);
    commit('clearError');
  }
};

const getters = {
  isAuthenticated: state => !!state.token
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
}; 