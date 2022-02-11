<template>
  <BaseModal
      :aberta="id_matricula"
      @onOpen="carregarFormulario"
      @onClose="fecharModal"
  >
    <template #title>
      <h3>Editar Matrícula</h3>
    </template>
    <template #body>
      <form @submit.prevent="submit" v-if="!loadingDados">

        <BaseSelect
            label="Aluno"
            placeholder="Selecione o aluno"
            v-model="form.aluno"
            :class="{error: v$.form.aluno.$error}"
            track-by="id"
            text-by="nome"
            :options="[]"
            :internal-search="false"
            :limit="3"
            :disabled="true"
        >
          <template v-slot:error>
            <div v-if="v$.form.aluno.$error">
              <p v-if="v$.form.aluno.required.$invalid" class="errorMessage">Informe o aluno</p>
            </div>
          </template>
        </BaseSelect>

        <BaseSelect
            label="Plano"
            placeholder="Selecione o plano"
            v-model="form.plano"
            :class="{error: v$.form.plano.$error}"
            track-by="id"
            text-by="nome"
            :options="planos"
            :internal-search="false"
            :limit="3"
            @search-change="pesquisarPlanos"
            :disabled="!possoEditarDatasEPlano"
        >
          <template v-slot:error>
            <div v-if="v$.form.plano.$error">
              <p v-if="v$.form.plano.required.$invalid" class="errorMessage">Informe o plano</p>
            </div>
          </template>
        </BaseSelect>


        <BaseDate
            label="Data de Início"
            placeholder="data"
            v-model="form.dt_inicio"
            :class="{error: v$.form.dt_inicio.$error}"
            :disabled="!possoEditarDatasEPlano"
        >
          <template v-slot:error>
            <div v-if="v$.form.dt_inicio.$error">
              <p v-if="v$.form.dt_inicio.required.$invalid" class="errorMessage">Informe a data de início</p>
            </div>
          </template>
        </BaseDate>

        <BaseDate
            label="Data de Fim"
            :model-value="dt_fim"
            :disabled="true"
        />

      </form>
      <Loader height="80px" width="80px" v-if="loadingDados" fill="#020540"/>
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
import {mapActions, mapMutations, mapState} from "vuex";
import BaseDate from "../form/BaseDate";
import Multiselect from 'vue-multiselect'
import BaseSelect from "../form/BaseSelect";

export default {
  name: "ModalEditarMatricula",
  components: {BaseSelect, BaseDate, BaseModal, BaseInput, Loader, Multiselect},
  setup: () => ({v$: useVuelidate()}),
  data() {
    return {
      planos: [],
      matricula: null,
      form: {
        aluno: null,
        plano: null,
        dt_inicio: "",
      },
      loading: false,
      loadingDados: false
    }
  },
  validations() {
    return {
      form: {
        aluno: {required},
        plano: {required},
        dt_inicio: {required}
      }
    }
  },
  computed: {
    ...mapState({
      "id_matricula": 'matriculas_id_edicao'
    }),
    dt_fim() {
      if (this.form.plano && this.form.dt_inicio) {
        let dt_inicio = this.form.dt_inicio;
        let planoDuracao = this.form.plano.duracao;
        let data = new Date(dt_inicio.valueOf());
        return new Date(data.setMonth(data.getMonth() + planoDuracao));
      }

      return null
    },
    possoEditarDatasEPlano() {
      if (this.matricula) {
        return !this.matricula.desativado;
      }
      return false;
    }
  },
  methods: {
    ...mapMutations(['SET_MATRICULAS_RELOAD', 'SET_MATRICULAS_ID_EDICAO']),
    ...mapActions([
      "editMatricula",
      'returnMatricula',
      'getMatriculaPlanos'
    ]),
    async pesquisarPlanos(query) {
      try {
        let response = await this.getMatriculaPlanos({pesquisa: query});
        this.planos = response.data.data;
      } catch (e) {
        this.$toast.open({
          message: 'Não foi possível buscar os planos!',
          type: 'error'
        });
      }
    },
    async carregarFormulario() {
      try {
        this.loadingDados = true;
        let dados = await this.returnMatricula(this.id_matricula);
        this.matricula = dados.data;
        Object.assign(this.form, this.matricula);
      } catch (e) {
        this.fecharModal();
        this.$toast.open({
          message: 'Não foi possível carregar a matrícula!',
          type: 'error'
        });
      } finally {
        this.loadingDados = false;
      }
    },
    fecharModal() {
      this.v$.$reset();
      this.$emit("onClose");
      this.SET_MATRICULAS_ID_EDICAO(null);
    },
    async submit() {
      try {
        const result = await this.v$.$validate();
        if (result) {
          this.loading = true;

          let dados = {
            ...this.form,
            plano_id: this.form.plano.id,
            dt_inicio: this.form.dt_inicio.toISOString().split('T')[0]
          }

          await this.editMatricula({idMatricula: this.id_matricula, dados: dados});
          this.SET_MATRICULAS_RELOAD({reload: true, tipo: 'updated', payload: this.matricula});

          this.fecharModal();
        }
      } catch (e) {
        console.log(e);
        this.$toast.open({
          message: 'Não foi possível editar a matrícula!',
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