<template>
  <v-app>
    <v-main class="bg-grey-lighten-4">
      <v-container class="py-8">
        <v-card rounded="xl" elevation="0" class="border border-grey-lighten-2">
          <v-card-text class="pa-6" v-if="selectedOutlet">

            <div class="d-flex justify-space-between align-center mb-6">
              <div>
                <h1 class="text-title-large font-weight-bold ma-0">Daftar Diskon</h1>
                <p class="text-title-small text-grey-lighten-1 ma-0">Total Jumlah diskon: {{ filteredDiscounts.length }}
                </p>
              </div>

              <div v-if="selectedIds.length > 0" class="d-flex ga-3">
                <v-btn variant="outlined" color="grey" rounded="lg" size="small" @click="selectedIds = []">
                  Batalkan
                </v-btn>
                <v-btn color="error" rounded="lg" size="small" @click="isDeleteModalOpen = true">
                  <v-icon icon="mdi-delete" start></v-icon>
                  Hapus
                </v-btn>
              </div>

              <v-btn v-else v-if="filteredDiscounts.length > 0" color="success" rounded="xl" class="px-6"
                @click="openModal('tambah')">
                <v-icon icon="mdi-plus" start></v-icon>
                Tambah diskon
              </v-btn>

            </div>

            <div class="d-flex flex-column flex-sm-row ga-4 mb-6">
              <v-text-field v-if="discounts.value?.length > 0" v-model="searchQuery" placeholder="Cari nama diskon..."
                prepend-inner-icon="mdi-magnify" variant="outlined" density="compact" hide-details rounded="xl"
                clearable style="max-width: 300px;"></v-text-field>

              <v-btn variant="outlined" color="grey-lighten-1" rounded="lg" height="44" class="text-none px-4 bg-white"
                elevation="0" @click="isOutletModalOpen = true">
                <div class="d-flex align-center text-grey-darken-3">
                  <v-icon icon="mdi-storefront-outline" size="22" class="mr-3"></v-icon>

                  <span class="text-body-1 font-weight-medium mr-2">
                    {{ selectedOutlet ? selectedOutlet.name : 'Pilih Outlet' }}
                  </span>

                  <v-icon icon="mdi-chevron-down" size="24"></v-icon>
                </div>
              </v-btn>

              <OutletModal v-model="isOutletModalOpen" :outlets="outletList" :selected-outlet-id="selectedOutlet?.id"
                :current-api-url="BASE_API" @select="handleOutletSelection" @apply-url="handleUrlChange"
                @add-outlet="handleAddOutlet" />
            </div>

            <template v-if="discounts.length === 0">
              <div class="d-flex flex-column align-center justify-center py-16">

                <img src="/discount_not_available.svg" alt="Ilustrasi Kosong" width="250" class="mb-6" />

                <span class="text-h6 font-weight-bold mb-2 text-black">
                  Belum Ada Diskon
                </span>

                <p class="text-body-2 text-medium-emphasis text-center mb-6" style="max-width: 350px;">
                  Silahkan tambah diskon untuk menarik pelanggan dan meningkatkan penjualan.
                </p>

                <v-btn color="success" rounded="xl" class="px-6" @click="openModal('tambah')">
                  <v-icon icon="mdi-plus" start></v-icon>
                  Tambah diskon
                </v-btn>

              </div>
            </template>

            <v-data-table v-if="!isLoading && filteredDiscounts.length > 0" v-model="selectedIds" :page="page"
              :headers="headers" :items="filteredDiscounts" :items-per-page="itemsPerPage" item-value="id" show-select
              color="success" return-object :loading="isLoading" loading-text="Sedang memuat data diskon...">
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

          <v-card-text class="pa-6" v-else>

            <div class="d-flex justify-space-between align-center mb-6">
              <h1 class="text-title-large font-weight-bold ma-0">Daftar Diskon</h1>
            </div>

            <div class="d-flex flex-column align-center justify-center py-16">

              <img src="/outlet-notfound.svg" alt="Ilustrasi Pilih Merchant" width="250" class="mb-6" />

              <span class="text-h6 font-weight-bold mb-2 text-black">
                Belum ada Outlet yang dipilih
              </span>

              <p class="text-body-2 text-medium-emphasis text-center mb-6" style="max-width: 350px;">
                Silahkan pilih outlet terlebih dahulu
              </p>

              <v-btn @click="isOutletModalOpen = true" color="success" variant="tonal" rounded="xl" class="px-6">
                Pilih outlet
              </v-btn>

              <OutletModal v-model="isOutletModalOpen" :outlets="outletList" :selected-outlet-id="selectedOutlet?.id"
                :current-api-url="BASE_API" @select="handleOutletSelection" @apply-url="handleUrlChange"
                @add-outlet="handleAddOutlet" />

            </div>
          </v-card-text>
        </v-card>
      </v-container>
    </v-main>

    <DiscountModal v-model="isModalOpen" :form-data="formData" :type="modalType" @confirm="handleSaveOrUpdate"
      @delete="deleteData" />

    <DeleteModal v-model="isDeleteModalOpen" :count="selectedIds.length"
      :item-name="selectedIds.length === 1 ? selectedIds[0].name : ''" @confirm="handleBulkDelete" />

    <v-snackbar v-model="snackbar.show" :color="snackbar.color" timeout="3000" location="top center" rounded="0">
      {{ snackbar.text }}

      <template #actions>
        <v-btn variant="text" icon="mdi-close" density="compact" @click="snackbar.show = false"></v-btn>
      </template>

    </v-snackbar>

  </v-app>
