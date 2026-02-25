import { defineStore } from 'pinia'
import api from '../lib/http'

const INACTIVITY_TIMEOUT = 30 * 60 * 1000 // 30 minutes
const WARNING_TIME = 5 * 60 * 1000 // 5 minutes before timeout
let inactivityTimer = null
let warningTimer = null

export const useAuthStore = defineStore('auth', {
  state: () => ({
    token: null,
    user: null,
    isLoading: false,
    error: null,
    failedAttempts: 0,
    cooldownUntil: null,
    lastActivityTime: null,
    showInactivityWarning: false,
    inactivityWarningSeconds: 0
  }),
  getters: {
    isAuthenticated: (state) => !!state.token,
    isAdmin: (state) => !!(state.user && state.user.role === 'admin'),
    isCashier: (state) => !!(state.user && state.user.role === 'cashier'),
    isCooldown: (state) => state.cooldownUntil !== null && new Date() < state.cooldownUntil,
    cooldownSeconds: (state) => {
      if (!state.cooldownUntil) return 0
      const remaining = Math.ceil((state.cooldownUntil - new Date()) / 1000)
      return Math.max(0, remaining)
    }
  },
  actions: {
    loadFromStorage() {
      const token = localStorage.getItem('auth_token')
      const user = localStorage.getItem('auth_user')
      const failedAttempts = localStorage.getItem('auth_failed_attempts')
      const cooldownUntil = localStorage.getItem('auth_cooldown_until')
      
      if (token && user) {
        this.token = token
        this.user = JSON.parse(user)
        this.lastActivityTime = Date.now()
        this.startInactivityTimer()
      }
      
      if (failedAttempts) {
        this.failedAttempts = parseInt(failedAttempts, 10)
      }
      
      if (cooldownUntil) {
        const cooldownTime = new Date(cooldownUntil)
        if (cooldownTime > new Date()) {
          this.cooldownUntil = cooldownTime
        } else {
          this.clearCooldown()
        }
      }
    },
    clearCooldown() {
      this.cooldownUntil = null
      localStorage.removeItem('auth_cooldown_until')
    },
    incrementFailedAttempts() {
      this.failedAttempts++
      localStorage.setItem('auth_failed_attempts', this.failedAttempts.toString())
      
      if (this.failedAttempts >= 10) {
        const cooldownTime = new Date(Date.now() + 30000)
        this.cooldownUntil = cooldownTime
        localStorage.setItem('auth_cooldown_until', cooldownTime.toISOString())
      }
    },
    resetFailedAttempts() {
      this.failedAttempts = 0
      localStorage.removeItem('auth_failed_attempts')
    },
    updateActivityTime() {
      if (!this.isAuthenticated) return
      
      this.lastActivityTime = Date.now()
      this.showInactivityWarning = false
      
      // Reset timers
      this.startInactivityTimer()
    },
    startInactivityTimer() {
      // Clear existing timers
      if (inactivityTimer) clearTimeout(inactivityTimer)
      if (warningTimer) clearTimeout(warningTimer)
      
      // Set warning timer (5 minutes before logout)
      warningTimer = setTimeout(() => {
        if (this.isAuthenticated) {
          this.showInactivityWarning = true
          this.startWarningCountdown()
        }
      }, INACTIVITY_TIMEOUT - WARNING_TIME)
      
      // Set logout timer
      inactivityTimer = setTimeout(() => {
        if (this.isAuthenticated) {
          this.logoutDueToInactivity()
        }
      }, INACTIVITY_TIMEOUT)
    },
    startWarningCountdown() {
      let remainingSeconds = Math.ceil(WARNING_TIME / 1000)
      
      const countdownInterval = setInterval(() => {
        remainingSeconds--
        this.inactivityWarningSeconds = remainingSeconds
        
        if (remainingSeconds <= 0) {
          clearInterval(countdownInterval)
        }
      }, 1000)
    },
    logoutDueToInactivity() {
      this.logout()
      this.error = 'Sesi Anda telah berakhir karena tidak aktif selama 30 menit. Silakan login kembali.'
    },
    stopInactivityTimer() {
      if (inactivityTimer) clearTimeout(inactivityTimer)
      if (warningTimer) clearTimeout(warningTimer)
      this.showInactivityWarning = false
      this.inactivityWarningSeconds = 0
    },
    async login(username, password) {
      if (this.isCooldown) {
        return {
          success: false,
          error: `Terlalu banyak percobaan gagal. Coba lagi dalam ${this.cooldownSeconds} detik.`,
          cooldown: true
        }
      }

      this.isLoading = true
      this.error = null
      try {
        const response = await api.post('/auth/login', { username, password })
        const { token, user } = response.data.data

        this.token = token
        this.user = user
        this.lastActivityTime = Date.now()
        
        localStorage.setItem('auth_token', token)
        localStorage.setItem('auth_user', JSON.stringify(user))
        
        this.resetFailedAttempts()
        this.clearCooldown()
        this.startInactivityTimer()
        
        return { success: true }
      } catch (err) {
        this.incrementFailedAttempts()
        const isCooldown = this.failedAttempts >= 10
        
        let errorMsg = err.userMessage || 'Login gagal'
        if (isCooldown) {
          errorMsg = `Username atau password salah. (${this.failedAttempts}/10) Akun dikunci selama 30 detik.`
        } else if (this.failedAttempts >= 5) {
          errorMsg = `Username atau password salah. (${this.failedAttempts}/10)`
        }
        
        this.error = errorMsg
        return { 
          success: false, 
          error: errorMsg,
          cooldown: isCooldown,
          remainingAttempts: 10 - this.failedAttempts
        }
      } finally {
        this.isLoading = false
      }
    },
    logout() {
      this.token = null
      this.user = null
      this.lastActivityTime = null
      this.error = null
      this.stopInactivityTimer()
      localStorage.removeItem('auth_token')
      localStorage.removeItem('auth_user')
    }
  }
})
