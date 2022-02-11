<template>
<div id="header">

    <div id="logo">
      <img src="../../assets/logo.svg" alt="">
      <h1 class="titulo">gym</h1>
    </div>

    <div id="menu">
      <ul>
        <li>
          <router-link to="painel">alunos</router-link>
          <router-link to="planos">planos</router-link>
          <router-link to="matriculas">matrículas</router-link>
        </li>
      </ul>
      <div class="header-user">
        <span>{{user.name}}</span>
        <router-link to="logout" class="header-logout">
          sair do sistema
        </router-link>
      </div>
    </div>
</div>
</template>

<script>
import {mapState} from 'vuex';
export default {
  name: "Header",
  computed: {
    ...mapState({
      "user": 'user'
    })
  }
}
</script>

<style scoped>
#header {
  position: fixed;
  top: 0;
  width: 100%;
  height: 64px;
  background: #FFFFFF;
  border: 1px solid var(--cor-borda-principal);

  display: flex;
  align-items: center;
  padding: 0 30px;
}

.header-container {

}

#logo {
  display: flex;
  align-items: center;
  position: relative;
  padding-right: 20px;
  width: auto;
  margin-right: 10px;
}

#logo::after {
  content: '';
  display: block;
  width: 1px;
  background-color: var(--cor-borda-principal);
  height: 32px;
  position: absolute;
  right: 0;
}

#logo img {
  width: 45px;
  height: 24px;
  display: block;
  margin-right: 12px;
}

#logo .titulo {
  font-style: normal;
  font-weight: bold;
  font-size: 15px;
  color: var(--cor-principal);
  text-transform: uppercase;
}

#menu {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex: 1;
}

#menu ul {
  display: flex;
  align-items: center;
}

#menu ul a {
  font-style: normal;
  font-weight: bold;
  font-size: 15px;
  line-height: 18px;
  color: var(--cor-texto-terciario);
  text-transform: uppercase;
  padding: 10px;
}

#menu ul a.router-link-exact-active {
  color: var(--cor-link-hover);
}

#menu ul a:hover {
  color: var(--cor-link-hover);
}

.header-user span {
  font-style: normal;
  font-weight: bold;
  font-size: 14px;
  color: var(--cor-texto-secundario);
}

.header-user span {
  text-align: right;
  display: block;
  font-style: normal;
  font-weight: bold;
  font-size: 14px;
  color: var(--cor-texto-secundario);
}

.header-user .header-logout {
  font-style: normal;
  font-weight: normal;
  font-size: 14px;
  text-align: right;
  color: var(--cor-principal);
}

.header-user .header-logout:hover {
  opacity: 0.6;
}
</style>