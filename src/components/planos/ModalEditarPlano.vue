<template>
  <BaseModal
      :aberta="id_plano"
      @onOpen="carregarFormulario"
      @onClose="fecharModal"
  >
    <template #title>
      <h3>Editar Plano</h3>
    </template>
    <template #body>
      <form @submit.prevent="submit" v-if="!loadingDados">
        <BaseInput
            label="Nome"
            placeholder="Nome do plano"
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
            label="Duração (Meses)"
            placeholder="Duração em meses"
            type="number"
            :min="1"
            v-model="form.duracao"
            :class="{error: v$.form.duracao.$error}"
        >
          <template v-slot:error>
            <div v-if="v$.form.duracao.$error">
              <p v-if="v$.form.duracao.required.$invalid" class="errorMessage">Informe a duração</p>
            </div>
          </template>
        </BaseInput>

        <BaseInput
            label="Valor"
            placeholder="Valor mensal"
            type="text"
            v-model="form.valor"
            :class="{error: v$.form.valor.$error}"
            v-mask="'##.##'"
        >
          <template v-slot:error>
            <div v-if="v$.form.valor.$error">
              <p v-if="v$.form.valor.required.$invalid" class="errorMessage">Informe o valor</p>
            </div>
          </template>
        </BaseInput>

        <BaseInput
            label="Valor total"
            type="text"
            v-model="valorTotal"
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
  name: "ModalEditarPlano",
  components: {BaseSelect, BaseDate, BaseModal, BaseInput, Loader, Multiselect},
  setup: () => ({v$: useVuelidate()}),
  data() {
    return {
      plano: null,
      form: {
        nome: "",
        duracao: 1,
        valor: ""
      },
      loading: false,
      loadingDados: false
    }
  },
  validations() {
    return {
      form: {
        nome: {required},
        duracao: {required},
        valor: {required}
      }
    }
  },
  computed:{
    ...mapState({
      "id_plano": 'planos_id_edicao'
    }),
    valorTotal(){
      return (this.form.duracao * this.form.valor).toFixed(2);
    }
  },
  methods: {
    ...mapMutations(['SET_PLANOS_RELOAD','SET_PLANOS_ID_EDICAO']),
    ...mapActions([
      "editPlano",
      'returnPlano'
    ]),
    async carregarFormulario() {
      try {
        let dados = await this.returnPlano(this.id_plano);
        this.plano = dados.data;
        Object.assign(this.form, this.plano);
      } catch (e) {
        this.$toast.open({
          message: 'Não foi possível exibir o plano!',
          type: 'error'
        });
      }
    },
    fecharModal() {
      this.v$.$reset();
      this.$emit("onClose");
      this.SET_PLANOS_ID_EDICAO(null);
    },
    async submit() {
      try {
        const result = await this.v$.$validate();
        if (result) {
          this.loading = true;

          await this.editPlano({idPlano: this.id_plano, dados: this.form});
          this.SET_PLANOS_RELOAD({reload: true});

          this.fecharModal();
        }
      } catch (e) {
        console.log(e);
        this.$toast.open({
          message: 'Não foi possível editar o plano!',
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