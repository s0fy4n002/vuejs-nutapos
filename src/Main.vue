<template>
  <v-app>
    <v-main class="bg-grey-lighten-4">
      <v-container class="py-8">
        <v-card rounded="xl" elevation="0" class="border border-grey-lighten-2">
          <v-card-text class="pa-6">
            <div class="d-flex justify-space-between align-center mb-6">
              <div>
                <h1 class="text-title-large font-weight-bold ma-0">Daftar Diskon</h1>
                <p class="text-title-small text-grey-lighten-1 ma-0">Total Jumlah diskon: {{ discounts.length }}</p>
              </div>

              <div v-if="selectedIds.length > 0" class="d-flex ga-3">
                <v-btn variant="outlined" color="grey" rounded="lg" size="small" @click="selectedIds = []">
                  Batalkan
                </v-btn>
                <v-btn color="error" rounded="lg" size="small" @click="handleBulkDelete">
                  <v-icon icon="mdi-delete" start></v-icon>
                  Hapus
                </v-btn>
              </div>

              <v-btn v-else color="success" rounded="xl" size="small" class="pa-4" @click="openModal('tambah')">
                <v-icon icon="mdi-plus" start></v-icon>
                Tambah diskon
              </v-btn>

            </div>

            <v-data-table v-model="selectedIds" :page="page" :headers="headers" :items="discounts"
              :items-per-page="itemsPerPage" item-value="id" show-select color="success" return-object
              :loading="isLoading" loading-text="Sedang memuat data diskon...">
              <template #item.actions="{ item }">
                <v-btn icon="mdi-pencil-outline" variant="plain" density="compact" color="grey"
                  @click="openModal('ubah', item)" />
              </template>

              <template #bottom>
                <div class="d-flex align-center justify-space-between px-4 py-3 border-t">
                  <div class="d-flex align-center ga-2">
                    <span class="text-body-2 text-medium-emphasis">Baris per halaman:</span>
                    <v-select v-model="itemsPerPage" :items="[3, 5, 10, 15]" density="compact" variant="outlined"
                      rounded="lg" hide-details style="width: fit-content" />
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

    <DiscountModal v-model="isModalOpen" :form-data="formData" :type="modalType" @confirm="handleSaveOrUpdate"
      @delete="deleteData" />

    <v-snackbar v-model="snackbar.show" :color="snackbar.color" timeout="3000" location="top center" rounded="0">
      {{ snackbar.text }}

      <template #actions>
        <v-btn variant="text" icon="mdi-close" density="compact" @click="snackbar.show = false"></v-btn>
      </template>

    </v-snackbar>

  </v-app>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from "vue";
import DiscountModal from "./components/DiscountModal.vue";

const API_URL =
  "https://crudcrud.com/api/eccc8c0fbe1c411d9a0d6628fd382a11/discounts";

const isModalOpen = ref(false);
const modalType = ref("");
const selectedIds = ref([]);
const page = ref(1);
const itemsPerPage = ref(3);
const isLoading = ref(false); // State untuk indikator loading

const formData = reactive({ id: null, name: "", value: "", type: "%" });
const snackbar = reactive({
  show: false,
  text: '',
  color: 'success'
});

const headers = [
  { title: "Nama Diskon", key: "name", align: "start" },
  { title: "Nilai Diskon", key: "value", align: "start" },
  { title: "", key: "actions", align: "end", sortable: false },
];

// const discounts = ref([
//   { id: 1, name: 'Burger Hemat', value: 'Rp 10.000' },
//   { id: 2, name: 'Cheese Lover', value: 'Rp 8.000' },
//   { id: 3, name: 'Diskon Opening', value: '10%' }
// ]);

// Kosongkan array awal
const discounts = ref([]);


const totalPages = computed(() =>
  Math.ceil(discounts.value.length / itemsPerPage.value),
);

// Fungsi untuk mengambil data dari crudcrud
const fetchDiscounts = async () => {
  isLoading.value = true;
  try {
    const response = await fetch(API_URL);
    if (!response.ok) {
      throw new Error("Gagal mengambil data dari server");
    }
    const data = await response.json();

    // Mapping data karena crudcrud menggunakan _id sebagai default ID
    discounts.value = data.map((item) => ({
      ...item,
      id: item._id,
    }));
  } catch (error) {
    console.error("Error fetching discounts:", error);
    // Anda bisa tambahkan notifikasi error di sini nanti
  } finally {
    isLoading.value = false;
  }
};

