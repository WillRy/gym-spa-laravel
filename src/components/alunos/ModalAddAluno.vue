<template>
  <BaseModal
      :aberta="aberta"
      @onOpen="carregarFormulario"
      @onClose="fecharModal"
  >
    <template #title>
      <h3>Cadastrar Aluno</h3>
    </template>
    <template #body>
      <form @submit.prevent="submit">
        <BaseInput
            label="Nome"
            placeholder="Nome do aluno"
            id="nome"
            v-model="form.nome"
            :class="{error: v$.form.nome.$error}"
        >
          <template v-slot:error>
            <div v-if="v$.form.nome.$error">
              <p v-if="v$.form.nome.required.$invalid" class="errorMessage">Informe o nome</p>
            </div>
          </template>
        </BaseInput>

        <BaseInput
            label="E-mail"
            placeholder="E-mail do aluno"
            type="email"
            v-model="form.email"
            :class="{error: v$.form.email.$error}"
        >
          <template v-slot:error>
            <div v-if="v$.form.email.$error">
              <p v-if="v$.form.email.required.$invalid" class="errorMessage">Informe o e-mail</p>
              <p v-if="v$.form.email.email.$invalid" class="errorMessage">Informe um e-mail válido</p>
            </div>
          </template>
        </BaseInput>

        <BaseDate
            label="Data de Nascimento"
            placeholder="data"
            v-model="form.dt_nascimento"
            :class="{error: v$.form.dt_nascimento.$error}"
        >
          <template v-slot:error>
            <div v-if="v$.form.dt_nascimento.$error">
              <p v-if="v$.form.dt_nascimento.required.$invalid" class="errorMessage">Informe a data de nascimento</p>
            </div>
          </template>
        </BaseDate>

        <BaseSelect
            label="Sexo"
            placeholder="Selecione o sexo"
            v-model="form.sexo"
            :class="{error: v$.form.sexo.$error}"
            track-by="id"
            text-by="name"
            :options="sexo"
        >
          <template v-slot:error>
            <div v-if="v$.form.sexo.$error">
              <p v-if="v$.form.sexo.required.$invalid" class="errorMessage">Informe o sexo</p>
            </div>
          </template>
        </BaseSelect>
      </form>
    </template>

    <template #footer>
      <button class="btn btn-primary btn-sm" @click="submit">
        <Loader v-if="loading" width="36px" height="36px"/>
        Salvar
      </button>
      <button class="btn btn-secondary btn-sm" @click="fecharModal">
        Cancelar
      </button>
    </template>

  </BaseModal>
</template>

<script>
import BaseModal from "../modal/BaseModal";
import BaseInput from "../form/BaseInput";
import Loader from "../Loader";
import useVuelidate from '@vuelidate/core'
import {required, email} from '@vuelidate/validators'
import {mapActions, mapMutations} from "vuex";
import BaseDate from "../form/BaseDate";
import Multiselect from 'vue-multiselect'
import BaseSelect from "../form/BaseSelect";

export default {
  name: "ModalAddAluno",
  components: {BaseSelect, BaseDate, BaseModal, BaseInput, Loader, Multiselect},
  props: ['aberta'],
  setup: () => ({v$: useVuelidate()}),
  data() {
    return {
      form: {
        nome: "",
        email: "",
        dt_nascimento: "",
        sexo: null
      },
      sexo: [
        {name: 'Masculino', id: 'masculino'},
        {name: 'Feminino', id: 'feminino'},
        {name: 'Outro', id: 'outro'},
      ],
      loading: false
    }
  },
  validations() {
    return {
      form: {
        nome: {required},
        email: {required, email},
        dt_nascimento: {required},
        sexo: {required}
      }
    }
  },
  methods: {
    ...mapMutations(['SET_ALUNOS_RELOAD']),
    ...mapActions([
      "addAluno"
    ]),
    carregarFormulario() {
      Object.assign(this.form, {
        nome: "",
        email: "",
        dt_nascimento: "",
        sexo: null
      });
    },
    fecharModal() {
      this.v$.$reset();
      this.$emit("onClose");
    },
    async submit() {
      try {
        const result = await this.v$.$validate();
        if (result) {
          this.loading = true;

          let nascimento = this.form.dt_nascimento.toISOString().split('T')[0];
          let dados = {
            ...this.form,
            dt_nascimento: nascimento,
            sexo: this.form.sexo.id,
          }

          await this.addAluno(dados);
          this.SET_ALUNOS_RELOAD({reload: true});

          this.fecharModal();
        }
      } catch (e) {
        this.$toast.open({
          message: 'Não foi possível cadastrar o aluno!',
          type: 'error'
        });
      } finally {
        this.loading = false;
      }
    }
  }
}
</script>

<style scoped>

</style>