<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="bg-white shadow">
      <div class="px-4 py-5 sm:px-6">
        <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 class="text-xl font-bold text-gray-900">Users</h2>
            <p class="mt-1 text-sm text-gray-600">
              {{ totalFilteredUsers }} users found
            </p>
          </div>
          <div class="mt-4 sm:mt-0">
            <button 
              @click="refreshUsers"
              class="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                class="h-5 w-5 mr-2" 
                :class="{ 'animate-spin': isLoading }"
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Refresh
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Filters and Search -->
    <div class="bg-white shadow rounded-lg">
      <div class="px-4 py-5 sm:p-6">
        <div class="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3">
          <!-- Search -->
          <div>
            <label class="block text-sm font-medium text-gray-700">Search</label>
            <div class="mt-1 relative rounded-md shadow-sm">
              <input
                type="text"
                v-model="searchQuery"
                @input="handleSearch"
                class="block w-full pr-10 sm:text-sm border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Search by name or email"
              />
              <div class="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                <svg class="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>
          </div>

          <!-- Gender Filter -->
          <div>
            <label class="block text-sm font-medium text-gray-700">Gender</label>
            <select
              v-model="filters.gender"
              @change="applyFilters"
              class="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
            >
              <option value="">All</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
            </select>
          </div>

          <!-- Age Range Filter -->
          <div>
            <label class="block text-sm font-medium text-gray-700">Age Range</label>
            <select
              v-model="filters.ageRange"
              @change="applyFilters"
              class="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
            >
              <option value="">All</option>
              <option value="18-25">18-25</option>
              <option value="26-35">26-35</option>
              <option value="36-45">36-45</option>
              <option value="46+">46+</option>
            </select>
          </div>
        </div>
      </div>
    </div>

    <!-- Error Message -->
    <div v-if="error" class="rounded-md bg-red-50 p-4">
      <div class="flex">
        <div class="flex-shrink-0">
          <svg class="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
          </svg>
        </div>
        <div class="ml-3">
          <h3 class="text-sm font-medium text-red-800">{{ error }}</h3>
        </div>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="isLoading" class="flex justify-center">
      <div class="inline-flex items-center px-4 py-2 font-semibold leading-6 text-indigo-600">
        <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-indigo-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        Loading users...
      </div>
    </div>

    <!-- User List -->
    <div v-else-if="filteredUsers.length === 0" class="text-center py-12">
      <svg class="mx-auto h-12 w-12 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
      </svg>
      <h3 class="mt-2 text-sm font-medium text-gray-900">No users found</h3>
      <p class="mt-1 text-sm text-gray-500">Try adjusting your search or filters.</p>
    </div>

    <div v-else class="bg-white shadow overflow-hidden sm:rounded-lg">
      <ul role="list" class="divide-y divide-gray-200">
        <li 
          v-for="user in filteredUsers" 
          :key="user.id" 
          @click="viewUserDetails(user)" 
          class="hover:bg-gray-50 cursor-pointer transition duration-150 ease-in-out"
        >
          <div class="px-4 py-4 sm:px-6">
            <div class="flex items-center justify-between">
              <div class="flex items-center">
                <img 
                  :src="user.picture" 
                  :alt="`${user.firstName} ${user.lastName}`"
                  class="h-10 w-10 rounded-full object-cover"
                />
                <div class="ml-4">
                  <p class="text-sm font-medium text-indigo-600">
                    {{ user.firstName }} {{ user.lastName }}
                  </p>
                  <p class="text-sm text-gray-500">
                    {{ user.email }}
                  </p>
                </div>
              </div>
              <div class="flex items-center space-x-4">
                <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                  :class="{
                    'bg-blue-100 text-blue-800': user.gender === 'male',
                    'bg-pink-100 text-pink-800': user.gender === 'female'
                  }"
                >
                  {{ user.gender }}
                </span>
                <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                  {{ user.age }} years
                </span>
              </div>
            </div>
            <div class="mt-2 sm:flex sm:justify-between">
              <div class="sm:flex">
                <p class="flex items-center text-sm text-gray-500">
                  <svg class="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clip-rule="evenodd" />
                  </svg>
                  {{ formatLocation(user.location) }}
                </p>
              </div>
              <div class="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                <svg class="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                </svg>
                {{ user.phone }}
              </div>
            </div>
          </div>
        </li>
      </ul>
    </div>

    <!-- Connection Status -->
    <div 
      class="fixed bottom-4 right-4 px-4 py-2 rounded-full text-sm font-medium shadow-lg"
      :class="{
        'bg-green-100 text-green-800': isConnected,
        'bg-red-100 text-red-800': !isConnected
      }"
    >
      {{ isConnected ? 'Connected' : 'Disconnected' }}
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';
import debounce from 'lodash/debounce';

export default {
  name: 'UserList',
  setup() {
    const store = useStore();
    const router = useRouter();
    const searchQuery = ref('');
    const filters = ref({
      gender: '',
      ageRange: ''
    });

    const isLoading = computed(() => store.state.users.isLoading);
    const error = computed(() => store.state.users.error);
    const filteredUsers = computed(() => store.getters['users/filteredUsers']);
    const totalFilteredUsers = computed(() => store.getters['users/totalFilteredUsers']);
    const isConnected = computed(() => store.getters['users/isConnected']);

    const handleSearch = debounce(async () => {
      try {
        await store.dispatch('users/searchUsers', searchQuery.value);
      } catch (error) {
        console.error('Search failed:', error);
      }
    }, 300);

    const applyFilters = async () => {
      try {
        await store.dispatch('users/applyFilters', filters.value);
      } catch (error) {
        console.error('Filter application failed:', error);
      }
    };

    const refreshUsers = async () => {
      try {
        await store.dispatch('users/fetchUsers');
      } catch (error) {
        console.error('Refresh failed:', error);
      }
    };

    const viewUserDetails = (user) => {
      router.push(`/users/${user.id}`);
    };

    const formatLocation = (location) => {
      if (!location) return 'Location not available';
      return `${location.city}, ${location.country}`;
    };

    onMounted(() => {
      store.dispatch('users/initializeSocket');
      store.dispatch('users/fetchUsers');
    });

    onUnmounted(() => {
      store.dispatch('users/cleanup');
    });

    return {
      searchQuery,
      filters,
      isLoading,
      error,
      filteredUsers,
      totalFilteredUsers,
      isConnected,
      handleSearch,
      applyFilters,
      refreshUsers,
      viewUserDetails,
      formatLocation
    };
  }
};
</script> 