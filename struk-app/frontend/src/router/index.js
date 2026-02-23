import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import Dashboard from '../views/Dashboard.vue'
import NewReceipt from '../views/NewReceipt.vue'
import ReceiptDetail from '../views/ReceiptDetail.vue'
import Settings from '../views/Settings.vue'
import DeletedTransactions from '../views/DeletedTransactions.vue'
import Login from '../views/Login.vue'

const routes = [
  { path: '/login', name: 'login', component: Login },
  { path: '/', name: 'dashboard', component: Dashboard, meta: { requiresAuth: true } },
  { path: '/new', name: 'new', component: NewReceipt, meta: { requiresAuth: true } },
  { path: '/receipt/:id', name: 'receipt', component: ReceiptDetail, props: true, meta: { requiresAuth: true } },
  { path: '/deleted', name: 'deleted', component: DeletedTransactions, meta: { requiresAuth: true } },
  { path: '/settings', name: 'settings', component: Settings, meta: { requiresAuth: true } }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()
  authStore.loadFromStorage()

  const isAuthenticated = authStore.isAuthenticated
  const requiresAuth = to.meta.requiresAuth

  if (requiresAuth && !isAuthenticated) {
    next({ name: 'login' })
  } else if (to.name === 'login' && isAuthenticated) {
    next({ name: 'dashboard' })
  } else {
    next()
  }
})

export default router
