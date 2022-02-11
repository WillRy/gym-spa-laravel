<template>
  <div id="page-header">
    <div class="page-header-titulo">
      <slot></slot>
    </div>
    <div class="page-header-actions">
      <slot name="actions"></slot>
    </div>
  </div>
</template>

<script>
export default {
  name: "PageAction"
}
</script>

<style>
#page-header {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  margin-bottom: 20px;
}

.page-header-titulo {
  flex: 1;
}

.page-header-titulo .titulo {
  font-style: normal;
  font-weight: bold;
  font-size: 24px;
  line-height: 28px;

  color: var(--cor-texto-principal);
}

.page-header-actions {
  display: flex;
}

.page-header-actions > *:not(:last-child) {
  margin-right: 16px;
}
</style>