<template>
  <div class="relative min-h-screen overflow-hidden flex items-center justify-center p-4">
    <!-- Background Gradient (matches AppShell) -->
    <div class="absolute inset-0 
      bg-[radial-gradient(1200px_800px_at_20%_-10%,rgba(22,160,133,0.55),transparent),
          radial-gradient(1000px_700px_at_90%_10%,rgba(26,188,156,0.50),transparent),
          radial-gradient(900px_600px_at_50%_110%,rgba(22,160,133,0.40),transparent)]">
    </div>

    <!-- Decorative Shapes -->
    <div class="absolute top-20 right-20 w-40 h-40 bg-teal-400/10 rounded-full blur-3xl"></div>
    <div class="absolute bottom-32 left-10 w-56 h-56 bg-emerald-400/10 rounded-full blur-3xl"></div>

    <!-- Card Container -->
    <div class="relative w-full max-w-md">
      <div class="absolute -inset-0.5 bg-gradient-to-br from-teal-400/20 to-emerald-400/20 rounded-2xl blur-xl opacity-75"></div>
      
      <Card class="shadow-2xl relative backdrop-blur-lg bg-gradient-to-br from-slate-900/80 to-slate-800/80 border border-white/10">
        <!-- Inner Padding Wrapper -->
        <div class="px-8 py-10">
          <!-- Header -->
          <div class="text-center mb-10">
            <div class="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-teal-400 via-emerald-400 to-emerald-500 mb-5 shadow-2xl transform hover:scale-105 transition-transform">
              <svg class="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
              </svg>
            </div>
            <h1 class="text-4xl font-bold bg-gradient-to-r from-teal-300 to-emerald-300 bg-clip-text text-transparent mb-2">Struk App</h1>
            <p class="text-slate-300 text-base font-medium">Admin Security Portal</p>
          </div>

          <!-- Form -->
          <form @submit.prevent="handleLogin" class="space-y-6">
            <!-- Username Field -->
            <div class="group">
              <label for="username" class="block text-sm font-semibold text-slate-200 mb-3 flex items-center gap-2">
                <span class="w-1 h-1 rounded-full bg-teal-400"></span>
                Username
              </label>
              <div class="relative">
                <div class="absolute left-4 top-1/2 -translate-y-1/2 text-teal-400 group-focus-within:text-emerald-400 transition">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                  </svg>
                </div>
                <input
                  id="username"
                  v-model="form.username"
                  type="text"
                  placeholder="Masukkan username"
                  class="w-full pl-12 pr-4 py-3.5 border border-white/10 rounded-xl bg-white/5 backdrop-blur-sm text-white placeholder-slate-400 focus:ring-2 focus:ring-teal-400/50 focus:border-teal-400/50 focus:bg-white/10 transition-all outline-none"
                  :disabled="isLoading || authStore.isCooldown"
                  @blur="validateUsername"
                />
              </div>
              <transition name="slide">
                <p v-if="errors.username" class="mt-2 text-xs text-red-400 flex items-center gap-1">
                  <span class="text-red-400">•</span>
                  {{ errors.username }}
                </p>
              </transition>
            </div>

            <!-- Password Field -->
            <div class="group">
              <label for="password" class="block text-sm font-semibold text-slate-200 mb-3 flex items-center gap-2">
                <span class="w-1 h-1 rounded-full bg-teal-400"></span>
                Password
              </label>
              <div class="relative">
                <div class="absolute left-4 top-1/2 -translate-y-1/2 text-teal-400 group-focus-within:text-emerald-400 transition">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
                  </svg>
                </div>
                <input
                  id="password"
                  v-model="form.password"
                  :type="showPassword ? 'text' : 'password'"
                  placeholder="Masukkan password"
                  class="w-full pl-12 pr-12 py-3.5 border border-white/10 rounded-xl bg-white/5 backdrop-blur-sm text-white placeholder-slate-400 focus:ring-2 focus:ring-teal-400/50 focus:border-teal-400/50 focus:bg-white/10 transition-all outline-none"
                  :disabled="isLoading || authStore.isCooldown"
                  @blur="validatePassword"
                />
                <button
                  type="button"
                  @click="showPassword = !showPassword"
                  class="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-teal-400 transition-colors"
                  :disabled="isLoading || authStore.isCooldown"
                >
                  <svg v-if="!showPassword" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                  </svg>
                  <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-4.803m5.596-3.856a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0z"></path>
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                  </svg>
                </button>
              </div>
              <transition name="slide">
                <p v-if="errors.password" class="mt-2 text-xs text-red-400 flex items-center gap-1">
                  <span class="text-red-400">•</span>
                  {{ errors.password }}
                </p>
              </transition>
            </div>

            <!-- Error Messages -->
            <transition name="fade">
              <div v-if="authStore.error" :class="['p-4 rounded-xl border text-sm transition-all', authStore.isCooldown ? 'bg-gradient-to-r from-red-900/50 to-rose-900/50 border-red-500/50 text-red-200' : 'bg-gradient-to-r from-orange-900/50 to-amber-900/50 border-orange-500/50 text-orange-200']">
                <div class="flex gap-3">
                  <svg v-if="authStore.isCooldown" class="w-5 h-5 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd"></path>
                  </svg>
                  <svg v-else class="w-5 h-5 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd"></path>
                  </svg>
                  <div class="flex-1">
                    <p>{{ authStore.error }}</p>
                    <div v-if="authStore.isCooldown" class="mt-3 text-center font-mono font-bold text-base">
                      {{ authStore.cooldownSeconds }}s
                    </div>
                  </div>
                </div>
              </div>
            </transition>

            <!-- Submit Button -->
            <button
              type="submit"
              :disabled="isLoading || authStore.isCooldown || !isFormValid"
              class="w-full py-3.5 px-6 font-semibold text-white bg-gradient-to-r from-teal-500 via-emerald-500 to-teal-600 rounded-xl shadow-lg hover:shadow-xl hover:from-teal-600 hover:via-emerald-600 hover:to-teal-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-105 active:scale-95"
            >
              <span v-if="isLoading" class="flex items-center justify-center gap-2">
                <svg class="w-5 h-5 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Sedang login...
              </span>
              <span v-else>Masuk ke Admin Portal</span>
            </button>
          </form>

          <!-- Divider -->
          <div class="my-8 flex items-center gap-4">
            <div class="flex-1 h-px bg-gradient-to-r from-transparent to-white/20"></div>
            <span class="text-xs text-slate-400 font-medium">Demo</span>
            <div class="flex-1 h-px bg-gradient-to-l from-transparent to-white/20"></div>
          </div>

          <!-- Footer Info -->
          <div class="space-y-3">
            <div class="bg-gradient-to-r from-teal-500/10 to-emerald-500/10 rounded-xl p-4 border border-teal-400/20 backdrop-blur-sm">
              <p class="text-xs font-semibold text-slate-200 mb-3 flex items-center gap-2">
                <span class="inline-flex items-center justify-center w-5 h-5 rounded-full bg-teal-500/30 text-teal-200 text-xs">👤</span>
                Demo Credentials
              </p>
              <div class="space-y-2.5">
                <div class="flex items-center gap-2 text-xs">
                  <span class="text-slate-300 font-medium">Username:</span>
                  <code class="bg-white/5 px-2.5 py-1 rounded text-teal-300 font-semibold border border-teal-400/30">admin</code>
                </div>
                <div class="flex items-center gap-2 text-xs">
                  <span class="text-slate-300 font-medium">Password:</span>
                  <code class="bg-white/5 px-2.5 py-1 rounded text-teal-300 font-semibold border border-teal-400/30">admin123</code>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Card>

      <!-- Security Info -->
      <div class="mt-6 text-center text-xs text-slate-300/80 backdrop-blur-sm">
        <p>🔐 Keamanan: Akun dikunci 30 detik setelah 10x percobaan gagal</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import Card from '../components/ui/Card.vue'

