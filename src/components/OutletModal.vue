<script setup>
import { ref, computed } from 'vue';

const props = defineProps({
    modelValue: Boolean, // Untuk membuka/menutup modal
    outlets: {
        type: Array,
        default: () => []
    },
    selectedOutletId: {
        type: [Number, String],
        default: null
    }
});

const emit = defineEmits(['update:modelValue', 'select']);

const search = ref('');

const filteredOutlets = computed(() => {

    if (!search.value) return props.outlets;
    const query = search.value.toLowerCase();
    return props.outlets.filter(o => o.name.toLowerCase().includes(query));
});

const close = () => {
    emit('update:modelValue', false);
};

const selectOutlet = (outlet) => {
    emit('select', outlet); // Kirim data outlet yang dipilih ke parent
    close();
};
</script>

<template>
    <v-dialog :model-value="modelValue" @update:model-value="emit('update:modelValue', $event)" max-width="450"
        rounded="xl">
        <v-card rounded="xl" class="pa-2">

            <v-card-title class="d-flex justify-space-between align-center px-4 pt-4 pb-2 text-h6 font-weight-bold">
                Pilih Outlet
                <v-btn icon="mdi-close" variant="plain" density="compact" @click="close"></v-btn>
            </v-card-title>

            <v-card-text class="pa-4 pt-2">
                <v-text-field v-model="search" placeholder="Cari nama outlet di sini" prepend-inner-icon="mdi-magnify"
                    variant="solo-filled" flat bg-color="grey-lighten-4" rounded="xl" density="comfortable" hide-details
                    class="mb-4 outlet-search"></v-text-field>

                <v-list class="overflow-y-auto outlet-scroll" style="max-height: 300px; padding: 0;">

                    <v-list-item v-for="outlet in filteredOutlets" :key="outlet.id" @click="selectOutlet(outlet)"
                        class="mb-2 rounded-lg py-2" prepend-icon="mdi-storefront-outline">
                        <v-list-item-title class="font-weight-medium text-body-1">{{ outlet.name }}</v-list-item-title>
                        <v-list-item-subtitle class="text-body-2 text-grey-darken-1 mt-1">{{ outlet.address || 'Alamat belum diatur' }}</v-list-item-subtitle>

                        <template v-slot:append>
                            <v-icon v-if="props.selectedOutletId === outlet.id" icon="mdi-check"
                                color="success"></v-icon>
                        </template>
                    </v-list-item>

                    <v-list-item v-if="search && filteredOutlets.length === 0" class="text-center py-4">
                        <v-list-item-title class="text-body-2 mb-3 text-grey-darken-1">
                            Outlet <span class="font-weight-bold text-black">"{{ search }}"</span> belum terdaftar.
                        </v-list-item-title>
                        <v-btn color="success" variant="flat" rounded="lg" @click="$emit('add-outlet', search)">
                            <v-icon icon="mdi-plus" start></v-icon>
                            Tambah Outlet ke API
                        </v-btn>
                    </v-list-item>

                </v-list>
            </v-card-text>

        </v-card>
    </v-dialog>
</template>

<style scoped>
.outlet-scroll::-webkit-scrollbar {
    width: 8px;
}

.outlet-scroll::-webkit-scrollbar-track {
    background: transparent;
}

.outlet-scroll::-webkit-scrollbar-thumb {
    background: #4caf50;
    border-radius: 999px;
}

.outlet-scroll::-webkit-scrollbar-button {
    display: none;
    width: 0;
    height: 0;
}

.outlet-scroll::-webkit-scrollbar-corner {
    background: transparent;
}

/* Firefox */
.outlet-scroll {
    scrollbar-width: thin;
    scrollbar-color: #4caf50 transparent;
}

.outlet-search :deep(.v-field) {
    background-color: #ffffff;
}

.outlet-search :deep(.v-field:hover) {
    background-color: #ffffff !important;
}

.outlet-search :deep(.v-field__overlay) {
    background-color: #b9b9b9 !important;
    opacity: .1 !important;
}
</style>