</template>

<script setup>
import { ref, reactive, computed, onMounted, nextTick, watch } from "vue";
import DiscountModal from "./components/DiscountModal.vue";
import DeleteModal from "./components/DeleteModal.vue";
import OutletModal from "./components/OutletModal.vue";
import { storeToRefs } from "pinia";
import { useOutletStore } from "./stores/outletStore";

const BASE_API = import.meta.env.VITE_API_URL.replace(/\/discounts$/, '').replace(/\/merchants$/, '');

const DISCOUNT_API_URL = `${BASE_API}/discounts`;
const OUTLET_API = `${BASE_API}/outlets`;

const isModalOpen = ref(false);
const isDeleteModalOpen = ref(false);
const modalType = ref("");
const selectedIds = ref([]);
const page = ref(1);
const itemsPerPage = ref(3);
const isLoading = ref(false); // State untuk indikator loading
const searchQuery = ref('');

const isOutletModalOpen = ref(false);
const outletStore = useOutletStore()
const { selectedOutlet } = storeToRefs(outletStore)

const outletList = ref([
  { id: 1, name: 'Dapoer Rasa', address: 'Jl. Asia Afrika No. 25' },
  { id: 2, name: 'Espresso Bliss', address: 'Jl. Pemuda No. 78' },
  { id: 3, name: 'Koffeetopia', address: 'Jl. Basuki Rahmat No. 12' },
  { id: 4, name: 'Kopi Anak Bangsa', address: 'Jl. Gatot Subroto No. 33' },
  { id: 5, name: 'Lauk & Co', address: 'Jl. Teuku Umar No. 88' },
  { id: 6, name: 'Ruang Kopi', address: 'Jl. Sudirman No. 45' },
  { id: 7, name: 'Selera Nusantara', address: 'Jl. Malioboro No. 10' },
]);

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

const discounts = ref([]);

const totalPages = computed(() =>
  Math.ceil(filteredDiscounts.value.length / itemsPerPage.value),
);


const fetchDiscounts = async () => {
  isLoading.value = true;
  try {
    const response = await fetch(DISCOUNT_API_URL);
    if (!response.ok) {
      throw new Error("Gagal mengambil data dari server");
    }
    const data = await response.json();

    // Mapping data karena crudcrud menggunakan _id sebagai default ID
    let filteredData = data.map((item) => ({
      ...item,
      id: item._id,
    })).filter((discount) => {
      return selectedOutlet.value ? discount.outlet_id === selectedOutlet.value.id : true;
    });

    discounts.value = filteredData;

  } catch (error) {
    console.error("Error fetching discounts:", error);

  } finally {
    isLoading.value = false;
  }
};

