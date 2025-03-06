<template>
  <div class="bg-white shadow overflow-hidden sm:rounded-lg">
    <div v-if="isLoading" class="p-8 text-center">
      <div class="inline-flex items-center px-4 py-2 font-semibold leading-6 text-indigo-600">
        <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-indigo-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        Loading user details...
      </div>
    </div>

    <div v-else-if="error" class="p-4 text-center">
      <div class="text-red-600">{{ error }}</div>
    </div>

    <template v-else-if="user">
      <div class="px-4 py-5 sm:px-6">
        <div class="flex items-center">
          <img 
            :src="user.picture" 
            :alt="user.firstName"
            class="h-20 w-20 rounded-full mr-4"
          />
          <div>
            <h3 class="text-lg leading-6 font-medium text-gray-900">
              {{ user.firstName }} {{ user.lastName }}
            </h3>
            <p class="mt-1 max-w-2xl text-sm text-gray-500">Personal details</p>
          </div>
        </div>
      </div>
      <div class="border-t border-gray-200">
        <dl>
          <div class="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <dt class="text-sm font-medium text-gray-500">Full name</dt>
            <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
              {{ user.firstName }} {{ user.lastName }}
            </dd>
          </div>
          <div class="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <dt class="text-sm font-medium text-gray-500">Email address</dt>
            <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
              {{ user.email }}
            </dd>
          </div>
          <div class="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <dt class="text-sm font-medium text-gray-500">Age</dt>
            <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
              {{ user.age }} years
            </dd>
          </div>
          <div class="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <dt class="text-sm font-medium text-gray-500">Gender</dt>
            <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
              {{ capitalizeFirst(user.gender) }}
            </dd>
          </div>
          <div class="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <dt class="text-sm font-medium text-gray-500">Phone number</dt>
            <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
              {{ user.phone }}
            </dd>
          </div>
          <div class="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <dt class="text-sm font-medium text-gray-500">Location</dt>
            <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
              <div>{{ formatStreet(user.location.street) }}</div>
              <div>{{ user.location.city }}, {{ user.location.state }}</div>
              <div>{{ user.location.country }}</div>
            </dd>
          </div>
        </dl>
      </div>
      <div class="px-4 py-3 bg-gray-50 text-right sm:px-6">
        <button
          type="button"
          @click="goBack"
          class="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Back to Users
        </button>
      </div>
    </template>

    <div v-else class="p-8 text-center">
      <p class="text-gray-500">User not found</p>
    </div>
  </div>
</template>

<script>
import { computed, onMounted } from 'vue';
import { useStore } from 'vuex';
import { useRoute, useRouter } from 'vue-router';

export default {
  name: 'UserDetail',
  setup() {
    const store = useStore();
    const route = useRoute();
    const router = useRouter();
    const userId = route.params.id;

    const user = computed(() => store.getters['users/getUserById'](userId));
    const isLoading = computed(() => store.state.users.isLoading);
    const error = computed(() => store.state.users.error);

    const capitalizeFirst = (str) => {
      return str.charAt(0).toUpperCase() + str.slice(1);
    };

    const formatStreet = (street) => {
      return `${street.number} ${street.name}`;
    };

    const goBack = () => {
      router.push('/users');
    };

    onMounted(async () => {
      if (!user.value) {
        await store.dispatch('users/fetchUserById', userId);
      }
    });

    return {
      user,
      isLoading,
      error,
      capitalizeFirst,
      formatStreet,
      goBack
    };
  }
};
</script> 