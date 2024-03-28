// Composables
import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    component: () => import('@/layouts/default/Default.vue'),
    children: [
      {
        path: '',
        name: 'Home',
        component: () => import('@/views/Home.vue'),
      },
      {
        path: 'cadastro-livro',
        name: 'Livro',
        component: () => import('@/views/CadastroLivro.vue'),
      },
      {
        path: 'cadastro-categoria',
        name: 'Categoria',
        component: () => import('@/views/CadastroCategoria.vue'),
      },
      {
        path: 'aluguel-livro',
        name: 'AluguelLivro',
        component: () => import('@/views/AluguelLivro.vue'),
      },
      {
        path: "/:pathMatch(.*)*",
        redirect: { name: "Home" }
      }
    ],
  },
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
})

export default router
