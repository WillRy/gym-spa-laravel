<template>
  <BaseModal
      :aberta="id_plano"
      @onOpen="carregarDados"
      @onClose="fecharModal"
  >
    <template #title>
      <h3>Excluir Plano</h3>
    </template>
    <template #body>
      <p v-if="plano && !loadingDados">Deseja excluir o plano {{ plano.nome }}?</p>
      <Loader height="80px" width="80px" v-if="loadingDados" fill="#020540"/>
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
      plano: null,
      loading: false,
      loadingDados: false
    }
  },
  computed: {
    ...mapState({
      "id_plano": 'planos_id_exclusao'
    })
  },
  methods: {
    ...mapMutations(['SET_PLANOS_RELOAD', 'SET_PLANOS_ID_EXCLUSAO']),
    ...mapActions([
      "returnPlano",
      "removePlano"
    ]),
    async carregarDados() {
      try {
        this.loadingDados = true;
        let dados = await this.returnPlano(this.id_plano);

        this.plano = dados.data;
      } catch (e) {
        this.fecharModal();
        this.$toast.open({
          message: 'Não foi possível carregar o plano!',
          type: 'error'
        });
      } finally {
        this.loadingDados = false;
      }
    },
    fecharModal() {
      this.$emit("onClose");
      this.SET_PLANOS_ID_EXCLUSAO(null);
    },
    async submit() {
      try {
        await this.removePlano({idPlano: this.id_plano});
        this.SET_PLANOS_RELOAD({reload: true});

        this.fecharModal();
      } catch (e) {
        console.log(e)
        this.$toast.open({
          message: 'Não foi possível excluir o plano!',
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