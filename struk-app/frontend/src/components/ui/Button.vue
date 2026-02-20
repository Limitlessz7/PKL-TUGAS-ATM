<template>
  <button
    :type="type"
    :disabled="disabled"
    class="inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2 text-sm font-medium ring-1 ring-white/10 bg-white/10 hover:bg-white/15 active:bg-white/20 transition disabled:opacity-50 disabled:cursor-not-allowed"
    :class="variantClass"
  >
    <slot />
  </button>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  type: { type: String, default: 'button' },
  disabled: { type: Boolean, default: false },
  variant: { type: String, default: 'primary' } // primary | ghost | danger
})

const variantClass = computed(() => {
  if (props.variant === 'ghost') return 'bg-transparent hover:bg-white/10'
  if (props.variant === 'danger') return 'bg-rose-500/20 hover:bg-rose-500/25 ring-rose-300/20'
  return 'bg-white/10 hover:bg-white/15'
})
</script>

<style scoped></style>
