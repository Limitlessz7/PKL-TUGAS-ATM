<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-3xl font-bold text-slate-100">Transaksi Terhapus</h1>
        <p class="text-slate-400 text-sm mt-1">Kelola transaksi yang telah dihapus</p>
      </div>
      <RouterLink to="/" class="px-4 py-2 rounded-lg text-sm font-medium bg-slate-700/50 hover:bg-slate-700 text-slate-200 transition">
        Kembali
      </RouterLink>
    </div>

    <!-- Deleted Transactions List -->
    <Card class="support-overflow">
      <div v-if="isLoading" class="p-8 text-center">
        <div class="inline-flex items-center gap-2">
          <svg class="w-5 h-5 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 2v20m10-10H2"></path>
          </svg>
          <span class="text-slate-400">Loading...</span>
        </div>
      </div>

      <div v-else-if="deletedTransactions.length === 0" class="p-8 text-center">
        <div class="inline-flex items-center justify-center w-16 h-16 rounded-full bg-emerald-500/10 mb-4">
          <svg class="w-8 h-8 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
          </svg>
        </div>
        <p class="text-slate-400">Tidak ada transaksi yang terhapus</p>
      </div>

      <div v-else class="overflow-x-auto">
        <table class="w-full">
          <thead>
            <tr class="border-b border-white/10">
              <th class="text-left px-4 py-3 text-xs font-semibold text-slate-300">Kode</th>
              <th class="text-left px-4 py-3 text-xs font-semibold text-slate-300">Pasien</th>
              <th class="text-left px-4 py-3 text-xs font-semibold text-slate-300">Unit</th>
              <th class="text-right px-4 py-3 text-xs font-semibold text-slate-300">Total</th>
              <th class="text-center px-4 py-3 text-xs font-semibold text-slate-300">Dihapus</th>
              <th class="text-center px-4 py-3 text-xs font-semibold text-slate-300">Aksi</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="trx in deletedTransactions" :key="trx.id" class="border-b border-white/5 hover:bg-white/5 transition">
              <td class="px-4 py-3 text-sm text-slate-100 font-mono">{{ trx.code }}</td>
              <td class="px-4 py-3 text-sm text-slate-300">{{ trx.patientName || '-' }}</td>
              <td class="px-4 py-3 text-sm text-slate-300">{{ trx.unit || '-' }}</td>
              <td class="px-4 py-3 text-sm text-right text-emerald-400 font-semibold">Rp {{ formatCurrency(trx.total) }}</td>
              <td class="px-4 py-3 text-center text-xs text-slate-400">{{ formatDate(trx.deletedAt) }}</td>
              <td class="px-4 py-3 text-center">
                <div class="flex gap-2 justify-center">
                  <button
                    @click="viewTransaction(trx)"
                    class="px-3 py-1.5 text-xs font-medium text-blue-300 hover:text-blue-200 bg-blue-500/10 hover:bg-blue-500/20 rounded transition"
                    title="Lihat Detail"
                  >
                    👁️
                  </button>
                  <button
                    @click="restoreTransaction(trx.id)"
                    :disabled="loadingRestore === trx.id"
                    class="px-3 py-1.5 text-xs font-medium text-emerald-300 hover:text-emerald-200 bg-emerald-500/10 hover:bg-emerald-500/20 rounded transition disabled:opacity-50"
                    title="Pulihkan"
                  >
                    {{ loadingRestore === trx.id ? '⏳' : '↩️' }}
                  </button>
                  <button
                    @click="permanentDelete(trx.id)"
                    :disabled="loadingDelete === trx.id"
                    class="px-3 py-1.5 text-xs font-medium text-red-300 hover:text-red-200 bg-red-500/10 hover:bg-red-500/20 rounded transition disabled:opacity-50"
                    title="Hapus Permanen"
                  >
                    {{ loadingDelete === trx.id ? '⏳' : '🗑️' }}
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </Card>

    <!-- Transaction Detail Modal -->
    <transition name="fade-modal">
      <div v-if="selectedTransaction" class="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <Card class="max-w-2xl w-full max-h-[80vh] overflow-y-auto">
          <div class="p-6 space-y-4">
            <div class="flex items-center justify-between mb-4">
              <h3 class="text-xl font-bold text-slate-100">Detail Transaksi</h3>
              <button @click="selectedTransaction = null" class="text-slate-400 hover:text-slate-200">
                ✕
              </button>
            </div>

            <div class="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p class="text-slate-400">Kode</p>
                <p class="text-slate-100 font-mono font-semibold">{{ selectedTransaction.code }}</p>
              </div>
              <div>
                <p class="text-slate-400">Status</p>
                <p class="text-red-400 font-semibold">Terhapus</p>
              </div>
              <div>
                <p class="text-slate-400">Nama Pasien</p>
                <p class="text-slate-100">{{ selectedTransaction.patientName || '-' }}</p>
              </div>
              <div>
                <p class="text-slate-400">Unit</p>
                <p class="text-slate-100">{{ selectedTransaction.unit || '-' }}</p>
              </div>
              <div>
                <p class="text-slate-400">Metode Pembayaran</p>
                <p class="text-slate-100">{{ selectedTransaction.paymentMethod }}</p>
              </div>
              <div>
                <p class="text-slate-400">Tanggal Dibuat</p>
                <p class="text-slate-100">{{ formatDate(selectedTransaction.createdAt) }}</p>
              </div>
            </div>

            <div class="border-t border-white/10 pt-4">
              <h4 class="text-sm font-semibold text-slate-200 mb-3">Item Transaksi</h4>
              <div class="space-y-2">
                <div v-for="item in selectedTransaction.items" :key="item.id" class="flex justify-between text-sm p-2 bg-white/5 rounded">
                  <div>
                    <p class="text-slate-200">{{ item.name }}</p>
                    <p class="text-xs text-slate-400">{{ item.qty }} x Rp {{ formatCurrency(item.price) }}</p>
                  </div>
                  <p class="text-slate-100 font-semibold">Rp {{ formatCurrency(item.qty * item.price) }}</p>
                </div>
              </div>
            </div>

            <div class="border-t border-white/10 pt-4 space-y-2 text-sm">
              <div class="flex justify-between">
                <span class="text-slate-400">Subtotal</span>
                <span class="text-slate-100">Rp {{ formatCurrency(selectedTransaction.subtotal) }}</span>
              </div>
              <div v-if="selectedTransaction.discount > 0" class="flex justify-between">
                <span class="text-slate-400">Diskon</span>
                <span class="text-slate-100">-Rp {{ formatCurrency(selectedTransaction.discount) }}</span>
              </div>
              <div v-if="selectedTransaction.tax > 0" class="flex justify-between">
                <span class="text-slate-400">Pajak</span>
                <span class="text-slate-100">+Rp {{ formatCurrency(selectedTransaction.tax) }}</span>
              </div>
              <div class="flex justify-between font-semibold text-base border-t border-white/10 pt-2">
                <span class="text-slate-200">Total</span>
                <span class="text-emerald-400">Rp {{ formatCurrency(selectedTransaction.total) }}</span>
              </div>
            </div>

            <div class="flex gap-2 pt-4">
              <button
                @click="selectedTransaction = null"
                class="flex-1 px-4 py-2 text-sm font-semibold text-slate-200 bg-slate-700/50 hover:bg-slate-700 rounded-lg transition"
              >
                Tutup
              </button>
              <button
                @click="restoreTransaction(selectedTransaction.id)"
                :disabled="loadingRestore === selectedTransaction.id"
                class="flex-1 px-4 py-2 text-sm font-semibold text-white bg-emerald-500 hover:bg-emerald-600 rounded-lg transition disabled:opacity-50"
              >
                {{ loadingRestore === selectedTransaction.id ? 'Memulihkan...' : 'Pulihkan Transaksi' }}
              </button>
            </div>
          </div>
        </Card>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import api from '../lib/http'
