<script setup>
const props = defineProps({
    modelValue: Boolean,
    count: {
        type: Number,
        default: 0
    },
    itemName: {
        type: String,
        default: '' // Untuk menampung nama diskon jika hanya 1 yang dihapus
    }
});

const emit = defineEmits(['update:modelValue', 'confirm']);

const close = () => emit('update:modelValue', false);

const handleConfirm = () => {
    emit('confirm');
};
</script>

<template>
    <v-dialog :model-value="modelValue" @update:model-value="emit('update:modelValue', $event)" max-width="460"
        rounded="xl">
        <v-card rounded="xl" class="pa-6">
            <v-card-title class="pa-0 mb-2 text-h6 font-weight-bold">
                Hapus Diskon
            </v-card-title>

            <v-card-text class="pa-0 mb-6 text-body-medium">
                Apakah Anda yakin ingin menghapus

                <template v-if="props.count === 1 && props.itemName">
                    diskon <span class="">{{ props.itemName }}</span>
                </template>

                <template v-else-if="props.count > 1">
                    <span class="font-weight-bold text-black">{{ props.count }} diskon terpilih</span>
                </template>

                <template v-else>
                    <span class="font-weight-bold text-black">diskon ini</span>
                </template>?

                <ul>
                    <li>Diskon yang dihapus tidak bisa dikembalikan lagi.</li>
                </ul>
            </v-card-text>

            <div class="d-flex ga-2 justify-end">
                <v-btn variant="outlined" color="error" rounded="xl" @click="close">
                    Batalkan
                </v-btn>
                <v-btn color="error" rounded="xl" @click="handleConfirm">
                    Ya, Hapus
                </v-btn>

            </div>
        </v-card>
    </v-dialog>
</template>