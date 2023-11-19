<script setup>
import { computed } from 'vue';

const props = defineProps(['drawer']);
const emit = defineEmits(['update:drawer']);

const drawer = computed({
  get: () => props.drawer,
  set: (value) => emit('update:drawer', value),
})
</script>

<template>
  <v-app-bar
    color="primary"
  >
    <template v-slot:prepend>
      <v-app-bar-nav-icon
        @click.stop="drawer = !drawer"
      />
    </template>

    <v-app-bar-title>
      <v-icon
        icon="mdi-heart-pulse"
        class="mr-2"
      />
      Realtime Vital Signs
    </v-app-bar-title>
  </v-app-bar>
</template>
