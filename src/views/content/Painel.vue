<template>
  <div id="painel">
    <Header/>
    <div class="container">
      <router-view :key="$route.fullPath"></router-view>
    </div>
  </div>
</template>

<script>
import Header from "../../components/painel/Header";
export default {
  name: "Painel",
  components: {Header}
}
</script>

<style scoped>
#painel {
  background: var(--cor-bg-secundaria);
  padding-top: 64px;
  height: 100vh;
}


</style>