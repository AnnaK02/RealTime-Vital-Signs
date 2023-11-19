<script setup>
import { ref } from 'vue';
import AppBar from '@/components/AppBar.vue';
import NavigationDrawer from '@/components/NavigationDrawer.vue';

const drawer = ref(false);
</script>

<template>
  <v-app>
    <AppBar v-model:drawer="drawer" />
    <NavigationDrawer v-model:drawer="drawer" />

    <v-main class="mt-3 px-3 pb-3">
      <router-view />
    </v-main>
  </v-app>
</template>
