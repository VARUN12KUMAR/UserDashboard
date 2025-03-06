<template>
  <div class="min-h-screen bg-gray-100">
    <nav v-if="isAuthenticated" class="bg-white shadow-sm">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between h-16">
          <div class="flex">
            <router-link to="/dashboard" class="flex items-center px-4 hover:text-blue-600">
              Dashboard
            </router-link>
            <router-link to="/users" class="flex items-center px-4 hover:text-blue-600">
              Users
            </router-link>
            <router-link to="/profile" class="flex items-center px-4 hover:text-blue-600">
              Profile
            </router-link>
          </div>
          <div class="flex items-center">
            <button @click="handleLogout" class="px-4 py-2 text-red-600 hover:text-red-800">
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>

    <main class="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <router-view></router-view>
    </main>
  </div>
</template>

<script>
import { computed } from 'vue';
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';

export default {
  name: 'App',
  setup() {
    const store = useStore();
    const router = useRouter();

    const isAuthenticated = computed(() => store.getters['auth/isAuthenticated']);

    const handleLogout = async () => {
      await store.dispatch('auth/logout');
      router.push('/login');
    };

    return {
      isAuthenticated,
      handleLogout
    };
  }
};
</script>

<style>
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer components {
  .nav-link {
    @apply flex items-center px-3 py-2 rounded-md text-sm font-medium text-white hover:bg-white/10 transition-colors duration-200;
  }

  .nav-link-active {
    @apply bg-white/20;
  }

  .mobile-nav-link {
    @apply flex items-center px-3 py-3 rounded-md text-base font-medium text-white hover:bg-white/10 transition-colors duration-200;
  }

  .mobile-nav-link-active {
    @apply bg-white/20;
  }

  .user-menu-item {
    @apply flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors duration-150;
  }
}
</style> 