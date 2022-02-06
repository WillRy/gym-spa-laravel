<template>
  <div class="form-group" :style="{'margin-bottom': mb, width: width}">
    <label v-if="label" :for="$attrs.id">{{label}}</label>
    <DatePicker v-model="data" mode="date" is24hr v-bind="attrs">
      <template v-slot="{ inputValue, inputEvents }">
        <input
            class="px-2 py-1 border rounded focus:outline-none focus:border-blue-300"
            :value="inputValue"
            v-on="inputEvents"
        />
      </template>
    </DatePicker>
    <div class="errorMessage">
      <slot name="error"></slot>
    </div>
  </div>
</template>

<script>
export default {
  name: "BaseDate",
  inheritAttrs: false,
  props: {
    label: {
      type: String,
      default: ''
    },
    modelValue: [String, Date],
    mb: {
      default: '20px'
    },
    width: {
      default: 'auto'
    }
  },
  computed: {
    attrs() {
      return {
        ...this.$attrs,
      }
    }
  },
  data(){
    return {
      data:  typeof this.modelValue === "string" ? new Date(`${this.modelValue}T00:00:00`) : this.modelValue
    }
  },
  created() {
    this.$emit('update:modelValue', this.data);
  },
  watch: {
    data(valor){
      this.$emit('update:modelValue', valor);
    }
  }
}
</script>
<style scoped>

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
  height: 100%;
  color: var(--cor-texto-secundario);
}

.form-group input::placeholder {
  font-family: 'Roboto', sans-serif;
  font-style: normal;
  font-weight: normal;
  font-size: 16px;
  color: var(--cor-texto-terciario);
}

.error input {
  border-color: red;
}

.errorMessage {
  color: red;
  margin: 3px 0;
  font-weight: bold;
}
</style>
