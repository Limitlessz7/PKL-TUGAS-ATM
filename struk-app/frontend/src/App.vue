<template>
  <div class="min-h-screen">
    <AppShell />
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useAuthStore } from './stores/auth'
import AppShell from './components/layout/AppShell.vue'

const authStore = useAuthStore()

onMounted(() => {
  authStore.loadFromStorage()
})
</script>

<style scoped>
</style>
