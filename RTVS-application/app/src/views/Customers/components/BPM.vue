<script setup>
/* Imports */
import { ref } from 'vue';

/* Components */
import Chart from './Chart.vue';

/* Components refs */
const chart = ref(null);

/* Data */
const measurement = ref(0);
const serie = ref([0]);

/* Methods */
const updateMeasurement = (value) => {
  measurement.value = value;
  serie.value.push(value);
  chart.value?.updateChart(serie.value);
};

defineExpose({ updateMeasurement });
</script>

<template>
  <v-card>
    <v-card-title>BATIMENTOS POR MINUTO</v-card-title>
    <v-card-text class="mt-4">
      <span style="font-size: 40px">
        {{ measurement }}
      </span>

      <Chart ref="chart" />
    </v-card-text>
  </v-card>
</template>
