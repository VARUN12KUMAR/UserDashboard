<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="bg-white shadow">
      <div class="px-4 py-5 sm:px-6">
        <h2 class="text-xl font-bold text-gray-900">Dashboard</h2>
        <p class="mt-1 text-sm text-gray-600">Overview of user statistics and analytics</p>
      </div>
    </div>

    <!-- Stats Grid -->
    <div class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
      <!-- Total Users -->
      <div class="bg-white overflow-hidden shadow rounded-lg">
        <div class="p-5">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <svg class="h-6 w-6 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <div class="ml-5 w-0 flex-1">
              <dl>
                <dt class="text-sm font-medium text-gray-500 truncate">Total Users</dt>
                <dd class="flex items-baseline">
                  <div class="text-2xl font-semibold text-gray-900">{{ totalUsers }}</div>
                </dd>
              </dl>
            </div>
          </div>
        </div>
      </div>

      <!-- Gender Distribution -->
      <div class="bg-white overflow-hidden shadow rounded-lg">
        <div class="p-5">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <svg class="h-6 w-6 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <div class="ml-5 w-0 flex-1">
              <dl>
                <dt class="text-sm font-medium text-gray-500 truncate">Gender Distribution</dt>
                <dd class="mt-2">
                  <div class="flex space-x-4">
                    <div class="flex items-center">
                      <div class="w-3 h-3 rounded-full bg-blue-400 mr-2"></div>
                      <span class="text-sm text-gray-600">Male: {{ genderStats.male }}</span>
                    </div>
                    <div class="flex items-center">
                      <div class="w-3 h-3 rounded-full bg-pink-400 mr-2"></div>
                      <span class="text-sm text-gray-600">Female: {{ genderStats.female }}</span>
                    </div>
                  </div>
                </dd>
              </dl>
            </div>
          </div>
        </div>
      </div>

      <!-- Average Age -->
      <div class="bg-white overflow-hidden shadow rounded-lg">
        <div class="p-5">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <svg class="h-6 w-6 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <div class="ml-5 w-0 flex-1">
              <dl>
                <dt class="text-sm font-medium text-gray-500 truncate">Average Age</dt>
                <dd class="flex items-baseline">
                  <div class="text-2xl font-semibold text-gray-900">{{ averageAge }}</div>
                  <span class="ml-2 text-sm text-gray-500">years</span>
                </dd>
              </dl>
            </div>
          </div>
        </div>
      </div>

      <!-- Location Distribution -->
      <div class="bg-white overflow-hidden shadow rounded-lg">
        <div class="p-5">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <svg class="h-6 w-6 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <div class="ml-5 w-0 flex-1">
              <dl>
                <dt class="text-sm font-medium text-gray-500 truncate">Top Location</dt>
                <dd class="flex items-baseline">
                  <div class="text-lg font-semibold text-gray-900">{{ topLocation }}</div>
                </dd>
              </dl>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Age Distribution Chart -->
    <div class="bg-white shadow rounded-lg">
      <div class="px-4 py-5 sm:p-6">
        <h3 class="text-lg font-medium leading-6 text-gray-900">Age Distribution</h3>
        <div class="mt-4">
          <div class="grid grid-cols-6 gap-2">
            <template v-for="(count, range) in ageDistribution" :key="range">
              <div class="col-span-1">
                <div class="flex flex-col items-center">
                  <div class="relative w-full">
                    <div 
                      class="bg-indigo-200 rounded-t"
                      :style="{ height: `${(count / maxAgeCount) * 100}px` }"
                    ></div>
                  </div>
                  <span class="mt-2 text-xs text-gray-500">{{ range }}</span>
                  <span class="text-xs font-medium text-gray-900">{{ count }}</span>
                </div>
              </div>
            </template>
          </div>
        </div>
      </div>
    </div>

    <!-- Recent Activity -->
    <div class="bg-white shadow rounded-lg">
      <div class="px-4 py-5 sm:p-6">
        <h3 class="text-lg font-medium leading-6 text-gray-900">Recent Activity</h3>
        <div class="mt-4 flow-root">
          <div class="-my-5 divide-y divide-gray-200">
            <template v-if="recentUsers.length">
              <div 
                v-for="user in recentUsers" 
                :key="user.id" 
                class="py-4"
              >
                <div class="flex items-center space-x-4">
                  <img 
                    :src="user.picture" 
                    :alt="user.firstName"
                    class="h-8 w-8 rounded-full"
                  />
                  <div class="flex-1 min-w-0">
                    <p class="text-sm font-medium text-gray-900 truncate">
                      {{ user.firstName }} {{ user.lastName }}
                    </p>
                    <p class="text-sm text-gray-500 truncate">
                      {{ user.email }}
                    </p>
                  </div>
                  <div class="text-sm text-gray-500">
                    {{ formatDate(user.createdAt) }}
                  </div>
                </div>
              </div>
            </template>
            <div v-else class="py-4 text-center text-sm text-gray-500">
              No recent activity
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { computed, onMounted } from 'vue';
import { useStore } from 'vuex';

export default {
  name: 'Dashboard',
  setup() {
    const store = useStore();

    const users = computed(() => store.state.users.list);
    const totalUsers = computed(() => users.value.length);

    const genderStats = computed(() => {
      return users.value.reduce((acc, user) => {
        acc[user.gender] = (acc[user.gender] || 0) + 1;
        return acc;
      }, { male: 0, female: 0 });
    });

    const averageAge = computed(() => {
      if (!users.value.length) return 0;
      const total = users.value.reduce((sum, user) => sum + user.age, 0);
      return Math.round(total / users.value.length);
    });

    const topLocation = computed(() => {
      const locations = users.value.reduce((acc, user) => {
        const location = `${user.location.city}, ${user.location.country}`;
        acc[location] = (acc[location] || 0) + 1;
        return acc;
      }, {});
      
      return Object.entries(locations)
        .sort(([,a], [,b]) => b - a)[0]?.[0] || 'No data';
    });

    const ageDistribution = computed(() => {
      const distribution = {
        '18-25': 0,
        '26-35': 0,
        '36-45': 0,
        '46-55': 0,
        '56-65': 0,
        '65+': 0
      };

      users.value.forEach(user => {
        if (user.age <= 25) distribution['18-25']++;
        else if (user.age <= 35) distribution['26-35']++;
        else if (user.age <= 45) distribution['36-45']++;
        else if (user.age <= 55) distribution['46-55']++;
        else if (user.age <= 65) distribution['56-65']++;
        else distribution['65+']++;
      });

      return distribution;
    });

    const maxAgeCount = computed(() => {
      return Math.max(...Object.values(ageDistribution.value));
    });

    const recentUsers = computed(() => {
      return [...users.value]
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 5);
    });

    const formatDate = (date) => {
      return new Intl.DateTimeFormat('en-US', {
        month: 'short',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric'
      }).format(new Date(date));
    };

    onMounted(() => {
      if (!users.value.length) {
        store.dispatch('users/fetchUsers');
      }
    });

    return {
      totalUsers,
      genderStats,
      averageAge,
      topLocation,
      ageDistribution,
      maxAgeCount,
      recentUsers,
      formatDate
    };
  }
};
</script> 