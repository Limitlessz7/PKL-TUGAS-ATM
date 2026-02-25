import { defineStore } from 'pinia'

export const useUiStore = defineStore('ui', {
  state: () => ({
    toasts: []
  }),
  actions: {
    push(message, type = 'info', timeout = 4000) {
      const id = Date.now() + Math.floor(Math.random() * 1000)
      this.toasts.push({ id, message, type })
      setTimeout(() => {
        this.toasts = this.toasts.filter(t => t.id !== id)
      }, timeout)
      return id
    },
    remove(id) {
      this.toasts = this.toasts.filter(t => t.id !== id)
    }
  }
})
