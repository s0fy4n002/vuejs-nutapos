<script setup>
import { Check } from '@lucide/vue';
import { ref } from 'vue';

const props = defineProps(['type']);
const emit = defineEmits(['close', 'confirm']);
const modalOverlay = ref(null);
const discountType = ref('%');

const handleOutsideClick = (event) => {
    if (event.target === modalOverlay.value) {
        emit('close');
    }
};
</script>

<template>
    <div ref="modalOverlay" @click="handleOutsideClick"
        class="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
        <div class="bg-white p-6 rounded-2xl w-full max-w-sm shadow-xl">

            <template v-if="props.type === 'hapus'">
                <h3 class="font-bold text-lg mb-2">Hapus Diskon</h3>
                <p class="text-sm text-gray-600 mb-6">Apakah Anda yakin ingin menghapus diskon ini? Data tidak bisa
                    dikembalikan.</p>
                <div class="flex gap-3">
                    <button @click="$emit('close')"
                        class="flex-1 border py-2 rounded-lg hover:bg-gray-100">Batalkan</button>
                    <button @click="$emit('confirm')"
                        class="flex-1 bg-red-500 text-white py-2 rounded-lg hover:bg-red-600">Hapus</button>
                </div>
            </template>

            <template v-else>
                <div class="flex items-center justify-between mb-5">
                    <h3 class="font-bold text-lg">{{ props.type === 'tambah' ? 'Tambah' : 'Ubah' }} Diskon</h3>
                    <button @click="$emit('close')" class="text-gray-400 hover:text-gray-600 text-xl leading-none">&times;</button>
                </div>

                <!-- Nama Diskon -->
                <div class="relative border rounded-lg mb-4 focus-within:ring-2 focus-within:ring-green-500">
                    <span class="absolute left-3 top-2 text-xs text-gray-400">Nama Diskon</span>
                    <input
                        class="w-full pt-6 pb-2 px-3 rounded-lg outline-none text-sm bg-transparent"
                        placeholder="Misal: Diskon opening, diskon akhir tahun"
                    />
                </div>

                <!-- Diskon -->
                <div class="mb-6">
                    <div class="flex gap-2 items-center">
                        <div class="relative flex-1 border rounded-lg focus-within:ring-2 focus-within:ring-green-500">
                            <span class="absolute left-3 top-2 text-xs text-gray-400">Diskon</span>
                            <div class="flex items-center pt-6 pb-2 px-3">
                                <input
                                    class="flex-1 outline-none text-sm bg-transparent w-0"
                                    type="number"
                                    placeholder="0"
                                />
                                <span class="text-sm text-gray-400 ml-1">{{ discountType === '%' ? '%' : '' }}</span>
                            </div>
                        </div>

                        <!-- Toggle % / Rp -->
                        <div class="flex border rounded-lg overflow-hidden h-fit">
                            <button
                                @click="discountType = '%'"
                                :class="[
                                    'flex items-center gap-1 px-3 py-2 text-sm font-medium transition-colors',
                                    discountType === '%'
                                        ? 'bg-green-50 text-green-600 border-green-300'
                                        : 'text-gray-500 hover:bg-gray-50'
                                ]"
                            >
                                <Check v-if="discountType === '%'" class="w-4 h-4 text-green-500" />
                                %
                            </button>
                            <div class="w-px bg-gray-200"></div>
                            <button
                                @click="discountType = 'Rp'"
                                :class="[
                                    'flex items-center gap-1 px-3 py-2 text-sm font-medium transition-colors',
                                    discountType === 'Rp'
                                        ? 'bg-green-50 text-green-600'
                                        : 'text-gray-500 hover:bg-gray-50'
                                ]"
                            >
                                <Check v-if="discountType === 'Rp'" class="w-4 h-4 text-green-500" />
                                Rp
                            </button>
                        </div>
                    </div>
                </div>

                <button @click="$emit('confirm')" class="w-full bg-green-500 hover:bg-green-600 text-white py-3 rounded-xl font-medium transition-colors">
                    Simpan
                </button>
            </template>

        </div>
    </div>
</template>