<script setup>
/* Imports */
import { ref, onUnmounted } from 'vue';
import { io } from "socket.io-client";

/* Components */
import BPM from './BPM.vue';
import Oxygenation from './Oxygenation.vue';
import Temperature from './Temperature.vue';
import Historic from './Historic.vue';

/* Components refs */
const dialog = ref(false);
const bpmComponent = ref(null);
const oxygenationComponent = ref(null);
const temperatureComponent = ref(null);

/* Lifecycle */
onUnmounted(() => {
  disconnectSocket();
});

/* Data */
const customer = ref({});

/* Methods */
const setValues = (data) => {
  dialog.value = true;
  customer.value = data.customer;

  connectSocket(data.customer?.id || '4e59a711-b3b3-4fbd-849d-804dacb15e43');
};

let socket = null;
const connectSocket = (room) => {
  socket = io.connect('http://localhost:3001', {
    query: {
      room,
    },
  });

  socket.on("measurement", (data) => {
    console.log('measurement', data);
    const { bpm, oxygenation, temperature } = data;
    if (bpm) bpmComponent.value?.updateMeasurement(bpm);
    if (oxygenation) oxygenationComponent.value?.updateMeasurement(oxygenation);
    if (temperature) temperatureComponent.value?.updateMeasurement(temperature);
  });

  socket.on("save", (data) => {
    console.log('save', data);
    if (data.bpm && data.oxygenation && data.temperature)
      customer.value.measurements.push({
        createdAt: new Date(),
        value: data,
      });
  });
};

const disconnectSocket = () => {
  if (socket) socket.disconnect();
};

const closeDialog = () => {
  dialog.value = false;
  customer.value = {};

  disconnectSocket();
};

defineExpose({ setValues });
</script>

<template>
  <v-dialog
    v-model="dialog"
    fullscreen
    :scrim="false"
    transition="dialog-bottom-transition"
  >
    <v-card>
      <v-toolbar
        dark
        color="primary"
      >
        <v-btn
          icon
          dark
          @click="closeDialog"
        >
          <v-icon>mdi-close</v-icon>
        </v-btn>
        <v-toolbar-title>
          {{ customer.name }}
        </v-toolbar-title>
      </v-toolbar>
      <v-card-text>

        <BPM ref="bpmComponent" />
        <Oxygenation class="mt-4" ref="oxygenationComponent" />
        <Temperature class="mt-4" ref="temperatureComponent" />
        <Historic class="mt-4" :measurements="customer.measurements" />
      </v-card-text>
    </v-card>
  </v-dialog>
</template>
