import { createRouter, createWebHistory } from 'vue-router'
import Publico from "../views/content/Publico";
import Login from "../views/publico/Login";
import Painel from "../views/content/Painel";
import Alunos from "../views/Alunos";

const routes = [
  {
    path: '/',
    component: Publico,
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
    children: [
      {
        path: "",
        name: "alunos",
        component: Alunos
      }
    ]
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
