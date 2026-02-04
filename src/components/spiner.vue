<template>

    <q-dialog  v-model:model-value="props.model">
        <q-card>
            <q-card-section>
                <div>
                    <q-spinner-ios color="primary" size="2em" />
                </div>
            </q-card-section>
        </q-card>
    </q-dialog>

</template>

<script setup>

const props = defineProps({
    model: Boolean
})

</script>