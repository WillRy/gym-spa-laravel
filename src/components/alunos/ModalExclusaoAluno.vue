<template>
  <BaseModal
      :aberta="id_aluno"
      @onOpen="carregarDados"
      @onClose="fecharModal"
  >
    <template #title>
      <h3>Excluir Aluno</h3>
    </template>
    <template #body>
      <p v-if="aluno && !loadingDados">Deseja excluir o aluno {{aluno.nome}}?</p>
      <Loader height="80px" width="80px" v-if="loadingDados" fill="#EE4D64"/>
    </template>

    <template #footer>
      <button class="btn btn-primary btn-sm" @click="submit">
        <Loader v-if="loading" width="36px" height="36px"/>
        Excluir
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
  name: "ModalExclusaoAluno",
  components: {BaseSelect, BaseDate, BaseModal, BaseInput, Loader, Multiselect},
  data() {
    return {
      aluno: null,
      loading: false,
      loadingDados: false
    }
  },
  computed: {
    ...mapState({
      "id_aluno": 'alunos_id_exclusao'
    })
  },
  methods: {
    ...mapMutations(['SET_ALUNOS_RELOAD', 'SET_ALUNOS_ID_EXCLUSAO']),
    ...mapActions([
      "returnAluno",
      "removeAluno"
    ]),
    async carregarDados() {
      try {
        this.loadingDados = true;
        let dados = await this.returnAluno(this.id_aluno);

        this.aluno = dados.data;
      } catch (e) {
        this.fecharModal();
        this.$toast.open({
          message: 'Não foi possível carregar o aluno!',
          type: 'error'
        });
      } finally {
        this.loadingDados = false;
      }
    },
    fecharModal() {
      this.$emit("onClose");
      this.SET_ALUNOS_ID_EXCLUSAO(null);
    },
    async submit() {
      try {
        await this.removeAluno({idAluno: this.id_aluno});
        this.SET_ALUNOS_RELOAD({reload: true});

        this.fecharModal();
      } catch (e) {
        console.log(e)
        this.$toast.open({
          message: 'Não foi possível excluir o aluno!',
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