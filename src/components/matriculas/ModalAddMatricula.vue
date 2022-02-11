<template>
  <BaseModal
      :aberta="aberta"
      @onOpen="carregarFormulario"
      @onClose="fecharModal"
  >
    <template #title>
      <h3>Cadastrar Matricula</h3>
    </template>
    <template #body>
      <form @submit.prevent="submit">
        <BaseSelect
            label="Aluno"
            placeholder="Pesquise o aluno"
            v-model="form.aluno"
            :class="{error: v$.form.aluno.$error}"
            track-by="id"
            text-by="nome"
            :options="alunos"
            :internal-search="false"
            :limit="3"
            @search-change="pesquisarAlunos"
        >
          <template v-slot:error>
            <div v-if="v$.form.aluno.$error">
              <p v-if="v$.form.aluno.required.$invalid" class="errorMessage">Informe o aluno</p>
            </div>
          </template>
        </BaseSelect>

        <BaseSelect
            label="Plano"
            placeholder="Pesquise o plano"
            v-model="form.plano"
            :class="{error: v$.form.plano.$error}"
            track-by="id"
            text-by="nome"
            :options="planos"
            :internal-search="false"
            :limit="3"
            @search-change="pesquisarPlanos"
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
  name: "ModalAddMatricula",
  components: {BaseSelect, BaseDate, BaseModal, BaseInput, Loader, Multiselect},
  props: ['aberta'],
  setup: () => ({v$: useVuelidate()}),
  data() {
    return {
      alunos: [],
      planos: [],
      form: {
        aluno: null,
        plano: null,
        dt_inicio: null
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
        dt_inicio: {required},
      }
    }
  },
  computed: {
    dt_fim() {
      if (this.form.plano && this.form.dt_inicio) {
        let dt_inicio = this.form.dt_inicio;
        let planoDuracao = this.form.plano.duracao;
        let data = new Date(dt_inicio.valueOf());
        return new Date(data.setMonth(data.getMonth() + planoDuracao));
      }

      return null
    }
  },
  methods: {
    ...mapMutations(['SET_MATRICULAS_RELOAD']),
    ...mapActions([
      "addMatricula",
      "getMatriculaAlunos",
      "getMatriculaPlanos"
    ]),
    carregarFormulario() {
      Object.assign(this.form, {
        aluno: null,
        plano: null,
        dt_inicio: null,
      });
    },
    fecharModal() {
      this.v$.$reset();
      this.$emit("onClose");
    },
    async pesquisarAlunos(query) {
      try {
        this.loadingDados = true;
        let response = await this.getMatriculaAlunos({pesquisa: query});
        this.alunos = response.data.data;
      } catch (e) {
        this.$toast.open({
          message: 'Não foi possível buscar os alunos!',
          type: 'error'
        });
      } finally {
        this.loadingDados = false;
      }
    },
    async pesquisarPlanos(query) {
      try {
        this.loadingDados = true;
        let response = await this.getMatriculaPlanos({pesquisa: query});
        this.planos = response.data.data;
      } catch (e) {
        this.$toast.open({
          message: 'Não foi possível buscar os planos!',
          type: 'error'
        });
      } finally {
        this.loadingDados = false;
      }
    },
    async submit() {
      try {
        const result = await this.v$.$validate();
        if (result) {
          this.loading = true;

          let inicio = this.form.dt_inicio.toISOString().split('T')[0];

          let dados = {
            aluno_id: this.form.aluno.id,
            plano_id: this.form.plano.id,
            dt_inicio: inicio,
          }

          await this.addMatricula(dados);
          this.SET_MATRICULAS_RELOAD({reload: true, tipo: 'created', payload: null});

          this.fecharModal();
        }
      } catch (e) {
        this.$laravelError(e, 'Não foi possível gerar a matricula!')

      } finally {
        this.loading = false;
      }
    }
  }
}
</script>

<style scoped>

</style>