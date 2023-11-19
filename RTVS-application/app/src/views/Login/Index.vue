<script setup>
/* Imports */
import { ref, getCurrentInstance } from "vue";
import { useAuthStore } from "@/store/auth";
import { useRouter } from "vue-router";

/* Utilities */
const { globalProperties } = getCurrentInstance().appContext.config;

/* Stores */
const authStore = useAuthStore();
const router = useRouter();

const loadingBtn = ref(false);

/* Login Form */
const formLogin = ref(null);
const username = ref();
const password = ref();
const login = async () => {
  const { valid } = await formLogin.value.validate();
  if (!valid) return;

  loadingBtn.value = true;

  globalProperties.$http
    .post("auth/login", {
      cpf: username.value.replace(/\D/g, ""),
      password: password.value,
    })
    .then(({ data }) => {
      authStore.setToken(data.data.token);
      router.push("/");
    })
    .catch(() => {
      alert('Erro ao fazer o login');
    })
    .finally(() => (loadingBtn.value = false));
};
</script>

<template>
  <v-card width="350" class="bg-white pa-4" style="margin: auto">
    <v-card-title class="text-center">
      <p class="text-h5 font-weight-bold text-primary">LOGIN</p>
    </v-card-title>
    <v-card-text class="mt-2">
      <v-form ref="formLogin" @submit.prevent="login">
        <v-text-field
          v-model="username"
          :rules="[
            (v) => !!v || 'CPF é obrigatório',
            (v) => new RegExp(/[0-9]{3}\.[0-9]{3}\.[0-9]{3}-[0-9]{2}/).test(v) || 'CPF inválido',
          ]"
          label="CPF"
          placeholder="000.000.000-00"
          v-mask="['###.###.###-##']"
          variant="outlined"
        ></v-text-field>
        <v-text-field
          v-model="password"
          :rules="[
            (v) => !!v || 'Senha é obrigatória',
            (v) => v.length >= 6 || 'Senha inválida',
            (v) => v.length <= 30 || 'Senha inválida',
          ]"
          label="Senha"
          type="password"
          placeholder="******"
          variant="outlined"
        ></v-text-field>
        <v-btn
          type="submit"
          color="primary"
          size="large"
          :loading="loadingBtn"
          block
        >
          Entrar
        </v-btn>
      </v-form>
    </v-card-text>
  </v-card>
</template>