watch(selectedOutlet, () => {
  fetchDiscounts();
  // fetchMerchants();
}, { immediate: true });

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

      const response = await fetch(DISCOUNT_API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: targetData.name,
          value: targetData.value,
          outlet_id: selectedOutlet.value.id
          // Jangan masukkan 'id' di sini karena akan dibuat otomatis oleh crudcrud
        }),
      });


      if (!response.ok) {
        throw new Error("Gagal menambahkan data ke server");
      }

      let newData = await response.json();

      discounts.value = [...discounts.value, {
        id: newData._id,
        name: targetData.name,
        value: targetData.value,
        outlet_id: selectedOutlet.value.id
      }];

    } else if (modalType.value === "ubah") {

      const id = targetData.id;

      if (!id) {
        throw new Error("ID data tidak ditemukan");
      }

      const response = await fetch(`${DISCOUNT_API_URL}/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: targetData.name,
          value: targetData.value,
          outlet_id: selectedOutlet.value.id
          // PENTING: crudcrud akan error jika 'id' atau '_id' disertakan di dalam body PUT
        }),
      });

      const index = discounts.value.findIndex(item => item.id === id);

      // 2. Jika datanya ketemu (index tidak -1), timpa dengan data yang baru
      if (index >= 0) {
        discounts.value[index] = {
          id: id, // ID tetap sama
          name: targetData.name,
          value: targetData.value,
          outlet_id: selectedOutlet.value.id
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
    const response = await fetch(`${DISCOUNT_API_URL}/${payload.id}`, {
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

  isLoading.value = true;
  try {
    // Karena crudcrud tidak punya endpoint hapus massal, kita hapus satu per satu secara paralel
    const deletePromises = selectedIds.value.map(item =>
      fetch(`${DISCOUNT_API_URL}/${item.id}`, { method: 'DELETE' })
    );

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
    isDeleteModalOpen.value = false;
    isLoading.value = false;
  }
};

const filteredDiscounts = computed(() => {
  let result = discounts.value;

  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    result = result.filter(item =>
      item.name && item.name.toLowerCase().includes(query)
    );
  }

  // Filter berdasarkan ID yang dipilih dari dropdown
  if (selectedOutlet.value) {
    result = result.filter(item => item.outlet_id === selectedOutlet.value.id);
  }

  return result;
});

const handleOutletSelection = async (outlet) => {
  selectedOutlet.value = outlet;

};

const handleUrlChange = async (newUrl) => {
  // Bersihkan URL dari slash atau endpoint di belakangnya agar bersih
  const cleanUrl = newUrl.trim().replace(/\/outlets$/, '').replace(/\/discounts$/, '').replace(/\/$/, '');

  API_URL.value = cleanUrl;
  localStorage.setItem('crudcrud_url', cleanUrl); // Simpan ke browser

  snackbar.text = 'API URL berhasil diterapkan!';
  snackbar.color = 'success';
  snackbar.show = true;

  // Langsung tarik data outlet dari API yang baru
  await fetchOutlets();
};

// 2. Fungsi untuk mengambil data Outlet (GET)
const fetchOutlets = async () => {
  if (!API_URL.value) return;

  try {
    const response = await fetch(OUTLET_API);
    if (!response.ok) throw new Error("Gagal mengambil data outlet");

    const data = await response.json();
    outletList.value = data.map(item => ({
      id: item._id,
      name: item.name,
      address: item.address || '-'
    }));
  } catch (error) {
    console.error("Error fetching outlets:", error);
    outletList.value = []; // Kosongkan jika URL salah/expired
  }
};

// 3. Fungsi saat tombol "Tambah Outlet ke API" diklik
const handleAddOutlet = async (outletName) => {
  if (!BASE_API) {
    snackbar.text = 'Silahkan masukkan API URL terlebih dahulu!';
    snackbar.color = 'error';
    snackbar.show = true;
    return;
  }

  try {
    // Hit ke API crudcrud
    const response = await fetch(OUTLET_API, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: outletName,
        address: 'Alamat belum diatur' // Nilai default
      })
    });

    if (!response.ok) throw new Error("Gagal membuat outlet");

    const newData = await response.json();

    const newOutlet = {
      id: newData._id,
      name: newData.name,
      address: newData.address
    };

    // Masukkan ke daftar lokal agar langsung muncul
    outletList.value.push(newOutlet);

    // Otomatis jadikan outlet ini sebagai yang terpilih
    selectedOutlet.value = newOutlet;
    isOutletModalOpen.value = false; // Tutup modal

    snackbar.text = `Outlet "${newOutlet.name}" berhasil dibuat!`;
    snackbar.color = 'success';
    snackbar.show = true;

  } catch (error) {
    console.error("Error adding outlet:", error);
    snackbar.text = 'Terjadi kesalahan saat menambah outlet';
    snackbar.color = 'error';
    snackbar.show = true;
  }
};

</script>
