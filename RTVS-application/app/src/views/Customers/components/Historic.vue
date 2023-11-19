<script setup>
/* Components */
import DataTable from '@/components/DataTable.vue';

/* Utils */
import * as helpers from '@/utils/helpers';

/* Props */
const props = defineProps(['measurements']);

/* Data */
const tableHeaders = [
  { title: 'BPM', key: 'value.bpm' },
  { title: 'Oxigenação', key: 'value.oxygenation' },
  { title: 'Temperatura', key: 'value.temperature' },
  { title: 'Data', key: 'createdAt' },
];
</script>

<template>
  <v-card>
    <v-card-title>HISTÓRICO DE MEDIÇÕES</v-card-title>
    <v-card-text>
      <DataTable
        :headers="tableHeaders"
        :items="props.measurements || []"
      >
        <template v-slot:[`item.createdAt`]="{ item }">
          {{ helpers.dateFormatBr(item.createdAt, true) }}
        </template>
      </DataTable>
    </v-card-text>
  </v-card>
</template>
