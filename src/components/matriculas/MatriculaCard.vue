<template>
  <div class="matricula-card" v-if="matricula">
    <h3>
      <img
          src="../../assets/icon-ativo.svg"
          class="active"
          alt=""
          v-if="!matricula.desativado"
          title="Matrícula ativa"
      >
      <img
          src="../../assets/icon-inativo.svg"
          class="active"
          alt=""
          v-else
          title="Matrícula inativa"
      >

      {{ matricula.aluno.nome }}
    </h3>
    <h5>{{ matricula.plano.nome }}</h5>
    <div class="matricula-card-datas">

      <div class="matricula-card-data">
        <img src="../../assets/calendar.svg" class="icon" style="height: 16px;width: 16px">
        <span>{{ matricula.dt_inicio }}</span>
      </div>

      <div class="matricula-card-data">
        <img src="../../assets/calendar.svg" class="icon" style="height: 16px;width: 16px">
        <span>{{ matricula.dt_fim }}</span>
      </div>

    </div>
    <div class="matricula-card-act">
      <button class="btn btn-primary" @click="abrirEdicao">
        Editar
      </button>
      <button
          class="btn btn-danger"
          @click="inativar"
          :disabled="matricula.desativado"
      >
        <Loader v-if="loading" width="36px" height="36px"/>
        Desativar
      </button>
    </div>
  </div>
</template>

<script>
import {mapActions, mapMutations, mapState} from "vuex";
import Loader from "../Loader";

export default {
  name: "MatriculaCard",
  props: ['dados'],
  components: {
    Loader
  },
  data() {
    return {
      matricula: this.dados,
      loading: false
    }
  },
  computed: {
    ...mapState({
      'reload': 'matriculas_reload'
    }),
  },
  methods: {
    ...mapActions(['returnMatricula', 'removeMatricula']),
    ...mapMutations(['SET_MATRICULAS_ID_EDICAO']),
    abrirEdicao() {
      this.SET_MATRICULAS_ID_EDICAO(this.matricula.id);
    },
    inativar() {
      this.loading = true;
      this.removeMatricula({idMatricula: this.matricula.id})
          .then(() => {
            this.$toast.open({
              message: 'Matrícula desativada com sucesso!',
              type: 'success'
            });
          })
          .finally(() => {
            this.loading = false;
            this.reloadDados();
          })
    },
    async reloadDados() {
      let response = await this.returnMatricula(this.matricula.id);
      this.matricula = response.data;
    }
  },
  watch: {
    dados(valor) {
      this.matricula = valor;
    },
    reload(reload) {
      if (reload.tipo === "updated" && reload.payload && reload.payload.id && reload.payload.id === this.matricula.id) {
        this.reloadDados();
      }
    }
  }
}
</script>

<style scoped>
.matricula-card {
  padding: 20px;
  box-shadow: rgba(0, 0, 0, 0.1) 0px 1px 3px 0px, rgba(0, 0, 0, 0.06) 0px 1px 2px 0px;
  text-align: center;
  background: #fff;
}

.matricula-card h3 {
  font-style: normal;
  font-weight: bold;
  font-size: 18px;
  line-height: 28px;
  color: var(--cor-texto-secundario);
  text-transform: capitalize;
  display: flex;
  align-items: center;
  justify-content: center;
}

.matricula-card h5 {
  font-style: normal;
  font-weight: bold;
  font-size: 14px;
  line-height: 28px;
  color: var(--cor-texto-terciario);
  text-transform: uppercase;

  margin: 10px 0;
}

.matricula-card-act {
  display: flex;
  align-items: center;
  align-content: center;
}

.matricula-card-act button {
  flex: 1;
}

.matricula-card-act button:not(:last-of-type) {
  margin-right: 20px;
}

.matricula-card-datas {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin: 20px 0;
  flex-shrink: 0;
}

.matricula-card-data {
  display: flex;
  align-items: center;
  justify-content: space-between;
  color: var(--cor-texto-secundario);
}

.matricula-card-data img {
  margin-right: 8px;
}

.matricula-card .active{
  height: 14px;
  width: 14px;
  margin-right: 8px;
}
</style>