<template>
  <div id="login">
    <div class="box">
      <img src="../../assets/logo.svg" alt="" class="logo">
      <h1 class="titulo">gym</h1>
      <form @submit.prevent="submit">
        <BaseInput
            label="seu e-mail"
            placeholder="exemplo@email.com"
            id="email"
            type="email"
            v-model="email"
            :class="{error: v$.email.$error}"
        >
          <template v-slot:error>
            <div v-if="v$.email.$error">
              <p v-if="v$.email.required.$invalid" class="errorMessage">Informe seu e-mail</p>
            </div>
          </template>
        </BaseInput>

        <BaseInput
            label="sua senha"
            placeholder="*****"
            id="password"
            type="password"
            v-model="password"
            :class="{error: v$.password.$error}"
        >
          <template v-slot:error>
            <div v-if="v$.password.$error">
              <p v-if="v$.password.required.$invalid" class="errorMessage">Informe sua senha</p>
            </div>
          </template>
        </BaseInput>
        <button
            type="submit"
            class="btn btn-full btn-primary"
        >
          <Loader v-if="loading" width="36px" height="36px"/>
          Entrar no sistema
        </button>
      </form>
    </div>
  </div>
</template>

<script>
import BaseInput from "../../components/form/BaseInput";
import useVuelidate from '@vuelidate/core'
import {required, email} from '@vuelidate/validators'
import {mapActions} from 'vuex';
import Loader from "../../components/Loader";

export default {
  name: "Login",
  components: {Loader, BaseInput},
  data() {
    return {
      email: "",
      password: "",
      loading: false
    }
  },
  validations() {
    return {
      email: {email, required},
      password: {required}
    }
  },
  methods: {
    ...mapActions([
        "login",
        "getUser"
    ]),
    async submit() {
      try {
        this.loading = true;

        const result = await this.v$.$validate();
        if (result) {

          await this.login({email: this.email,password: this.password});
          await this.getUser();

          await this.$router.push({name: 'alunos'});

        }
      } catch (e) {
        console.log(e);
        this.$toast.open({
          message: 'Não foi possível realizar o login!',
          type: 'error'
        });
      } finally {
        this.loading = false;
      }
    }
  },
  setup: () => ({v$: useVuelidate()}),
}
</script>

<style scoped>
#login {
  height: 100vh;
  width: 100vw;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: var(--cor-principal);
}

.box {
  width: 360px;
  background: #FFFFFF;
  box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.2);
  border-radius: var(--radius-principal);
  padding: 50px 30px;
}

.logo {
  display: block;
  height: 52px;
  width: 100px;
  margin: 0 auto 12px auto;
}

.titulo {
  font-family: 'Roboto', sans-serif;
  font-style: normal;
  font-weight: bold;
  font-size: 30px;
  line-height: 35px;
  text-transform: uppercase;
  text-align: center;
  margin-bottom: 30px;

  color: #EE4D64;
}
</style>