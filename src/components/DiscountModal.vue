<script setup>
import { ref, watch, nextTick } from 'vue';

const props = defineProps({
    type: String,
    modelValue: Boolean,
    formData: Object
});

const emit = defineEmits(['update:modelValue', 'confirm', 'delete']);

// 1. Tambahkan ref untuk mengontrol form
const formRef = ref(null);

const discountType = ref('%');
const namaDiskon = ref('');
const nilaiDiskon = ref(null);

// 2. Buat aturan validasi
const aturanNama = [
    value => !!value || 'Nama diskon tidak boleh kosong'
];

const aturanNilai = [
    value => !!value || 'Nilai diskon tidak boleh kosong',
    value => Number(value) > 0 || 'Nilai harus lebih dari 0' // Tambahan agar tidak minus/nol
];

watch(() => props.modelValue, async (isOpen) => {
    if (isOpen) {
        if (props.type === 'ubah' && props.formData) {
            namaDiskon.value = props.formData.name;

            const valStr = props.formData.value || '';
            if (valStr.includes('%')) {
                discountType.value = '%';
                nilaiDiskon.value = valStr.replace('%', '').trim();
            } else if (valStr.toLowerCase().includes('rp')) {
                discountType.value = 'Rp';
                nilaiDiskon.value = valStr.replace(/[^0-9]/g, '');
            }
        } else {
            namaDiskon.value = '';
            nilaiDiskon.value = null;
            discountType.value = '%';
        }

        // 3. Reset peringatan error (merah) setiap kali modal baru dibuka
        await nextTick(); // Tunggu komponen dirender
        if (formRef.value) formRef.value.resetValidation();
    }
});

const close = () => emit('update:modelValue', false);

// 4. Ubah handleSimpan menjadi async untuk menunggu hasil validasi
const handleSimpan = async () => {
    // Validasi form terlebih dahulu
    if (formRef.value) {
        const { valid } = await formRef.value.validate();
        
        // Jika form tidak valid (ada yang kosong), batalkan proses simpan!
        if (!valid) return; 
    }

    let finalValue = '';
    if (discountType.value === '%') {
        finalValue = `${nilaiDiskon.value}%`;
    } else {
        const num = Number(nilaiDiskon.value) || 0;
        finalValue = `Rp ${num.toLocaleString('id-ID')}`;
    }

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
                        <v-btn color="error" block rounded="lg" @click="handleDelete">
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

                <v-form ref="formRef" @submit.prevent="handleSimpan">
                    
                    <v-text-field 
                        v-model="namaDiskon" 
                        :rules="aturanNama"
                        label="Nama Diskon"
                        placeholder="Misal: Diskon opening, diskon akhir tahun" 
                        variant="outlined" 
                        rounded="lg"
                        density="comfortable" 
                        color="success" 
                        class="mb-4" 
                    />

                    <div class="d-flex align-start ga-sm-4 mb-6">
                        <v-text-field 
                            v-model="nilaiDiskon" 
                            :rules="aturanNilai"
                            label="Diskon" 
                            placeholder="0" 
                            variant="outlined" 
                            rounded="lg"
                            density="comfortable" 
                            color="success" 
                            type="number" 
                            :suffix="discountType === '%' ? '%' : ''"
                            class="flex-grow-1" 
                        />

                        <v-btn-toggle v-model="discountType" mandatory rounded="lg"
                            style="height: 48px; border: 1px solid rgba(0,0,0,0.23);" class="overflow-hidden">
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

                    <div v-else-if="props.type === 'ubah'" class="d-flex justify-space-between w-100">
                        <v-btn color="error" variant="text" size="medium" @click="handleDelete">
                            Hapus
                        </v-btn>

                        <v-btn color="success" rounded="xl" @click="handleSimpan">
                            Simpan
                        </v-btn>
                    </div>
                </v-form>

            </template>

        </v-card>
    </v-dialog>
</template>