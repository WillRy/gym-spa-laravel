<template>
  <div id="page-alunos">
    <PageAction>
      <template #default>
        <h1 class="titulo">Gerenciando alunos</h1>
      </template>
      <template #actions>
        <button class="btn btn-primary" @click="abrirCadastrarAluno = true">
          <img src="../assets/add.svg" class="icon" style="height: 20px;width: 20px">
          Cadastrar
        </button>
        <BaseInput
            placeholder="Buscar aluno"
            mb="0px"
            width="237px"
            v-model="pesquisa"
            @keydown.enter="pesquisar"
        />
      </template>
    </PageAction>

    <div class="content" :class="{loading: loading}">
      <div class="table-responsive">
        <table class="table">
          <thead>
          <tr>
            <th style="width: 420px">Nome</th>
            <th style="width: 320px">Email</th>
            <th style="width: 320px">Plano</th>
            <th style="width: 130px">Ativo</th>
            <th style="width: 130px" class="text-align-right">Ações</th>
          </tr>
          </thead>
          <tbody v-if="loading && alunos === null" style="height:500px;"></tbody>
          <tbody v-else-if="alunos && alunos.data.length > 0">
          <tr v-for="aluno in alunos.data" :key="aluno.id">
            <td>
              {{ aluno.nome }}
            </td>
            <td>
              {{ aluno.email }}
            </td>
            <td>
              {{ aluno.matricula ? aluno.matricula.plano.nome : "-" }}
            </td>
            <td>
              <img src="../assets/icon-ativo.svg" class="active" alt="" v-if="!aluno.deleted_at">
              <img src="../assets/icon-inativo.svg" class="inactive" alt="" v-else>
            </td>
            <td>
              <div class="btn-group justify-end">
                <button class="btn-text btn-text-action" @click="abrirEdicao(aluno.id)">
                  editar
                </button>
                <button class="btn-text btn-text-danger" @click="abrirExclusao(aluno.id)">
                  excluir
                </button>
              </div>
            </td>
          </tr>
          </tbody>
        </table>
      </div>
      <PaginacaoSemRouter
          v-if="alunos"
          :total="alunos.total"
          :por-pagina="alunos.per_page"
          :pagina-atual="pagina"
          @onChange="atualizaPagina($event)"
      />
    </div>

    <modal-add-aluno
        :aberta="abrirCadastrarAluno"
        @onClose="abrirCadastrarAluno = false"
    />
    <modal-editar-aluno/>
    <modal-exclusao-aluno/>
  </div>
</template>

<script>
import PageAction from "../components/painel/PageAction";
import BaseInput from "../components/form/BaseInput";
import {mapActions, mapMutations, mapState} from "vuex";
import PaginacaoSemRouter from "../components/paginacao/PaginacaoSemRouter";
import ModalAddAluno from "../components/alunos/ModalAddAluno";
import ModalEditarAluno from "../components/alunos/ModalEditarAluno";
import ModalExclusaoAluno from "../components/alunos/ModalExclusaoAluno";

export default {
  name: "Alunos",
  components: {
    ModalExclusaoAluno,
    ModalEditarAluno,
    ModalAddAluno,
    PaginacaoSemRouter,
    BaseInput,
    PageAction
  },
  data() {
    return {
      loading: false,
      abrirCadastrarAluno: false
    }
  },
  computed: {
    ...mapState({
      "alunos": 'alunos',
      'alunos_reload': 'alunos_reload'
    }),
    pesquisa: {
      set(valor) {
        this.SET_ALUNOS_PESQUISA(valor);
      },
      get() {
        return this.$store.state.alunos_pesquisa;
      }
    },
    pagina: {
      set(valor) {
        this.SET_ALUNOS_PAGINA(valor);
      },
      get() {
        return this.$store.state.alunos_pagina;
      }
    }
  },
  watch: {
    alunos_reload(valor) {
      this.buscarAlunos();
    }
  },
  methods: {
    ...mapMutations([
      "SET_ALUNOS_PAGINA",
      "SET_ALUNOS_PESQUISA",
      "SET_ALUNOS_ID_EDICAO",
      "SET_ALUNOS_ID_EXCLUSAO"
    ]),
    ...mapActions([
      'getAlunos'
    ]),
    abrirEdicao(id) {
      this.SET_ALUNOS_ID_EDICAO(id);
    },
    abrirExclusao(id) {
      this.SET_ALUNOS_ID_EXCLUSAO(id);
    },
    resetFiltros() {
      this.SET_ALUNOS_PAGINA(1);
      this.SET_ALUNOS_PESQUISA('');
    },
    atualizaPagina(pagina) {
      this.pagina = pagina;
      this.buscarAlunos();
    },
    pesquisar() {
      this.SET_ALUNOS_PAGINA(1);
      this.buscarAlunos();
    },
    async buscarAlunos() {
      try {
        this.loading = true;
        await this.getAlunos();
      } catch (e) {
        this.$toast.open({
          message: 'Não foi possível listar os alunos!',
          type: 'error'
        });
      } finally {
        this.loading = false;
      }
    }
  },
  created() {
    this.resetFiltros();
    this.buscarAlunos();
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
  margin-right: 10px;
}
</style>