<template>
  <div id="page-alunos">
    <PageAction>
      <template #default>
        <h1 class="titulo">Gerenciando planos</h1>
      </template>
      <template #actions>
        <button class="btn btn-primary" @click="abrirCadastrarPlano = true">
          <img src="../assets/add.svg" class="icon" style="height: 20px;width: 20px">
          Cadastrar
        </button>
        <BaseInput
            placeholder="Buscar plano"
            mb="0px"
            width="237px"
            v-model="pesquisa"
            @keydown.enter="pesquisar"
        />
      </template>
    </PageAction>

    <div class="content" :class="{loading: loading}">
      <div class="table-responsive">
        <table class="table" >
          <thead>
          <tr>
            <th style="width: 420px">Nome</th>
            <th style="width: 320px">Duração</th>
            <th style="width: 130px">Valor p/ MÊS</th>
            <th style="width: 130px">Ativo</th>
            <th style="width: 130px" class="text-align-right">Ações</th>
          </tr>
          </thead>
          <tbody v-if="loading && planos === null" style="height:500px;"></tbody>
          <tbody v-else-if="planos && planos.data.length > 0">
          <tr v-for="plano in planos.data" :key="plano.id">
            <td>
              {{plano.nome}}
            </td>
            <td>
              {{plano.duracao}}
            </td>
            <td>
              {{plano.valor}}
            </td>
            <td>
              <img src="../assets/icon-ativo.svg" class="active" alt="" v-if="!plano.deleted_at">
              <img src="../assets/icon-inativo.svg" class="inactive" alt="" v-else>
            </td>
            <td>
              <div class="btn-group justify-end">
                <button class="btn-text btn-text-action" @click="abrirEdicao(plano.id)">
                  editar
                </button>
                <button class="btn-text btn-text-danger" @click="abrirExclusao(plano.id)">
                  excluir
                </button>
              </div>
            </td>
          </tr>
          </tbody>
        </table>
      </div>
      <PaginacaoSemRouter
          v-if="planos"
          :total="planos.total"
          :por-pagina="planos.per_page"
          :pagina-atual="pagina"
          @onChange="atualizaPagina($event)"
      />
    </div>

    <modal-add-plano
        :aberta="abrirCadastrarPlano"
        @onClose="abrirCadastrarPlano = false"
    />
    <modal-editar-plano/>
    <modal-exclusao-plano/>
  </div>
</template>

<script>
import PageAction from "../components/painel/PageAction";
import BaseInput from "../components/form/BaseInput";
import {mapActions, mapMutations, mapState} from "vuex";
import PaginacaoSemRouter from "../components/paginacao/PaginacaoSemRouter";
import ModalAddPlano from "../components/planos/ModalAddPlano";
import ModalEditarPlano from "../components/planos/ModalEditarPlano";
import ModalExclusaoPlano from "../components/planos/ModalExclusaoPlano";

export default {
  name: "Planos",
  components: {
    ModalEditarPlano,
    ModalAddPlano,
    PaginacaoSemRouter,
    BaseInput,
    PageAction,
    ModalExclusaoPlano
  },
  data() {
    return {
      loading: false,
      abrirCadastrarPlano: false
    }
  },
  computed: {
    ...mapState({
      "planos": 'planos',
      'planos_reload': 'planos_reload'
    }),
    pesquisa: {
      set(valor) {
        this.SET_PLANOS_PESQUISA(valor);
      },
      get(){
        return this.$store.state.planos_pesquisa;
      }
    },
    pagina: {
      set(valor) {
        this.SET_PLANOS_PAGINA(valor);
      },
      get(){
        return this.$store.state.planos_pagina;
      }
    }
  },
  watch: {
    planos_reload(valor) {
      this.buscarPlanos();
    }
  },
  methods: {
    ...mapMutations([
      "SET_PLANOS_PAGINA",
      "SET_PLANOS_PESQUISA",
      "SET_PLANOS_ID_EDICAO",
      "SET_PLANOS_ID_EXCLUSAO"
    ]),
    ...mapActions([
      'getPlanos'
    ]),
    abrirEdicao(id){
      this.SET_PLANOS_ID_EDICAO(id);
    },
    abrirExclusao(id){
      this.SET_PLANOS_ID_EXCLUSAO(id);
    },
    resetFiltros(){
      this.SET_PLANOS_PAGINA(1);
      this.SET_PLANOS_PESQUISA('');
    },
    atualizaPagina(pagina) {
      this.pagina = pagina;
      this.buscarPlanos();
    },
    pesquisar(){
      this.SET_PLANOS_PAGINA(1);
      this.buscarPlanos();
    },
    async buscarPlanos() {
      try {
        this.loading = true;
        await this.getPlanos();
      } catch (e) {
        this.$toast.open({
          message: 'Não foi possível listar os planos!',
          type: 'error'
        });
      } finally {
        this.loading = false;
      }
    }
  },
  created() {
    this.resetFiltros();
    this.buscarPlanos();
  }
}
</script>

<style scoped>
.input-busca {
  width: 230px;
}

.active, .inactive {
  height: 20px;
  width: 20px;
}
</style>