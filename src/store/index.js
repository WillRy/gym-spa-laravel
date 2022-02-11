import {createStore} from 'vuex'
import api from "../services/api";
import axios from "axios";
import alunos from './alunos'
import planos from './planos'
import matriculas from "./matriculas";

export default createStore({
    state: {
        user: null,
        ...alunos.state,
        ...planos.state,
        ...matriculas.state,
    },
    mutations: {
        SET_USER(state, user) {
            state.user = user;
        },
        ...alunos.mutations,
        ...planos.mutations,
        ...matriculas.mutations,
    },
    actions: {
        login(context,{email, password}){
            return axios.post("http://localhost:8000/api/auth/login", {email, password}).then((r) => {
                window.localStorage.setItem("token", r.data.access_token);
                return r;
            });
        },
        logout(context){
            return new Promise((resolve)=>{
                context.commit('SET_USER', null);
                window.localStorage.removeItem("token");
                resolve(true);
            });
        },
        getUser(context) {
            return api.post("/auth/me").then((r) => {
                context.commit('SET_USER', r.data);
                return r;
            });
        },
        ...alunos.actions,
        ...planos.actions,
        ...matriculas.actions,
    },
    modules: {}
})
