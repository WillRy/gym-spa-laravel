import { createRouter, createWebHistory } from 'vue-router'
import Publico from "../views/content/Publico";
import Login from "../views/publico/Login";
import Painel from "../views/content/Painel";
import Alunos from "../views/Alunos";
import store from '../store/index'
import Planos from "../views/Planos";
import Matriculas from "../views/Matriculas";

const routes = [
  {
    path: '/',
    component: Publico,
    beforeEnter(to, from, next) {
      let token = window.localStorage.getItem("token");
      if(token) {
        store.dispatch('getUser')
            .then(() => {
              next({name: 'alunos'});
            })
            .catch(() => {
              next();
            })
      } else {
        next();
      }
    },
    children: [
      {
        path: "",
        name: "login",
        component: Login
      }
    ]
  },
  {
    path: '/painel',
    component: Painel,
    beforeEnter(to, from, next) {
      let token = window.localStorage.getItem("token");
      if(token) {
        store.dispatch('getUser')
            .then(() => {
              next();
            })
            .catch(() => {
              next({name: 'login'});
            })
      } else {
        next({name: 'login'});
      }
    },
    children: [
      {
        path: "",
        name: "alunos",
        component: Alunos
      },
      {
        path: "planos",
        name: "planos",
        component: Planos
      },
      {
        path: "matriculas",
        name: "matriculas",
        component: Matriculas
      }
    ]
  },
  {
    name: 'logout',
    path: '/logout',
    beforeEnter(to, from, next) {
      store.dispatch('logout').then(() => {
        next({name: 'login'})
      })
    },
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
