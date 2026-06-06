<template>
  <v-app>
    <v-main class="bg-grey-lighten-4">
      <v-container class="py-8">
        <v-card rounded="xl" elevation="1" class="border border-grey-lighten-2">
          <v-card-text class="pa-6">

            <div class="d-flex justify-space-between align-center mb-6">
              <span class="text-title-large font-weight-bold">Daftar Diskon</span>
              <v-btn color="success" rounded="lg" size="small" @click="openModal('tambah')">
                <v-icon icon="mdi-plus"></v-icon>
                Tambah diskon
              </v-btn>
            </div>

            <v-data-table v-model="selectedIds" :page="page" :headers="headers" :items="discounts"
              :items-per-page="itemsPerPage" item-value="id" show-select color="success" return-object>
              <template #item.actions="{ item }">
                <v-btn icon="mdi-pencil-outline" variant="plain" density="compact" color="grey"
                  @click="openModal('ubah', item)" />
              </template>

              <template #bottom>
                <div class="d-flex align-center justify-space-between px-4 py-3 border-t">
                  <div class="d-flex align-center gap-2">
                    <span class="text-body-2 text-medium-emphasis">Baris per halaman:</span>
                    <v-select v-model="itemsPerPage" :items="[3, 5, 10, 15]" density="compact" variant="outlined"
                      rounded="lg" hide-details style="width: 80px;" />
                  </div>

                  <v-pagination v-model="page" :length="totalPages" :total-visible="5" active-color="success"
                    rounded="circle" density="comfortable" />
                </div>
              </template>
            </v-data-table>

          </v-card-text>
        </v-card>
      </v-container>
    </v-main>

    <DiscountModal v-model="isModalOpen" :type="modalType" @confirm="handleSaveOrDelete" />
  </v-app>
</template>

<script setup>
import { ref, reactive, computed } from 'vue';
import DiscountModal from './components/DiscountModal.vue';

const isModalOpen = ref(false);
const modalType = ref('');
const selectedIds = ref([]);
const page = ref(1);
const itemsPerPage = ref(3);

const headers = [
  { title: 'Nama Diskon', key: 'name', align: 'start' },
  { title: 'Nilai Diskon', key: 'value', align: 'start' },
  { title: '', key: 'actions', align: 'end', sortable: false },
];

const discounts = ref([
  { id: 1, name: 'Burger Hemat', value: 'Rp 10.000' },
  { id: 2, name: 'Cheese Lover', value: 'Rp 8.000' },
  { id: 3, name: 'Diskon Opening', value: '10%' },
  { id: 4, name: 'Happy Hour', value: '15%' },
  { id: 5, name: 'Member Setia', value: 'Rp 5.000' },
  { id: 6, name: 'Promo Weekend', value: '20%' },
  { id: 7, name: 'Diskon Akhir Tahun1', value: '25%' },
  { id: 8, name: 'Diskon Akhir Tahun2', value: '25%' },
  { id: 9, name: 'Diskon Akhir Tahun3', value: '25%' },
  { id: 10, name: 'Diskon Akhir Tahun4', value: '25%' },
  { id: 11, name: 'Diskon Akhir Tahun5', value: '25%' },
  { id: 12, name: 'Diskon Akhir Tahun6', value: '25%' },
  { id: 13, name: 'Diskon Akhir Tahun7', value: '25%' },
  { id: 14, name: 'Diskon Akhir Tahun8', value: '25%' },
  { id: 15, name: 'Diskon Akhir Tahun9', value: '25%' },
  { id: 16, name: 'Diskon Akhir Tahun10', value: '25%' },
]);

const totalPages = computed(() => Math.ceil(discounts.value.length / itemsPerPage.value));

const formData = reactive({ id: null, name: '', value: '', type: '%' });

const openModal = (type, item = null) => {
  modalType.value = type;
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