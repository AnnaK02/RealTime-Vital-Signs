<script setup>
import { ref } from 'vue';

const props = defineProps(['min', 'max']);

const chart = ref(null);
const apexData = {
  series: [{
      name: "BPM",
      data: [0]
  }],
  chartOptions: {
    chart: {
      type: "line",
      height: 250,
      animations: {
        enabled: true,
        easing: 'linear',
        dynamicAnimation: {
          speed: 1000
        }
      },
      toolbar: {
        show: false
      },
      zoom: {
        enabled: false
      }
    },
    dataLabels: {
      enabled: false,
    },
    stroke: {
      curve: 'smooth'
    },
    markers: {
      size: 0
    },
    xaxis: {
      categories: [],
      range: 10,
    },
    yaxis: {
      max: props.max || 150,
      min: props.min || 50,
    },
    legend: {
      show: false
    },
  },
};

const updateChart = (series) => {
  chart.value?.chart.updateSeries([{
    data: series
  }]);
};

defineExpose({ updateChart });
</script>

<template>
  <apexchart
    ref="chart"
    type="line"
    height="250"
    :options="apexData.chartOptions"
    :series="apexData.series"
  ></apexchart>
</template>
