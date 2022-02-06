<template>
  <div class="form-group">
    <label v-if="label" :for="$attrs.id">{{label}}</label>
    <input type="text" :value="modelValue" @input="updateValue" v-bind="attrs">
    <div class="errorMessage">
      <slot name="error"></slot>
    </div>
  </div>
</template>

<script>
export default {
  name: "BaseInput",
  inheritAttrs: false,
  props: {
    label: {
      type: String,
      default: ''
    },
    modelValue: [String, Number],
  },
  computed: {
    attrs() {
      return {
        ...this.$attrs,
        input: this.updateValue
      }
    }
  },
  methods: {
    updateValue(event) {
      this.$emit('update:modelValue', event.target.value)
    }
  },
}
</script>
<style scoped>
.form-group {
  margin-bottom: 20px;
}

.form-group label {
  font-family: 'Roboto', sans-serif;
  font-style: normal;
  font-weight: bold;
  font-size: 14px;
  color: #444444;
  margin-bottom: 8px;
  text-transform: uppercase;
  display: block;
}

.form-group input {
  background: #FFFFFF;
  border: 1px solid var(--cor-borda-principal);
  border-radius: var(--radius-principal);
  padding: 13px 15px;
  display: block;
  width: 100%;
  color: var(--cor-texto-secundario);
}

.form-group input::placeholder {
  font-family: 'Roboto', sans-serif;
  font-style: normal;
  font-weight: normal;
  font-size: 16px;
  color: var(--cor-texto-terciario);
}

.form-group input.error {
  border-color: red;
}

.errorMessage {
  color: red;
  margin: 3px 0;
  font-weight: bold;
}
</style>
