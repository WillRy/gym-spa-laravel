import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import VueToast from 'vue-toast-notification';
import 'vue-toast-notification/dist/theme-sugar.css';
import 'v-calendar/dist/style.css';
import './styles/multiselect.css';
import { DatePicker } from 'v-calendar';
import { VueMaskDirective } from 'v-mask';

const vue = createApp(App);



const vMaskV2 = VueMaskDirective;
const vMaskV3 = {
    beforeMount: vMaskV2.bind,
    updated: vMaskV2.componentUpdated,
    unmounted: vMaskV2.unbind
};


vue.use(store)
    .use(router)
    .use(VueToast)
    .directive('mask', vMaskV3)
    .component('DatePicker', DatePicker);

vue.mount('#app');
