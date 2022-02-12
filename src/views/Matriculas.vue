<template>
  <div id="page-matriculas">
    <PageAction>
      <template #default>
        <h1 class="titulo">Gerenciando matriculas</h1>
      </template>
      <template #actions>
        <button class="btn btn-primary" @click="abrirCadastrarMatricula = true">
          <img src="../assets/add.svg" class="icon" style="height: 20px;width: 20px">
          Cadastrar
        </button>
        <BaseSelect
            placeholder="Selecione o filtro"
            v-model="status"
            track-by="id"
            text-by="name"
            :options="status_filtro"
            mb="0px"
            width="237px"
            @change="pesquisar"
        />
        <BaseInput
            placeholder="Pesquisa por aluno ou plano"
            mb="0px"
            width="237px"
            v-model="pesquisa"
            @keydown.enter="pesquisar"
        />
      </template>
    </PageAction>

    <div class="page-matriculas-lista" v-if="matriculas && matriculas.data.length && !esconderLoading">
      <MatriculaCard
          v-for="matricula in matriculas.data"
          :dados="matricula"
      />
    </div>
    <Loader v-if="loading" width="120px" height="120px" fill="#020540"/>
    <modal-add-matricula :aberta="abrirCadastrarMatricula" @onClose="abrirCadastrarMatricula = false"/>
    <modal-editar-matricula/>
  </div>
</template>

<script>
import {mapActions, mapMutations, mapState} from "vuex";
import PageAction from '../components/painel/PageAction'
import BaseInput from '../components/form/BaseInput'
import BaseSelect from '../components/form/BaseSelect'
import Loader from "../components/Loader";
import MatriculaCard from "../components/matriculas/MatriculaCard";
import ModalAddMatricula from "../components/matriculas/ModalAddMatricula";
import ModalEditarMatricula from "../components/matriculas/ModalEditMatricula";

export default {
  name: "Matriculas",
  components: {
    ModalEditarMatricula,
    ModalAddMatricula,
    MatriculaCard,
    Loader,
    PageAction,
    BaseInput,
    BaseSelect
  },
  data() {
    return {
      abrirCadastrarMatricula: false,
      loading: false,
      matricula: {
        aluno: {nome: 'fulano da silva', email: "teste@teste.com"},
        plano: {nome: 'Premium'},
        dt_inicio: '2022-01-01',
        dt_fim: '2022-01-30'
      }
    }
  },
  computed: {
    ...mapState({
      "matriculas": 'matriculas',
      'reload': 'matriculas_reload',
      'status_filtro': 'status_filtro'
    }),
    esconderLoading() {
      return this.loading && this.pagina < 2;
    },
    pesquisa: {
      get() {
        return this.$store.state.matriculas_pesquisa;
      },
      set(valor) {
        this.SET_MATRICULAS_PESQUISA(valor);
      }
    },
    pagina: {
      get() {
        return this.$store.state.matriculas_pagina;
      },
      set(valor) {
        this.SET_MATRICULAS_PAGINA(valor);
      }
    },
    status: {
      set(valor) {
        this.SET_MATRICULAS_STATUS_FILTRO(valor);
      },
      get() {
        return this.$store.state.matriculas_status_filtro;
      }
    },
    paginaTotal() {
      return this.matriculas && this.matriculas.last_page || 1;
    }
  },
  methods: {
    ...mapMutations([
      'SET_MATRICULAS_PESQUISA',
      'SET_MATRICULAS_STATUS_FILTRO',
      'SET_MATRICULAS_PAGINA'
    ]),
    ...mapActions([
      'getMatriculas'
    ]),
    pesquisar() {
      this.pagina = 1;
      this.buscarMatriculas();
    },
    async buscarMatriculas() {
      try {
        this.loading = true;
        await this.getMatriculas();
      } catch (e) {
        console.log(e)
        this.$toast.open({
          message: 'Não foi possível listar as matrículas!',
          type: 'error'
        });
      } finally {
        this.loading = false;
      }
    },
    aumentarPagina() {
      let bottomOfWindow = Math.ceil(window.innerHeight + window.scrollY) + 60 >= document.body.scrollHeight;
      if (bottomOfWindow && this.pagina < this.paginaTotal && !this.loading) {
        this.pagina++;
      }
    },
    resetFiltros() {
      this.SET_MATRICULAS_PAGINA(1);
      this.SET_MATRICULAS_PESQUISA('');
      this.SET_MATRICULAS_STATUS_FILTRO(this.status_filtro[0]);
    },
  },
  watch: {
    pagina() {
      this.buscarMatriculas();
    },
    reload(reload) {
      if (reload.tipo === "created") {
        this.pagina = 1;
        this.buscarMatriculas();
      }
    }
  },
  created() {
    this.resetFiltros();
    this.buscarMatriculas();

    window.addEventListener("scroll", this.aumentarPagina);
  },
  beforeUnmount() {
    window.removeEventListener("scroll", this.aumentarPagina);
  }
}
</script>

<style>
.page-matriculas-lista {
  justify-content: center;

  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 40px;
  margin-bottom: 20px;
}

</style>