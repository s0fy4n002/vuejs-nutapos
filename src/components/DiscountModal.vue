<script setup>
import { ref, watch } from 'vue';

// Tambahkan prop 'formData' untuk menerima data saat mode 'ubah'
const props = defineProps({
    type: String,
    modelValue: Boolean,
    formData: Object // Menerima data dari parent
});

const emit = defineEmits(['update:modelValue', 'confirm', 'delete']);

const discountType = ref('%');
const namaDiskon = ref('');
const nilaiDiskon = ref(null);

// Gunakan watch untuk mengisi form otomatis saat modal dibuka
watch(() => props.modelValue, (isOpen) => {
    if (isOpen) {
        if (props.type === 'ubah' && props.formData) {
            namaDiskon.value = props.formData.name;

            // Logika untuk memecah string (misal "Rp 10.000" atau "10%")
            const valStr = props.formData.value || '';
            if (valStr.includes('%')) {
                discountType.value = '%';
                nilaiDiskon.value = valStr.replace('%', '').trim();
            } else if (valStr.toLowerCase().includes('rp')) {
                discountType.value = 'Rp';
                // Mengambil angkanya saja dari format Rp 10.000
                nilaiDiskon.value = valStr.replace(/[^0-9]/g, '');
            }
        } else {
            // Reset form jika mode 'tambah'
            namaDiskon.value = '';
            nilaiDiskon.value = null;
            discountType.value = '%';
        }
    }
});

const close = () => emit('update:modelValue', false);

const handleSimpan = () => {
    // Format nilai angka menjadi string sesuai pilihan jenis diskon
    let finalValue = '';
    if (discountType.value === '%') {
        finalValue = `${nilaiDiskon.value}%`;
    } else {
        // Ubah angka menjadi format Rp 10.000
        const num = Number(nilaiDiskon.value) || 0;
        // Menggunakan format lokal Indonesia
        finalValue = `Rp ${num.toLocaleString('id-ID')}`;
    }

    // Kirim data yang sudah diformat ke komponen induk
    emit('confirm', {
        id: props.formData?.id,
        name: namaDiskon.value,
        value: finalValue
    });
};

const handleDelete = () => {
    console.log('Mengirim event delete untuk ID:', props.formData?.id);
    emit('delete', {
        id: props.formData?.id,
        name: namaDiskon.value
    });
};


</script>

<template>
    <v-dialog :model-value="modelValue" @update:model-value="emit('update:modelValue', $event)" max-width="460"
        rounded="xl">
        <v-card rounded="xl" class="pa-6">

            <template v-if="props.type === 'hapus'">
                <v-card-title class="pa-0 mb-2 text-h6 font-weight-bold">Hapus Diskon</v-card-title>
                <v-card-text class="pa-0 mb-6 text-body-2 text-medium-emphasis">
                    Apakah Anda yakin ingin menghapus diskon ini? Data tidak bisa dikembalikan.
                </v-card-text>
                <v-row no-gutters class="gap-3">
                    <v-col>
                        <v-btn variant="outlined" color="grey" block rounded="lg" @click="close">
                            Batalkan
                        </v-btn>
                    </v-col>
                    <v-col>
                        <v-btn color="error" block rounded="lg" @click="$emit('confirm')">
                            Hapus
                        </v-btn>
                    </v-col>
                </v-row>
            </template>

            <template v-else>
                <div class="d-flex align-center justify-space-between mb-5">
                    <span class="text-h6 font-weight-bold">
                        {{ props.type === 'tambah' ? 'Tambah' : 'Ubah' }} Diskon
                    </span>
                    <v-btn icon="mdi-close" variant="plain" density="compact" @click="close" />
                </div>

                <v-text-field v-model="namaDiskon" label="Nama Diskon"
                    placeholder="Misal: Diskon opening, diskon akhir tahun" variant="outlined" rounded="lg"
                    density="comfortable" color="success" class="mb-2" />

                <div class="d-flex align-center ga-sm-4 mb-6">
                    <v-text-field v-model="nilaiDiskon" label="Diskon" placeholder="0" variant="outlined" rounded="lg"
                        density="comfortable" color="success" type="number" :suffix="discountType === '%' ? '%' : ''"
                        hide-details class="flex-grow-1" />

                    <v-btn-toggle v-model="discountType" mandatory rounded="lg"
                        style="height: 30px; border: 1px solid rgba(0,0,0,0.23);" class="overflow-hidden">
                        <v-btn value="%" variant="text" :color="discountType === '%' ? 'success' : 'default'"
                            :class="discountType === '%' ? 'bg-green-lighten-5' : ''" class="px-3"
                            style="height: 100%;">
                            <v-icon v-if="discountType === '%'" start size="16">mdi-check</v-icon>
                            %
                        </v-btn>
                        <v-divider vertical />
                        <v-btn value="Rp" variant="text" :color="discountType === 'Rp' ? 'success' : 'default'"
                            :class="discountType === 'Rp' ? 'bg-green-lighten-5' : ''" class="px-3"
                            style="height: 100%;">
                            <v-icon v-if="discountType === 'Rp'" start size="16">mdi-check</v-icon>
                            Rp
                        </v-btn>
                    </v-btn-toggle>
                </div>

                <v-btn v-if="props.type === 'tambah'" color="success" block rounded="xl" size="large"
                    @click="handleSimpan">
                    Simpan
                </v-btn>

                <template v-else-if="props.type === 'ubah'" class="d-flex justify-space-between gap-3">
                    <div class="d-flex justify-space-between">
                        <v-btn color="error" variant="text" size="medium" @click="handleDelete">
                            Hapus
                        </v-btn>

                        <v-btn color="success" rounded="xl" @click="handleSimpan">
                            Simpan
                        </v-btn>
                    </div>

                </template>

            </template>

        </v-card>
    </v-dialog>
</template>