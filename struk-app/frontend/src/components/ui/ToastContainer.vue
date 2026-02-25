<template>
  <div class="fixed top-4 right-4 z-50 flex flex-col gap-3">
    <div v-for="t in toasts" :key="t.id" :class="['max-w-sm px-4 py-2 rounded shadow-lg text-sm flex items-start gap-3', typeClass(t.type)]">
      <div class="flex-1">
        <div class="font-medium">{{ titleFor(t.type) }}</div>
        <div class="text-xs opacity-90">{{ t.message }}</div>
      </div>
      <button @click="remove(t.id)" class="text-xs opacity-80">✕</button>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useUiStore } from '../../stores/ui'

const ui = useUiStore()
const toasts = computed(() => ui.toasts)

const remove = (id) => ui.remove(id)

const typeClass = (type) => {
  if (type === 'success') return 'bg-emerald-700/90 text-white'
  if (type === 'warning') return 'bg-yellow-600/95 text-black'
  if (type === 'error') return 'bg-red-600/95 text-white'
  return 'bg-slate-800/90 text-white'
}

const titleFor = (type) => {
  if (type === 'success') return 'Sukses'
  if (type === 'warning') return 'Perhatian'
  if (type === 'error') return 'Gagal'
  return 'Info'
}
</script>

<style scoped>
.max-w-sm { width: 20rem; }
</style>
