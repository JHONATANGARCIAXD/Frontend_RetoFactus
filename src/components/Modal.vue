<template>
    <q-dialog v-model="modelValue" :persistent="propsModal.persistent">
        <q-card :style="{ width: propsModal.width, maxWidth: propsModal.maxWidth }">

            <!-- HEADER -->
            <q-card-section class=" modal-header">
                <slot name="header" class="bg-red">

                </slot>
            </q-card-section>

            <q-form v-if="formRef" ref="internalFormRef" @submit="emit('submit')">
                <q-card-section class="modal modal-body">
                    <slot name="body">
                    </slot>
                </q-card-section>

                <q-card-section class="modal modal-footer">
                    <slot name="footer">

                    </slot>
                </q-card-section>
            </q-form>

            <template v-else>
                <q-card-section class="modal modal-body">
                </q-card-section>

                <q-card-section class="modal modal-footer" >
                    <slot name="footer">

                    </slot>
                </q-card-section>
            </template>
        </q-card>
    </q-dialog>
</template>

<script setup>

import { ref } from 'vue'


const propsModal = defineProps({
    persistent: { type: Boolean, default: false },
    width: { type: String, },
    maxWidth: { type: String, default: '90vw' },
    formRef: { type: Boolean, default: false }

})

const emit = defineEmits(['submit'])
const internalFormRef = ref(null)

defineExpose({
    submit: () => {
        if (internalFormRef.value) {
            internalFormRef.value.submit()
        }
    },
    validate: () => {
        if (internalFormRef.value) {
            return internalFormRef.value.validate()
        }
        return Promise.resolve(true)
    }
})


const modelValue = defineModel({ type: Boolean, default: false })

</script>

<style scoped lang="scss">
@import '/quasar-variables.sass';

.modal-header {
    background: $colorHeaderModal;
    border-bottom: 2px solid #e0e0e0;
}

.modal-body {
    overflow-y:auto;
}



</style>