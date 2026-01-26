<template>
    <q-btn :label="label" :type="type" :unelevated="unelevated" :class="[customClass]" :loading="loading" :icon="icon"
        :color="color" :padding="padding" :flat="flat" :round="round" :dense="dense" :glossy="glossy" :no-caps="noCaps"
        :text-color="textColor" :size="size" :disable="disabled" :outline="outline" :rounded="rounded" @click="handleClick">

        <template v-slot:loading>
            <q-spinner-ios color="white" size="1em" />
        </template>
        <slot />

        <q-tooltip anchor="bottom middle" v-if="activeTooltip">{{ tooltip }}</q-tooltip>
    </q-btn>
</template>

<script setup>
const props = defineProps({
    label: String,
    type: String,
    loading: Boolean,
    icon: String,
    color: {
        type: String
    },
    padding: {
        type: String,
        default: '10px'
    },
    flat: Boolean,
    glossy: Boolean,
    noCaps: Boolean,
    round: Boolean,
    rounded: {
        type: Boolean,
        default: true
    },
    dense: Boolean,
    textColor: String,
    customClass: String,
    size: String,
    disabled: Boolean,
    tooltip: String,
    activeTooltip: Boolean,
    outline: {
        type: Boolean,
        default: true
    },
    unelevated: {
        type: Boolean,
        default: false
    }
})

const emit = defineEmits(['click']);

// Solo emite click si NO es type="submit"
const handleClick = (event) => {
    if (props.type !== 'submit') {
        emit('click', event)
    }
}
</script>

<style scoped>
.btn-cancel {
    border: 1px solid #ffffff;
    border-radius: 8px;
    font-weight: 500;
    color: #ffffff;
    background-color: #ff0202;
    padding: 8px 24px;
    transition: all 0.3s ease;
}

.btn-cancel:hover {
    background-color: #e42f2f;
}

.btn-back {
    border: 1px solid #ffffff;
    border-radius: 8px;
    font-weight: 500;
    color: #ffffff;
    background-color: #03259fd3;
    padding: 8px 24px;
    transition: all 0.3s ease;
}

.btn-back:hover {
    background-color: #061e71d3;
}

.btn-submit {
    border: none;
    border-radius: 8px;
    font-weight: 500;
    color: white;
    background-color: #0ed30e;
    padding: 8px 28px;
    box-shadow: 0 4px 12px rgba(14, 211, 14, 0.3);
    transition: all 0.3s ease;
}

.btn-submit:hover {
    background-color: #0ab90a;
    box-shadow: 0 6px 16px rgba(14, 211, 14, 0.4);

}


button:hover {
    cursor: pointer;
    transform: translateY(-1px);
    transition: all 0.3s ease;
}
</style>