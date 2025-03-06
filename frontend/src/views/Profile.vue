<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="bg-white shadow">
      <div class="px-4 py-5 sm:px-6">
        <h2 class="text-xl font-bold text-gray-900">Profile Settings</h2>
        <p class="mt-1 text-sm text-gray-600">Manage your account information and settings</p>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="isLoading" class="flex justify-center py-12">
      <div class="inline-flex items-center px-4 py-2 font-semibold leading-6 text-indigo-600">
        <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-indigo-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        Loading profile...
      </div>
    </div>

    <div v-else class="bg-white shadow overflow-hidden sm:rounded-lg">
      <form @submit.prevent="handleSubmit" class="divide-y divide-gray-200">
        <!-- Profile Section -->
        <div class="px-4 py-5 sm:p-6">
          <div class="grid grid-cols-1 gap-6">
            <!-- Username -->
            <div>
              <label class="block text-sm font-medium text-gray-700">Username</label>
              <div class="mt-1">
                <input
                  type="text"
                  v-model="formData.username"
                  class="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                  :disabled="true"
                />
              </div>
              <p class="mt-1 text-xs text-gray-500">Username cannot be changed</p>
            </div>

            <!-- Email -->
            <div>
              <label class="block text-sm font-medium text-gray-700">Email</label>
              <div class="mt-1">
                <input
                  type="email"
                  v-model="formData.email"
                  class="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                  required
                />
              </div>
            </div>

            <!-- Current Password -->
            <div>
              <label class="block text-sm font-medium text-gray-700">Current Password</label>
              <div class="mt-1">
                <input
                  type="password"
                  v-model="formData.currentPassword"
                  class="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                  required
                />
              </div>
            </div>

            <!-- New Password -->
            <div>
              <label class="block text-sm font-medium text-gray-700">New Password</label>
              <div class="mt-1">
                <input
                  type="password"
                  v-model="formData.newPassword"
                  class="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                />
              </div>
              <p class="mt-1 text-xs text-gray-500">Leave blank if you don't want to change</p>
            </div>

            <!-- Confirm New Password -->
            <div v-if="formData.newPassword">
              <label class="block text-sm font-medium text-gray-700">Confirm New Password</label>
              <div class="mt-1">
                <input
                  type="password"
                  v-model="formData.confirmPassword"
                  class="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                />
              </div>
            </div>
          </div>
        </div>

        <!-- Error Message -->
        <div v-if="error" class="px-4 py-5 sm:p-6">
          <div class="rounded-md bg-red-50 p-4">
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
        </div>

        <!-- Success Message -->
        <div v-if="successMessage" class="px-4 py-5 sm:p-6">
          <div class="rounded-md bg-green-50 p-4">
            <div class="flex">
              <div class="flex-shrink-0">
                <svg class="h-5 w-5 text-green-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
                </svg>
              </div>
              <div class="ml-3">
                <h3 class="text-sm font-medium text-green-800">{{ successMessage }}</h3>
              </div>
            </div>
          </div>
        </div>

        <!-- Submit Button -->
        <div class="px-4 py-3 bg-gray-50 text-right sm:px-6">
          <button
            type="submit"
            :disabled="isSubmitting"
            class="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
          >
            <svg v-if="isSubmitting" class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            {{ isSubmitting ? 'Saving...' : 'Save Changes' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import { ref, reactive, computed, onMounted } from 'vue';
import { useStore } from 'vuex';
import axios from 'axios';
import jwtDecode from 'jwt-decode';

export default {
  name: 'Profile',
  setup() {
    const store = useStore();
    const isLoading = ref(false);
    const isSubmitting = ref(false);
    const error = ref(null);
    const successMessage = ref(null);

    const formData = reactive({
      username: '',
      email: '',
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    });

    const token = computed(() => store.state.auth.token);

    const fetchUserProfile = async () => {
      try {
        isLoading.value = true;
        error.value = null;

        // Decode token to get user info
        const decoded = jwtDecode(token.value);
        formData.username = decoded.username;
        formData.email = decoded.email;

        // Fetch additional user details if needed
        const response = await axios.get('/api/auth/profile');
        // Update any additional fields from response if needed
      } catch (err) {
        error.value = 'Failed to load profile data';
        console.error('Error fetching profile:', err);
      } finally {
        isLoading.value = false;
      }
    };

    const handleSubmit = async () => {
      try {
        error.value = null;
        successMessage.value = null;
        isSubmitting.value = true;

        // Validate passwords if changing
        if (formData.newPassword) {
          if (formData.newPassword !== formData.confirmPassword) {
            throw new Error('New passwords do not match');
          }
          if (formData.newPassword.length < 8) {
            throw new Error('New password must be at least 8 characters long');
          }
          if (!/[A-Z]/.test(formData.newPassword)) {
            throw new Error('New password must contain at least one uppercase letter');
          }
          if (!/[0-9]/.test(formData.newPassword)) {
            throw new Error('New password must contain at least one number');
          }
        }

        // Prepare update data
        const updateData = {
          email: formData.email,
          currentPassword: formData.currentPassword,
          ...(formData.newPassword && { newPassword: formData.newPassword })
        };

        // Send update request
        await axios.put('/api/auth/profile', updateData);
        
        // Clear sensitive fields
        formData.currentPassword = '';
        formData.newPassword = '';
        formData.confirmPassword = '';

        successMessage.value = 'Profile updated successfully';

        // Update token if email changed
        const response = await axios.get('/api/auth/refresh-token');
        store.commit('auth/setToken', response.data.token);
      } catch (err) {
        error.value = err.response?.data?.message || err.message || 'Failed to update profile';
        console.error('Error updating profile:', err);
      } finally {
        isSubmitting.value = false;
      }
    };

    onMounted(() => {
      fetchUserProfile();
    });

    return {
      formData,
      isLoading,
      isSubmitting,
      error,
      successMessage,
      handleSubmit
    };
  }
};
</script> 