<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="bg-white shadow">
      <div class="px-4 py-5 sm:px-6">
        <h2 class="text-xl font-bold text-gray-900">Settings</h2>
        <p class="mt-1 text-sm text-gray-600">Manage your application preferences and settings</p>
      </div>
    </div>

    <!-- Settings Sections -->
    <div class="bg-white shadow rounded-lg divide-y divide-gray-200">
      <!-- Notifications Section -->
      <div class="p-6">
        <div class="flex items-center justify-between">
          <div>
            <h3 class="text-lg font-medium leading-6 text-gray-900">Notifications</h3>
            <p class="mt-1 text-sm text-gray-500">Manage how you receive notifications</p>
          </div>
          <div class="ml-4">
            <button 
              @click="saveNotificationSettings"
              class="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Save Changes
            </button>
          </div>
        </div>
        <div class="mt-6 space-y-4">
          <div class="flex items-start">
            <div class="flex items-center h-5">
              <input
                id="email_notifications"
                v-model="settings.notifications.email"
                type="checkbox"
                class="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded"
              />
            </div>
            <div class="ml-3">
              <label for="email_notifications" class="font-medium text-gray-700">Email Notifications</label>
              <p class="text-sm text-gray-500">Receive email notifications about user updates</p>
            </div>
          </div>
          <div class="flex items-start">
            <div class="flex items-center h-5">
              <input
                id="browser_notifications"
                v-model="settings.notifications.browser"
                type="checkbox"
                class="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded"
              />
            </div>
            <div class="ml-3">
              <label for="browser_notifications" class="font-medium text-gray-700">Browser Notifications</label>
              <p class="text-sm text-gray-500">Show browser notifications for real-time updates</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Display Settings -->
      <div class="p-6">
        <div class="flex items-center justify-between">
          <div>
            <h3 class="text-lg font-medium leading-6 text-gray-900">Display</h3>
            <p class="mt-1 text-sm text-gray-500">Customize your viewing experience</p>
          </div>
          <div class="ml-4">
            <button 
              @click="saveDisplaySettings"
              class="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Save Changes
            </button>
          </div>
        </div>
        <div class="mt-6 space-y-4">
          <div>
            <label for="theme" class="block text-sm font-medium text-gray-700">Theme</label>
            <select
              id="theme"
              v-model="settings.display.theme"
              class="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
            >
              <option value="light">Light</option>
              <option value="dark">Dark</option>
              <option value="system">System</option>
            </select>
          </div>
          <div>
            <label for="density" class="block text-sm font-medium text-gray-700">Display Density</label>
            <select
              id="density"
              v-model="settings.display.density"
              class="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
            >
              <option value="comfortable">Comfortable</option>
              <option value="compact">Compact</option>
            </select>
          </div>
        </div>
      </div>

      <!-- Data Settings -->
      <div class="p-6">
        <div class="flex items-center justify-between">
          <div>
            <h3 class="text-lg font-medium leading-6 text-gray-900">Data</h3>
            <p class="mt-1 text-sm text-gray-500">Manage your data preferences</p>
          </div>
          <div class="ml-4">
            <button 
              @click="saveDataSettings"
              class="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Save Changes
            </button>
          </div>
        </div>
        <div class="mt-6 space-y-4">
          <div class="flex items-start">
            <div class="flex items-center h-5">
              <input
                id="auto_refresh"
                v-model="settings.data.autoRefresh"
                type="checkbox"
                class="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded"
              />
            </div>
            <div class="ml-3">
              <label for="auto_refresh" class="font-medium text-gray-700">Auto Refresh</label>
              <p class="text-sm text-gray-500">Automatically refresh data every minute</p>
            </div>
          </div>
          <div>
            <label for="cache_duration" class="block text-sm font-medium text-gray-700">Cache Duration</label>
            <select
              id="cache_duration"
              v-model="settings.data.cacheDuration"
              class="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
            >
              <option value="0">No Cache</option>
              <option value="300">5 Minutes</option>
              <option value="900">15 Minutes</option>
              <option value="3600">1 Hour</option>
            </select>
          </div>
        </div>
      </div>
    </div>

    <!-- Success Message -->
    <div 
      v-if="showSuccess"
      class="fixed bottom-4 right-4 bg-green-50 p-4 rounded-md"
    >
      <div class="flex">
        <div class="flex-shrink-0">
          <svg class="h-5 w-5 text-green-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
          </svg>
        </div>
        <div class="ml-3">
          <p class="text-sm font-medium text-green-800">
            Settings saved successfully
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, reactive } from 'vue';

export default {
  name: 'Settings',
  setup() {
    const settings = reactive({
      notifications: {
        email: true,
        browser: true
      },
      display: {
        theme: 'system',
        density: 'comfortable'
      },
      data: {
        autoRefresh: true,
        cacheDuration: '300'
      }
    });

    const showSuccess = ref(false);

    const showSuccessMessage = () => {
      showSuccess.value = true;
      setTimeout(() => {
        showSuccess.value = false;
      }, 3000);
    };

    const saveNotificationSettings = () => {
      // TODO: Implement API call to save notification settings
      showSuccessMessage();
    };

    const saveDisplaySettings = () => {
      // TODO: Implement API call to save display settings
      showSuccessMessage();
    };

    const saveDataSettings = () => {
      // TODO: Implement API call to save data settings
      showSuccessMessage();
    };

    return {
      settings,
      showSuccess,
      saveNotificationSettings,
      saveDisplaySettings,
      saveDataSettings
    };
  }
};
</script> 