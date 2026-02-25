<template>
  <div class="relative" @mousemove="handleUserActivity" @keydown="handleUserActivity" @click="handleUserActivity">
    <!-- Background Gradient -->
    <div class="absolute inset-0 
      bg-[radial-gradient(1200px_800px_at_20%_-10%,rgba(22,160,133,0.55),transparent),
          radial-gradient(1000px_700px_at_90%_10%,rgba(26,188,156,0.50),transparent),
          radial-gradient(900px_600px_at_50%_110%,rgba(22,160,133,0.40),transparent)]">
    </div>

    <!-- Inactivity Warning Modal -->
    <InactivityWarning />
    <ToastContainer />

    <!-- Header -->
    <header class="relative no-print">
      <div class="mx-auto max-w-6xl px-4 py-6 flex items-center justify-between">
        <div class="flex items-center gap-3">
          <!-- Logo -->
          <img :src="logo" alt="Logo Klinik" class="h-35 w-auto rounded-md shadow-sm" />

          <!-- Text -->
          <div>
            <p class="text-sm text-slate-300">Struk Generator</p>
            <h1 class="text-lg font-semibold tracking-tight">Klinik & Kasir</h1>
          </div>
        </div>

        <!-- Navigation -->
        <nav class="flex items-center gap-2 text-sm">
          <RouterLink class="navlink" to="/">Dashboard</RouterLink>
          <RouterLink class="navlink" to="/new">Buat Struk</RouterLink>
          <RouterLink v-if="authStore.isAdmin" class="navlink" to="/deleted">🗑️ Terhapus</RouterLink>
          <RouterLink class="navlink" to="/settings">Pengaturan</RouterLink>
          <a class="navlink" href="https://github.com/Limitlessz7/PKL-TUGAS-ATM/" target="_blank" rel="noreferrer">Dokumentasi</a>
          
          <!-- User Section -->
          <div v-if="authStore.isAuthenticated" class="flex items-center gap-3 ml-4 pl-4 border-l border-white/20">
            <div class="flex items-center gap-3">
              <div class="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-sm text-white font-semibold">{{ (authStore.user?.name || authStore.user?.username || 'U').charAt(0).toUpperCase() }}</div>
              <div class="flex flex-col leading-tight">
                <span class="text-slate-200 text-sm">{{ authStore.user?.name || authStore.user?.username }}</span>
                <div class="flex items-center gap-2">
                  <RoleBadge :role="authStore.user?.role" />
                </div>
              </div>
            </div>
            <button 
              @click="handleLogout"
              class="navlink"
            >
              Logout
            </button>
          </div>
        </nav>
      </div>
    </header>

    <!-- Main Content -->
    <main class="relative">
      <div class="mx-auto max-w-6xl px-4 pb-10">
        <RouterView />
      </div>
    </main>

    <!-- Footer -->
    <footer class="relative no-print">
      <div class="mx-auto max-w-6xl px-4 py-8 text-xs text-slate-400">
        <div class="flex items-center justify-between gap-3 flex-wrap">
          <p>© {{ year }} Struk App • Vue 3 + Express + MySQL</p>
          <p class="opacity-80">Tip: klik “Print” untuk cetak versi thermal.</p>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { useAuthStore } from '../../stores/auth'
import InactivityWarning from '../auth/InactivityWarning.vue'
import logo from '../../assets/logo.png'
import RoleBadge from '../ui/RoleBadge.vue'
import ToastContainer from '../ui/ToastContainer.vue'
import { onMounted, onUnmounted } from 'vue'

const router = useRouter()
const authStore = useAuthStore()
const year = new Date().getFullYear()

let activityTimeout = null

const handleUserActivity = () => {
  if (!authStore.isAuthenticated) return
  
  // Debounce activity updates
  clearTimeout(activityTimeout)
  activityTimeout = setTimeout(() => {
    authStore.updateActivityTime()
  }, 1000)
}

const handleLogout = () => {
  authStore.logout()
  router.push({ name: 'login' })
}

onMounted(() => {
  if (authStore.isAuthenticated) {
    authStore.loadFromStorage()
  }
})

onUnmounted(() => {
  clearTimeout(activityTimeout)
  authStore.stopInactivityTimer()
})
</script>

<style scoped>
.navlink {
  @apply px-3 py-2 rounded-xl text-slate-200/90 hover:text-white hover:bg-white/10 ring-1 ring-transparent hover:ring-white/10 transition;
}
.router-link-active {
  @apply bg-white/10 ring-1 ring-white/15 text-white;
}
</style>
