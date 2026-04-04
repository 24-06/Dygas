import { createRouter, createWebHistory } from 'vue-router'
import DashboardView from './views/DashboardView.vue'
import CensoView from './views/CensoView.vue'
import RegistrosView from './views/RegistrosView.vue'
import LoginView from './views/LoginView.vue'

export const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/login', component: LoginView, meta: { title: 'Iniciar Sesión', public: true } },
    { path: '/', component: DashboardView, meta: { title: 'Dashboard' } },
    { path: '/censo', component: CensoView, meta: { title: 'Censo' } },
    { path: '/registros', component: RegistrosView, meta: { title: 'Registros' } },
  ],
})

router.beforeEach((to) => {
  const token = localStorage.getItem('dygas_token')
  const isAuthenticated = !!token

  if (!to.meta.public && !isAuthenticated) {
    return { path: '/login' }
  }
  if (to.path === '/login' && isAuthenticated) {
    return { path: '/' }
  }
})

router.afterEach((to) => {
  document.title = `DYGAS | ${to.meta.title || 'App'}`
})
