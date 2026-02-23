<template>
  <transition name="fade-modal">
    <div v-if="authStore.showInactivityWarning" class="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div class="bg-gradient-to-br from-slate-900/95 to-slate-800/95 rounded-2xl border border-white/10 shadow-2xl max-w-sm w-full p-6 space-y-6">
        <!-- Icon -->
        <div class="flex justify-center">
          <div class="inline-flex items-center justify-center w-16 h-16 rounded-full bg-orange-500/20 border border-orange-500/50">
            <svg class="w-8 h-8 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
          </div>
        </div>

        <!-- Content -->
        <div class="text-center space-y-3">
          <h3 class="text-xl font-bold text-white">Sesi akan berakhir</h3>
          <p class="text-slate-300 text-sm">Anda tidak aktif selama beberapa waktu. Sesi Anda akan ditutup dalam:</p>
          
          <!-- Countdown Timer -->
          <div class="py-4">
            <div class="text-4xl font-bold text-orange-400 font-mono">{{ formatCountdown }}</div>
            <p class="text-xs text-slate-400 mt-2">detik sisa</p>
          </div>

          <p class="text-slate-400 text-xs">Klik "Lanjutkan Sesi" untuk tetap login atau Anda akan secara otomatis logout.</p>
        </div>

        <!-- Actions -->
        <div class="flex gap-3 pt-4">
          <button
            @click="handleLogout"
            class="flex-1 px-4 py-2.5 text-sm font-semibold text-slate-200 bg-slate-700/50 hover:bg-slate-700 rounded-lg transition-colors"
          >
            Logout
          </button>
          <button
            @click="handleContinueSession"
            class="flex-1 px-4 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-600 hover:to-emerald-600 rounded-lg transition-colors"
          >
            Lanjutkan Sesi
          </button>
        </div>
      </div>
    </div>
  </transition>
</template>

<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../../stores/auth'

const router = useRouter()
const authStore = useAuthStore()

const formatCountdown = computed(() => {
  const seconds = authStore.inactivityWarningSeconds
  const minutes = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`
})

const handleContinueSession = () => {
  authStore.updateActivityTime()
}

const handleLogout = async () => {
  authStore.logout()
  await router.push({ name: 'login' })
}
</script>

<style scoped>
.fade-modal-enter-active,
.fade-modal-leave-active {
  transition: opacity 0.3s ease;
}

.fade-modal-enter-from,
.fade-modal-leave-to {
  opacity: 0;
}
</style>
