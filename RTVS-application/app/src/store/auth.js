import { defineStore } from 'pinia';
import axios from '../plugins/axios';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    endpoint: 'me',
    token: null,
    user: {},
  }),

  actions: {
    setToken(value) {
      this.token = value;
      axios.defaults.headers.common['Authorization'] = `Bearer ${value}`;

      if (value) {
        localStorage.setItem("token", value);
      } else {
        localStorage.removeItem("token");
      }
    },
    async fetchUser({ callback }) {
      return await axios.get(this.endpoint)
        .then(({ data }) => {
          this.user = data.data;
          callback.onSuccess();
        })
        .catch(() => {
          this.setToken(undefined);
          callback.onError();
        });
    },
    logout() {
      this.user = {};
      this.setToken(undefined);
      window.location.reload();
    },
  },

  getters: {
    getToken: (state) => state.token,
    getUser: (state) => state.user,
    getPages: (state) => state.pages,
    getRoutes: (state) => state.routes,
  }
})