// Panggil fetchDiscounts saat komponen di-mount
onMounted(() => {
  fetchDiscounts();
});

const openModal = (type, item = null) => {
  modalType.value = type;
  if (item) {
    Object.assign(formData, item);
  } else {
    Object.assign(formData, { id: null, name: "", value: "", type: "%" });
  }
  isModalOpen.value = true;
};

const handleSaveOrUpdate = async (payload) => {
  
  const targetData = payload || formData;

  isLoading.value = true;
  try {
    if (modalType.value === "tambah") {
      // ==========================================
      // 1. LOGIKA TAMBAH DATA (POST)
      // ==========================================
      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: targetData.name,
          value: targetData.value,
          // Jangan masukkan 'id' di sini karena akan dibuat otomatis oleh crudcrud
        }),
      });


      if (!response.ok) {
        throw new Error("Gagal menambahkan data ke server");
      }

      let newData = await response.json();
      discounts.value.push({
        id: newData._id, // Ambil ID yang dibuat oleh crudcrud
        name: targetData.name,
        value: targetData.value,
      });

    } else if (modalType.value === "ubah") {

      const id = targetData.id;

      if (!id) {
        throw new Error("ID data tidak ditemukan");
      }

      const response = await fetch(`${API_URL}/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: targetData.name,
          value: targetData.value,
          // PENTING: crudcrud akan error jika 'id' atau '_id' disertakan di dalam body PUT
        }),
      });

      const index = discounts.value.findIndex(item => item.id === id);

      // 2. Jika datanya ketemu (index tidak -1), timpa dengan data yang baru
      if (index >= 0 ) {
        discounts.value[index] = {
          id: id, // ID tetap sama
          name: targetData.name,
          value: targetData.value,
        };
      }

      if (!response.ok) {
        throw new Error("Gagal mengubah data di server");
      }
    }

    // Jika proses API berhasil, tutup modal dan perbarui data di tabel
    isModalOpen.value = false;

  } catch (error) {
    console.error("Terjadi kesalahan:", error);
    // Anda bisa memunculkan snackbar/alert error di sini jika ada
  } finally {
    isLoading.value = false;
  }
};

const deleteData = async (payload) => {
  console.log('ID yang ditangkap parent:', payload.id);


  if (!payload.id) return;

  isLoading.value = true;
  try {
    const response = await fetch(`${API_URL}/${payload.id}`, {
      method: 'DELETE'
    });

    if (!response.ok) {
      throw new Error('Gagal menghapus data di server');
    }

    // Jika berhasil dihapus, tutup modal dan ambil ulang data terbaru
    isModalOpen.value = false;

    snackbar.text = `Berhasil Hapus diskon ${payload.name}`;
    snackbar.color = 'success';
    snackbar.show = true;

    await fetchDiscounts();

  } catch (error) {
    snackbar.text = 'Gagal menghapus diskon';
    snackbar.color = 'error';
    snackbar.show = true;

    console.error('Terjadi kesalahan saat menghapus:', error);
  } finally {
    isLoading.value = false;
  }
};

// Fungsi untuk menghapus banyak data sekaligus (Bulk Delete)
const handleBulkDelete = async () => {
  // Gunakan konfirmasi bawaan browser agar lebih praktis
  const konfirmasi = window.confirm(
    `Apakah Anda yakin ingin menghapus ${selectedIds.value.length} diskon yang dipilih?`
  );

  if (!konfirmasi) return;

  isLoading.value = true;
  try {
    // Karena crudcrud tidak punya endpoint hapus massal, kita hapus satu per satu secara paralel
    const deletePromises = selectedIds.value.map(item =>
      fetch(`${API_URL}/${item.id}`, { method: 'DELETE' })
    );

    // Tunggu semua proses hapus selesai
    const responses = await Promise.all(deletePromises);

    // Cek apakah ada request yang gagal
    const hasError = responses.some(res => !res.ok);
    if (hasError) {
      throw new Error("Beberapa data mungkin gagal dihapus");
    }

    // Tampilkan notifikasi
    snackbar.text = `Berhasil menghapus ${selectedIds.value.length} diskon`;
    snackbar.color = 'success';
    snackbar.show = true;

    // Kosongkan centang dan refresh tabel
    selectedIds.value = [];
    await fetchDiscounts();

  } catch (error) {
    console.error("Gagal menghapus data massal:", error);
    snackbar.text = 'Gagal menghapus beberapa diskon';
    snackbar.color = 'error';
    snackbar.show = true;
  } finally {
    isLoading.value = false;
  }
};

</script>
