<template>
  <router-view/>
</template>
<style>
@import url('https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;700&display=swap');

* {
  padding: 0;
  margin: 0;
  box-sizing: border-box;
  font-family: 'Roboto', sans-serif;
}

:root {
  --cor-principal: #EE4D64;
  --cor-texto-principal: #444444;
  --cor-texto-secundario: #666666;
  --cor-texto-terciario: #999999;
  --radius-principal: 4px;
  --cor-borda-principal: #DDDDDD;
}

.mb-20 {
  margin-bottom: 20px;
}

.btn {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 45px;
  border: none;
  font-weight: bold;
  font-family: 'Roboto', sans-serif;
  cursor: pointer;
  font-size: 16px;
}

.btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.btn:hover {
  opacity: 0.6;
}

.btn-full {
  width: 100%;
}

.btn-primary {
  background-color: var(--cor-principal);
  color: #fff;
}
</style>