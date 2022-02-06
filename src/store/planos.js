import api from "../services/api";

export default {
    state: {
        planos: null,
        planos_pagina: 1,
        planos_pesquisa: '',
        planos_reload: null,
        planos_id_edicao: null,
        planos_id_exclusao: null,
    },
    mutations: {
        SET_PLANOS(state, planos) {
            state.planos = planos;
        },
        SET_PLANOS_PAGINA(state, pagina) {
            state.planos_pagina = pagina;
        },
        SET_PLANOS_PESQUISA(state, pesquisa) {
            state.planos_pesquisa = pesquisa;
        },
        SET_PLANOS_RELOAD(state, reload) {
            state.planos_reload = reload;
        },
        SET_PLANOS_ID_EDICAO(state, idPlano) {
            state.planos_id_edicao = idPlano;
        },
        SET_PLANOS_ID_EXCLUSAO(state, idPlano) {
            state.planos_id_exclusao = idPlano;
        },
    },
    actions: {
        getPlanos(context) {
            let pagina = context.state.planos_pagina;
            let pesquisa = context.state.planos_pesquisa;

            let queryString = new URLSearchParams({
                page: pagina,
                pesquisa: pesquisa
            }).toString();
            return api.get(`/planos?${queryString}`).then((r) => {
                context.commit("SET_PLANOS", r.data);
                return r;
            });
        },
        addPlano(context, payload) {
            return api.post(`/planos`, payload).then((r) => {
                return r;
            });
        },
        editPlano(context, {idPlano, dados}) {
            return api.put(`/planos/${idPlano}`, dados).then((r) => {
                return r;
            });
        },
        removePlano(context, {idPlano}) {
            return api.delete(`/planos/${idPlano}`).then((r) => {
                return r;
            });
        },
        returnPlano(context, idPlano){
            return api.get(`/planos/${idPlano}`).then((r) => {
                return r;
            });
        }
    },
    modules: {}
}