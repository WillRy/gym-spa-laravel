import api from "../services/api";

export default {
    state: {
        matriculas: null,
        matriculas_pagina: 1,
        matriculas_pesquisa: '',
        matriculas_reload: null,
        matriculas_id_edicao: null,
        matriculas_id_exclusao: null,
    },
    mutations: {
        SET_MATRICULAS(state, matriculas) {
            let pagina = state.matriculas_pagina;
            if (pagina === 1) {
                state.matriculas = matriculas;
            } else {
                debugger

                let antigas = state.matriculas;
                let novos = [...antigas.data, ...matriculas.data];
                state.matriculas = Object.assign({}, state.matriculas, {data: novos});
            }
        },
        SET_MATRICULAS_PAGINA(state, pagina) {
            state.matriculas_pagina = pagina;
        },
        SET_MATRICULAS_PESQUISA(state, pesquisa) {
            state.matriculas_pesquisa = pesquisa;
        },
        SET_MATRICULAS_RELOAD(state, reload) {
            state.matriculas_reload = reload;
        },
        SET_MATRICULAS_ID_EDICAO(state, idMatricula) {
            state.matriculas_id_edicao = idMatricula;
        },
        SET_MATRICULAS_ID_EXCLUSAO(state, idMatricula) {
            state.matriculas_id_exclusao = idMatricula;
        },
    },
    actions: {
        getMatriculas(context) {
            let pagina = context.state.matriculas_pagina;
            let pesquisa = context.state.matriculas_pesquisa;

            let queryString = new URLSearchParams({
                page: pagina,
                pesquisa: pesquisa
            }).toString();
            return api.get(`/matriculas?${queryString}`).then((r) => {
                context.commit("SET_MATRICULAS", r.data);
                return r;
            });
        },
        addMatricula(context, payload) {
            return api.post(`/matriculas`, payload).then((r) => {
                return r;
            });
        },
        editMatricula(context, {idMatricula, dados}) {
            return api.put(`/matriculas/${idMatricula}`, dados).then((r) => {
                return r;
            });
        },
        removeMatricula(context, {idMatricula}) {
            return api.delete(`/matriculas/${idMatricula}`).then((r) => {
                return r;
            });
        },
        returnMatricula(context, idMatricula){
            return api.get(`/matriculas/${idMatricula}`).then((r) => {
                return r;
            });
        },
        getMatriculaAlunos(context, {pesquisa}) {
            let queryString = new URLSearchParams({
                pesquisa: pesquisa
            }).toString();
            return api.get(`/alunos?${queryString}`).then((r) => {
                return r;
            });
        },
        getMatriculaPlanos(context, {pesquisa}) {
            let queryString = new URLSearchParams({
                pesquisa: pesquisa
            }).toString();
            return api.get(`/planos?${queryString}`).then((r) => {
                return r;
            });
        },
    },
    modules: {}
}