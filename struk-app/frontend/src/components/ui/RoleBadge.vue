<template>
  <span :class="badgeClass" class="px-2 py-0.5 rounded-full text-xs font-semibold">{{ label }}</span>
</template>

<script setup>
import { computed } from 'vue'
const props = defineProps({ role: { type: String, default: 'cashier' } })

const label = computed(() => {
  if (!props.role) return 'user'
  return props.role === 'admin' ? 'Admin' : 'Kasir'
})

const badgeClass = computed(() => {
  return props.role === 'admin'
    ? 'bg-red-500/20 text-red-300 ring-1 ring-red-400/10'
    : 'bg-emerald-500/20 text-emerald-300 ring-1 ring-emerald-400/10'
})
</script>