const router = useRouter()
const authStore = useAuthStore()

const form = ref({
  username: '',
  password: ''
})

const showPassword = ref(false)
const isLoading = ref(false)
const errors = ref({
  username: '',
  password: ''
})

const isFormValid = computed(() => {
  return form.value.username.trim().length >= 3 && form.value.password.length >= 6
})

const validateUsername = () => {
  if (!form.value.username.trim()) {
    errors.value.username = 'Username tidak boleh kosong'
  } else if (form.value.username.trim().length < 3) {
    errors.value.username = 'Username minimal 3 karakter'
  } else {
    errors.value.username = ''
  }
}

const validatePassword = () => {
  if (!form.value.password) {
    errors.value.password = 'Password tidak boleh kosong'
  } else if (form.value.password.length < 6) {
    errors.value.password = 'Password minimal 6 karakter'
  } else {
    errors.value.password = ''
  }
}

const handleLogin = async () => {
  validateUsername()
  validatePassword()

  if (!isFormValid.value) {
    return
  }

  isLoading.value = true
  const result = await authStore.login(form.value.username, form.value.password)
  isLoading.value = false

  if (result.success) {
    await router.push({ name: 'dashboard' })
  }
}

onMounted(() => {
  authStore.loadFromStorage()
})
</script>

<style scoped>
@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(-4px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(-2px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.slide-enter-active,
.slide-leave-active {
  transition: all 0.2s ease;
}

.slide-enter-from {
  opacity: 0;
  transform: translateY(-4px);
}

.slide-leave-to {
  opacity: 0;
  transform: translateY(4px);
}

.fade-enter-active,
.fade-leave-active {
  transition: all 0.3s ease;
}

.fade-enter-from {
  opacity: 0;
  transform: translateY(-4px);
}

.fade-leave-to {
  opacity: 0;
  transform: translateY(4px);
}
</style>
