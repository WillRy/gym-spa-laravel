import axios from 'axios';
import store from '../store/index'

const api = axios.create({
    baseURL: 'http://localhost:8000/api'
});

api.interceptors.request.use(function (config) {
    config.headers.Authorization = 'Bearer '+window.localStorage.getItem("token");

    return config;
});

axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';

api.interceptors.response.use(function (response) {
    return response;
}, async function (error) {
    if (401 === error.response.status) {
        await store.dispatch("logout");
        window.localStorage.removeItem("token");
        window.location = '/';
    }
    return Promise.reject(error);
});
export default api;
