import api from "../services/api";

export default {
    state: {
        alunos: null,
        alunos_pagina: 1,
        alunos_pesquisa: '',
        alunos_reload: null,
        alunos_id_edicao: null,
        alunos_id_exclusao: null,
    },
    mutations: {
        SET_ALUNOS(state, alunos) {
            state.alunos = alunos;
        },
        SET_ALUNOS_PAGINA(state, pagina) {
            state.alunos_pagina = pagina;
        },
        SET_ALUNOS_PESQUISA(state, pesquisa) {
            state.alunos_pesquisa = pesquisa;
        },
        SET_ALUNOS_RELOAD(state, reload) {
            state.alunos_reload = reload;
        },
        SET_ALUNOS_ID_EDICAO(state, idAluno) {
            state.alunos_id_edicao = idAluno;
        },
        SET_ALUNOS_ID_EXCLUSAO(state, idAluno) {
            state.alunos_id_exclusao = idAluno;
        },
    },
    actions: {
        getAlunos(context) {
            let pagina = context.state.alunos_pagina;
            let pesquisa = context.state.alunos_pesquisa;

            let queryString = new URLSearchParams({
                page: pagina,
                pesquisa: pesquisa
            }).toString();
            return api.get(`/alunos?${queryString}`).then((r) => {
                context.commit("SET_ALUNOS", r.data);
                return r;
            });
        },
        addAluno(context, payload) {
            return api.post(`/alunos`, payload).then((r) => {
                return r;
            });
        },
        editAluno(context, {idAluno, dados}) {
            return api.put(`/alunos/${idAluno}`, dados).then((r) => {
                return r;
            });
        },
        removeAluno(context, {idAluno}) {
            return api.delete(`/alunos/${idAluno}`).then((r) => {
                return r;
            });
        },
        returnAluno(context, idAluno){
            return api.get(`/alunos/${idAluno}`).then((r) => {
                return r;
            });
        }
    },
    modules: {}
}