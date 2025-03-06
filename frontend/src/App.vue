<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Navbar -->
    <nav class="bg-gradient-to-r from-indigo-600 to-purple-600 shadow-lg">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex items-center justify-between h-16">
          <!-- Logo and Brand -->
          <div class="flex-shrink-0 flex items-center">
            <router-link to="/" class="flex items-center group">
              <div class="p-2 rounded-lg bg-white/10 group-hover:bg-white/20 transition-colors duration-200">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </div>
              <span class="ml-3 text-white text-lg font-semibold tracking-wide">User Management</span>
            </router-link>
          </div>

          <!-- Navigation Links -->
          <div class="hidden md:block">
            <div class="ml-10 flex items-baseline space-x-4">
              <template v-if="isAuthenticated">
                <router-link
                  to="/dashboard"
                  class="text-white hover:bg-white/10 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200"
                  active-class="bg-white/20"
                >
                  Dashboard
                </router-link>
                <router-link
                  to="/users"
                  class="text-white hover:bg-white/10 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200"
                  active-class="bg-white/20"
                >
                  Users
                </router-link>
                <router-link
                  to="/settings"
                  class="text-white hover:bg-white/10 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200"
                  active-class="bg-white/20"
                >
                  Settings
                </router-link>
              </template>
            </div>
          </div>

          <!-- User Menu -->
          <div class="hidden md:block">
            <div class="ml-4 flex items-center md:ml-6">
              <template v-if="isAuthenticated">
                <!-- Profile dropdown -->
                <div class="ml-3 relative">
                  <div>
                    <button
                      @click="toggleUserMenu"
                      class="max-w-xs bg-white/10 flex items-center text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-indigo-600 focus:ring-white"
                    >
                      <span class="sr-only">Open user menu</span>
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-white p-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </button>
                  </div>
                  <!-- Dropdown menu -->
                  <div
                    v-if="showUserMenu"
                    class="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none"
                  >
                    <router-link
                      to="/profile"
                      class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      @click="showUserMenu = false"
                    >
                      Your Profile
                    </router-link>
                    <a
                      href="#"
                      @click.prevent="handleLogout"
                      class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Sign out
                    </a>
                  </div>
                </div>
              </template>
              <template v-else>
                <router-link
                  to="/login"
                  class="text-white hover:bg-white/10 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200"
                >
                  Sign in
                </router-link>
                <router-link
                  to="/register"
                  class="ml-3 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-indigo-600 bg-white hover:bg-indigo-50 transition-colors duration-200"
                >
                  Register
                </router-link>
              </template>
            </div>
          </div>

          <!-- Mobile menu button -->
          <div class="-mr-2 flex md:hidden">
            <button
              @click="toggleMobileMenu"
              class="bg-white/10 inline-flex items-center justify-center p-2 rounded-md text-white hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-indigo-600 focus:ring-white"
            >
              <span class="sr-only">Open main menu</span>
              <svg
                :class="{ 'hidden': showMobileMenu, 'block': !showMobileMenu }"
                class="h-6 w-6"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
              <svg
                :class="{ 'block': showMobileMenu, 'hidden': !showMobileMenu }"
                class="h-6 w-6"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      <!-- Mobile menu -->
      <div
        :class="{ 'block': showMobileMenu, 'hidden': !showMobileMenu }"
        class="md:hidden"
      >
        <div class="px-2 pt-2 pb-3 space-y-1 sm:px-3">
          <template v-if="isAuthenticated">
            <router-link
              to="/dashboard"
              class="text-white hover:bg-white/10 block px-3 py-2 rounded-md text-base font-medium"
              active-class="bg-white/20"
              @click="showMobileMenu = false"
            >
              Dashboard
            </router-link>
            <router-link
              to="/users"
              class="text-white hover:bg-white/10 block px-3 py-2 rounded-md text-base font-medium"
              active-class="bg-white/20"
              @click="showMobileMenu = false"
            >
              Users
            </router-link>
            <router-link
              to="/settings"
              class="text-white hover:bg-white/10 block px-3 py-2 rounded-md text-base font-medium"
              active-class="bg-white/20"
              @click="showMobileMenu = false"
            >
              Settings
            </router-link>
            <router-link
              to="/profile"
              class="text-white hover:bg-white/10 block px-3 py-2 rounded-md text-base font-medium"
              active-class="bg-white/20"
              @click="showMobileMenu = false"
            >
              Profile
            </router-link>
            <a
              href="#"
              @click.prevent="handleLogout"
              class="text-white hover:bg-white/10 block px-3 py-2 rounded-md text-base font-medium"
            >
              Sign out
            </a>
          </template>
          <template v-else>
            <router-link
              to="/login"
              class="text-white hover:bg-white/10 block px-3 py-2 rounded-md text-base font-medium"
              @click="showMobileMenu = false"
            >
              Sign in
            </router-link>
            <router-link
              to="/register"
              class="text-white hover:bg-white/10 block px-3 py-2 rounded-md text-base font-medium"
              @click="showMobileMenu = false"
            >
              Register
            </router-link>
          </template>
        </div>
      </div>
    </nav>

    <!-- Main Content -->
    <main class="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
      <router-view></router-view>
    </main>
  </div>
</template>

<script>
import { ref, computed } from 'vue';
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';

export default {
  name: 'App',
  setup() {
    const store = useStore();
    const router = useRouter();
    const showMobileMenu = ref(false);
    const showUserMenu = ref(false);

    const isAuthenticated = computed(() => store.getters['auth/isAuthenticated']);

    const toggleMobileMenu = () => {
      showMobileMenu.value = !showMobileMenu.value;
    };

    const toggleUserMenu = () => {
      showUserMenu.value = !showUserMenu.value;
    };

    const handleLogout = async () => {
      await store.dispatch('auth/logout');
      showMobileMenu.value = false;
      showUserMenu.value = false;
      router.push('/login');
    };

    // Close menus when clicking outside
    const handleClickOutside = (event) => {
      if (showUserMenu.value && !event.target.closest('.relative')) {
        showUserMenu.value = false;
      }
    };

    // Add click outside listener
    window.addEventListener('click', handleClickOutside);

    return {
      isAuthenticated,
      showMobileMenu,
      showUserMenu,
      toggleMobileMenu,
      toggleUserMenu,
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