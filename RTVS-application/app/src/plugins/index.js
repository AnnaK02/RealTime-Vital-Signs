/**
 * plugins/index.js
 *
 * Automatically included in `./src/main.js`
 */

// Plugins
import vuetify from './vuetify'
import axios from './axios'
import { mask } from 'vue-the-mask'
import pinia from '../store'
import router from '../router'
import VueApexCharts from "vue3-apexcharts";

export function registerPlugins (app) {
  app
    .use(vuetify)
    .use(pinia)
    .directive('mask', mask)
    .use(router)
    .use(VueApexCharts);

  app.config.globalProperties.$http = axios;
}
