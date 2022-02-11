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

const laravelErrors = {
    install(Vue, options) {
        Vue.laravelError = (e, message) => {
            let response = e.response;
            if (response && response.status === 422 && response.data.errors) {
                let erro = Object.keys(response.data.errors)[0];
                this.$toast.open({
                    message: response.data.errors[erro][0],
                    type: 'error'
                });
            } else {
                this.$toast.open({
                    message: message,
                    type: 'error'
                });
            }
        }
    },
}

let LaravelError = {
    install: (app, options) => {
        // inject a globally available $translate() method
        app.config.globalProperties.$laravelError = (e, message) => {
            let response = e.response;
            if (response && response.status === 422 && response.data.errors) {
                let erro = Object.keys(response.data.errors)[0];
                app.config.globalProperties.$toast.open({
                    message: response.data.errors[erro][0],
                    type: 'error'
                });
            } else {
                app.config.globalProperties.$toast.open({
                    message: message,
                    type: 'error'
                });
            }
        }
    }
}

vue.use(store)
    .use(router)
    .use(VueToast)
    .use(LaravelError)
    .directive('mask', vMaskV3)
    .component('DatePicker', DatePicker);

vue.mount('#app');
