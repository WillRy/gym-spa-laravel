import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import VueToast from 'vue-toast-notification';
import 'vue-toast-notification/dist/theme-sugar.css';
import 'v-calendar/dist/style.css';
import './styles/multiselect.css';
import { DatePicker } from 'v-calendar';


const vue = createApp(App);

vue.use(store)
    .use(router)
    .use(VueToast)
    .component('DatePicker', DatePicker);

vue.mount('#app');
