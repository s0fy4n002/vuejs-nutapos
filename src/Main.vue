<template>
  <div class="p-8 bg-gray-50 min-h-screen">
    <div class="max-w-4xl mx-auto bg-white p-6 rounded-xl shadow-sm border border-gray-100">
      <div class="flex justify-between items-center mb-6">
        <h2 class="text-xl font-bold">Daftar Diskon</h2>
        <button @click="openModal('tambah')"
          class="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium text-sm transition">
          + Tambah diskon
        </button>
      </div>

      <table class="w-full text-sm">
        <thead class="border-b">
          <tr class="text-gray-500">
            <th class="text-left py-3 font-medium">Nama Diskon</th>
            <th class="text-left py-3 font-medium">Nilai Diskon</th>
            <th class="text-right py-3 font-medium"></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in discounts" :key="item.id" class="border-b hover:bg-gray-50">
            <td class="py-4">{{ item.name }}</td>
            <td class="py-4">{{ item.value }}</td>
            <td class="py-4 text-right">
              <button @click="openModal('ubah', item)" class="text-gray-400 hover:text-green-600 transition cursor-pointer">
                <PencilLine size="16" />
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <DiscountModal v-if="isModalOpen" :type="modalType" @close="isModalOpen = false" @confirm="handleSaveOrDelete" />

  </div>
</template>

<script setup>
import { PencilLine } from '@lucide/vue';
import { ref, reactive } from 'vue';
import DiscountModal from './components/DiscountModal.vue';

const isModalOpen = ref(false);
const modalType = ref('');
const showError = ref(false);


const discounts = ref([
  { id: 1, name: 'Burger Hemat', value: 'Rp 10.000' },
  { id: 2, name: 'Cheese Lover', value: 'Rp 8.000' }
]);

const formData = reactive({ id: null, name: '', value: '', type: '%' });

const openModal = (type, item = null) => {
  modalType.value = type;
  showError.value = false;
  if (item) {
    Object.assign(formData, item);
  } else {
    Object.assign(formData, { id: null, name: '', value: '', type: '%' });
  }
  isModalOpen.value = true;
};

const handleSaveOrDelete = () => {
  if (modalType.value === 'hapus') {
    // Logika hapus
  } else {
    // Logika simpan
  }
  isModalOpen.value = false;
};

</script>