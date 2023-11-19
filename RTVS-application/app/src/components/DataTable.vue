<script setup>
/* Imports */
import { toRef, ref, computed } from "vue";

/* Props */
const props = defineProps([
  "loading",
  "headers",
  "items",
  "filter",
  "itemsPerPage",
  "page",
  "noDataText",
]);

/* Options */
const searchText = toRef(props, "filter");
const emit = defineEmits(["update:page"]);
const itemsPerPage = props.itemsPerPage ?? 10;

/* Computeds */
const page = !props.page
  ? ref(1)
  : computed({
      get: () => props.page,
      set: (val) => emit("update:page", val),
    });

const items = computed(() => {
  const filteredItems = !searchText.value
    ? props.items
    : props.items.filter((el) =>
        JSON.stringify(el)
          .toLowerCase()
          .includes(searchText.value.toLowerCase())
      );

  if (itemsPerPage === 0) return filteredItems;

  return filteredItems.slice(
    (page.value - 1) * itemsPerPage,
    page.value * itemsPerPage
  );
});

const pageCount = computed(() => Math.ceil(props.items.length / itemsPerPage));

/* Functions */
const getTableValue = (item, headerKey) => {
  const headerKeys = headerKey.split(".");

  return headerKeys.length == 0
    ? item[headerKey]
    : headerKeys.reduce((acc, key) => {
        return acc ? acc[key] : null;
      }, item);
};
</script>

<template>
  <v-table>
    <thead>
      <tr>
        <th
          class="table-header text-left"
          v-for="(header, headerIndex) in headers"
          :key="`table-header-${headerIndex}`"
          :style="{ width: header.width || 'auto' }"
        >
          {{ header.title }}
        </th>
      </tr>
    </thead>
    <tbody v-if="loading !== true">
      <tr v-for="(item, itemIndex) in items" :key="`table-item-${itemIndex}`">
        <td
          class="py-2"
          v-for="(header, headerIndex) in headers"
          :key="`table-item-${itemIndex}-header-${headerIndex}`"
        >
          <slot :name="'item.' + header.key" :item="item">
            {{ getTableValue(item, header.key) }}
          </slot>
        </td>
      </tr>
    </tbody>
  </v-table>
  <v-progress-linear
    v-if="loading === true"
    class="full-width my-1"
    indeterminate
  ></v-progress-linear>
  <v-alert
    v-else-if="items.length === 0"
    class="full-width mt-2"
    type="info"
    variant="tonal"
    density="compact"
  >
    {{ props.noDataText || "Nenhum dado encontrado" }}
  </v-alert>
  <v-row
    v-if="props.itemsPerPage !== 0 && pageCount > 1"
    justify="center"
  >
    <v-col cols="8">
      <v-pagination
        class="mt-2"
        v-model="page"
        :length="pageCount"
      ></v-pagination>
    </v-col>
  </v-row>
</template>

<style lang="sass" scoped>
@media (max-width: 900px)
  .table-header
    min-width: 70px
</style>