import Card from '../components/ui/Card.vue'

const router = useRouter()
const deletedTransactions = ref([])
const selectedTransaction = ref(null)
const isLoading = ref(false)
const loadingRestore = ref(null)
const loadingDelete = ref(null)

const formatCurrency = (value) => {
  return new Intl.NumberFormat('id-ID').format(value)
}

const formatDate = (date) => {
  return new Date(date).toLocaleDateString('id-ID', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const loadDeletedTransactions = async () => {
  isLoading.value = true
  try {
    const response = await api.get('/transactions/deleted')
    deletedTransactions.value = response.data.data
  } catch (error) {
    alert('Error loading deleted transactions: ' + error.userMessage)
  } finally {
    isLoading.value = false
  }
}

const viewTransaction = (trx) => {
  selectedTransaction.value = trx
}

const restoreTransaction = async (id) => {
  if (!confirm('Pulihkan transaksi ini?')) return

  loadingRestore.value = id
  try {
    const response = await api.put(`/transactions/${id}/restore`)
    alert('Transaksi berhasil dipulihkan!')
    selectedTransaction.value = null
    await loadDeletedTransactions()
  } catch (error) {
    alert('Error: ' + error.userMessage)
  } finally {
    loadingRestore.value = null
  }
}

const permanentDelete = async (id) => {
  if (!confirm('Hapus permanen transaksi ini? Data tidak dapat dikembalikan!')) return

  loadingDelete.value = id
  try {
    await api.delete(`/transactions/${id}/permanent`)
    alert('Transaksi dihapus permanen!')
    await loadDeletedTransactions()
  } catch (error) {
    alert('Error: ' + error.userMessage)
  } finally {
    loadingDelete.value = null
  }
}

onMounted(() => {
  loadDeletedTransactions()
})
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
