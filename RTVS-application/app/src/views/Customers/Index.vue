<script setup>
/* Imports */
import { ref, onMounted, getCurrentInstance } from 'vue';

/* Components */
import Dialog from './components/Dialog.vue';
import DataTable from '@/components/DataTable.vue'

/* Utilities */
const { globalProperties } = getCurrentInstance().appContext.config;

/* Components refs */
const dialogRef = ref(null);

/* Lifecycle */
onMounted(() => {
  getData();
});

/* Data */
const tableLoading = ref(false);
const tableHeaders = [
  { title: 'Nome', key: 'name' },
  { title: 'Ações', key: 'actions' },
];
const tableItems = ref([]);

/* Methods */
const getData = () => {
  tableLoading.value = true;
  globalProperties.$http.get("customer")
    .then(({ data }) => {
      tableItems.value = data.data;
    })
    .catch(() => {
      alert('Erro ao buscar os dados');
    })
    .finally(() => (tableLoading.value = false));
}

const openDialog = (data) => {
  dialogRef.value.setValues({
    customer: data,
  });
};
</script>

<template>
  <h1 style="font-size: 20px">Clientes</h1>

  <DataTable
    :headers="tableHeaders"
    :items="tableItems"
  >
    <template v-slot:[`item.actions`]="{ item }">
      <v-btn
        color="primary"
        text
        icon
        size="x-small"
        @click="openDialog(item)"
      >
        <v-icon>mdi-eye</v-icon>
      </v-btn>
    </template>
  </DataTable>

  <Dialog ref="dialogRef" />
</template>
