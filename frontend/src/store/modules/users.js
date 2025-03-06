import axios from 'axios';
import io from 'socket.io-client';

const state = {
  list: [],
  currentUser: null,
  lastUpdate: null,
  isLoading: false,
  error: null,
  socket: null,
  totalUsers: 0,
  searchQuery: '',
  filters: {
    gender: null,
    ageRange: null
  }
};

const mutations = {
  setUsers(state, users) {
    state.list = users;
  },
  updateUsers(state, { users, timestamp }) {
    const uniqueUsers = users.filter(newUser => 
      !state.list.some(existingUser => existingUser.apiId === newUser.apiId)
    );
    state.list = [...uniqueUsers, ...state.list];
    state.lastUpdate = timestamp;
  },
  setCurrentUser(state, user) {
    state.currentUser = user;
  },
  setLoading(state, isLoading) {
    state.isLoading = isLoading;
  },
  setError(state, error) {
    state.error = error;
  },
  setSocket(state, socket) {
    state.socket = socket;
  },
  clearSocket(state) {
    if (state.socket) {
      state.socket.disconnect();
      state.socket = null;
    }
  },
  setTotalUsers(state, total) {
    state.totalUsers = total;
  },
  setSearchQuery(state, query) {
    state.searchQuery = query;
  },
  setFilters(state, filters) {
    state.filters = { ...state.filters, ...filters };
  }
};

const actions = {
  initializeSocket({ commit, dispatch }) {
    const wsUrl = import.meta.env.VITE_WS_URL || 'http://localhost:3000';
    const socket = io(wsUrl, {
      transports: ['websocket'],
      autoConnect: true,
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      reconnectionAttempts: 5
    });

    socket.on('connect', () => {
      console.log('✓ Connected to server');
    });

    socket.on('initialUsers', (users) => {
      commit('setUsers', users);
      console.log('✓ Initial user data received');
    });

    socket.on('newUsers', ({ users, timestamp }) => {
      commit('updateUsers', { users, timestamp });
      console.log('✓ Real-time user update received');
    });

    socket.on('connect_error', (error) => {
      console.error('✗ Socket connection error:', error.message);
      commit('setError', 'Connection to server failed');
    });

    commit('setSocket', socket);
  },

  async fetchUsers({ commit, state }) {
    try {
      commit('setLoading', true);
      commit('setError', null);

      const params = new URLSearchParams();
      if (state.searchQuery) {
        params.append('query', state.searchQuery);
      }
      if (state.filters.gender) {
        params.append('gender', state.filters.gender);
      }
      if (state.filters.ageRange) {
        params.append('ageRange', state.filters.ageRange);
      }

      const response = await axios.get(`/api/users?${params.toString()}`);
      commit('setUsers', response.data);
      commit('setTotalUsers', response.data.length);
      return response.data;
    } catch (error) {
      console.error('Error fetching users:', error);
      commit('setError', error.response?.data?.message || 'Failed to fetch users');
      throw error;
    } finally {
      commit('setLoading', false);
    }
  },

  async fetchUserById({ commit }, id) {
    try {
      commit('setLoading', true);
      commit('setError', null);
      const response = await axios.get(`/api/users/${id}`);
      commit('setCurrentUser', response.data);
      return response.data;
    } catch (error) {
      console.error('Error fetching user:', error);
      commit('setError', error.response?.data?.message || 'Failed to fetch user details');
      throw error;
    } finally {
      commit('setLoading', false);
    }
  },

  async searchUsers({ commit, dispatch }, query) {
    try {
      commit('setSearchQuery', query);
      await dispatch('fetchUsers');
    } catch (error) {
      console.error('Error searching users:', error);
      commit('setError', error.response?.data?.message || 'Search failed');
    }
  },

  async applyFilters({ commit, dispatch }, filters) {
    try {
      commit('setFilters', filters);
      await dispatch('fetchUsers');
    } catch (error) {
      console.error('Error applying filters:', error);
      commit('setError', error.response?.data?.message || 'Failed to apply filters');
    }
  },

  cleanup({ commit }) {
    commit('clearSocket');
    commit('setUsers', []);
    commit('setCurrentUser', null);
    commit('setError', null);
  }
};

const getters = {
  getUserById: (state) => (id) => {
    return state.list.find(user => user.id === id) || state.currentUser;
  },
  getLastUpdate: (state) => {
    return state.lastUpdate;
  },
  isConnected: (state) => {
    return state.socket && state.socket.connected;
  },
  filteredUsers: (state) => {
    let users = state.list;
    
    if (state.searchQuery) {
      const query = state.searchQuery.toLowerCase();
      users = users.filter(user => 
        user.firstName.toLowerCase().includes(query) ||
        user.lastName.toLowerCase().includes(query) ||
        user.email.toLowerCase().includes(query)
      );
    }

    if (state.filters.gender) {
      users = users.filter(user => user.gender === state.filters.gender);
    }

    if (state.filters.ageRange) {
      const [min, max] = state.filters.ageRange.split('-').map(Number);
      users = users.filter(user => user.age >= min && user.age <= max);
    }

    return users;
  },
  totalFilteredUsers: (state, getters) => {
    return getters.filteredUsers.length;
  }
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
};