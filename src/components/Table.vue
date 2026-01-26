<template>

    <q-table :rows="rows" :columns="columns" :row-key="rowKey" flat bordered v-model:pagination="pagination"
        :rows-per-page-options="[10, 20, 30]" @request="$emit('request', $event)"
        rows-per-page-label="Registros Por Pagina" :loading="loandingTable" :hide-bottom="hideBottom"
        :table-row-style-fn="effectiveRowStyleFn" class="table">

        <template #header="props">
            <q-th v-for="col in props.cols" :key="col.name" :props="props" class="table-header-cell">
                {{ col.label }}
            </q-th>
        </template>

        <template #body-cell-options="props">
            <slot name="options" :row="props.row">
            </slot>
        </template>

        <!-- ESTADO -->
        <template #body-cell-status="props">
            <slot name="status" :row="props.row">
            </slot>
        </template>

        <!-- SIN DATOS -->
        <template #no-data>
            <slot name="no-data">
                <div class="q-pa-md flex flex-center column text-grey full-width">
                    <div class="text-subtitle2 q-mt-sm">No hay datos registrados</div>
                </div>
            </slot>
        </template>


        <!-- Permitir slots personalizados desde el componente padre -->
        <template v-for="(_, slot) in $slots" v-slot:[slot]="scope">
            <slot :name="slot" v-bind="scope" />
        </template>


    </q-table>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
    title: { type: String, default: "" },
    rows: { type: Array, default: () => [] },
    columns: { type: Array, default: () => [] },
    rowKey: { type: [String, Function], default: 'documentId' },
    rowStyleFn: { type: Function, default: undefined },
    pagination: {
        type: Object,
        default: () => ({
            page: 1,
            rowsPerPage: 10,
            rowsNumber: 0
        })
    },
    hideBottom: { type: Boolean, default: false },
    loandingTable: { type: Boolean, default: false }
});

const emit = defineEmits(['update:pagination', 'request'])

// v-model computado para la paginación
const pagination = computed({
    get: () => props.pagination,
    set: (val) => emit('update:pagination', val)
})

const defaultRowStyleFn = (row) => {
    if (row?.state === 1) {
        return { backgroundColor: '#dedede' }
    }
}

const effectiveRowStyleFn = computed(() => props.rowStyleFn ?? defaultRowStyleFn)


</script>


<style scoped lang="scss">
.table-header-cell {
    background-color: $colorHeaderTable;
    color: rgb(255, 255, 255) !important;
    font-weight: 600 !important;
    font-size: 0.95rem !important;
    padding: 16px 12px !important;
    text-align: center !important;
}

.table:deep(.q-table__linear-progress) {
    background-color: #60A5FA !important;
    height: 5px !important;
}
</style>