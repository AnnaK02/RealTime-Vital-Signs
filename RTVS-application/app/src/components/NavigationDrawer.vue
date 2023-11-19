<script setup>
import { computed } from 'vue';
import { useAuthStore } from "@/store/auth";

const authStore = useAuthStore();

const props = defineProps(['drawer']);
const emit = defineEmits(['update:drawer']);

const drawer = computed({
  get: () => props.drawer,
  set: (value) => emit('update:drawer', value),
})
</script>

<template>
  <v-navigation-drawer
    v-model="drawer"
    temporary
  >
    <v-list density="compact" nav>
      <v-list-item
        prepend-icon="mdi-home"
        title="Início"
        @click="$router.push('/')"
      ></v-list-item>
      <v-list-item
        prepend-icon="mdi-account-group"
        title="Clientes"
        @click="$router.push('/customers')"
      ></v-list-item>
      <v-list-item
        prepend-icon="mdi-logout"
        title="Sair"
        @click="authStore.logout()"
      ></v-list-item>
    </v-list>
  </v-navigation-drawer>
</template>
