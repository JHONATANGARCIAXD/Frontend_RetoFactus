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
/* Estilo principal - combina con el gradiente del header */
.btn-primary {
    background: linear-gradient(135deg, #331955 0%, #764ba2 100%);
    border: none;
    border-radius: 8px;
    font-weight: 500;
    color: #ffffff;
    padding: 10px 24px;
    box-shadow: 0 4px 12px rgba(118, 75, 162, 0.3);
    transition: all 0.3s ease;
}

.btn-primary:hover {
    box-shadow: 0 6px 16px rgba(118, 75, 162, 0.5);
    transform: translateY(-2px);
}

/* Estilo secundario - usa color oscuro del sidebar */
.btn-secondary {
    background-color: #1F2937;
    border: none;
    border-radius: 8px;
    font-weight: 500;
    color: #F9F8F6;
    padding: 10px 24px;
    box-shadow: 0 4px 12px rgba(31, 41, 55, 0.3);
    transition: all 0.3s ease;
}

.btn-secondary:hover {
    background-color: #374151;
    box-shadow: 0 6px 16px rgba(31, 41, 55, 0.4);
    transform: translateY(-2px);
}

/* Estilo cancelar - rojo coherente */
.btn-cancel {
    background-color: #C10015;
    border: none;
    border-radius: 8px;
    font-weight: 500;
    color: #ffffff;
    padding: 10px 24px;
    box-shadow: 0 4px 12px rgba(193, 0, 21, 0.3);
    transition: all 0.3s ease;
}

.btn-cancel:hover {
    background-color: #a3001a;
    box-shadow: 0 6px 16px rgba(193, 0, 21, 0.4);
    transform: translateY(-2px);
}

/* Estilo volver - usa color del sidebar */
.btn-back {
    background-color: #190019;
    border: none;
    border-radius: 8px;
    font-weight: 500;
    color: #F9F8F6;
    padding: 10px 24px;
    box-shadow: 0 4px 12px rgba(25, 0, 25, 0.3);
    transition: all 0.3s ease;
}

.btn-back:hover {
    background-color: #2d0a2d;
    box-shadow: 0 6px 16px rgba(25, 0, 25, 0.4);
    transform: translateY(-2px);
}

/* Estilo submit - verde positivo de Quasar */
.btn-submit {
    background-color: #21BA45;
    border: none;
    border-radius: 8px;
    font-weight: 500;
    color: white;
    padding: 10px 28px;
    box-shadow: 0 4px 12px rgba(33, 186, 69, 0.3);
    transition: all 0.3s ease;
}

.btn-submit:hover {
    background-color: #1a9e3a;
    box-shadow: 0 6px 16px rgba(33, 186, 69, 0.4);
    transform: translateY(-2px);
}

/* Estilo outline - borde con gradiente */
.btn-outline {
    background: transparent;
    border: 2px solid #764ba2;
    border-radius: 8px;
    font-weight: 500;
    color: #764ba2;
    padding: 8px 24px;
    transition: all 0.3s ease;
}

.btn-outline:hover {
    background: linear-gradient(135deg, #331955 0%, #764ba2 100%);
    color: #ffffff;
    border-color: transparent;
    transform: translateY(-2px);
}

/* Estilo ghost - sin fondo, minimalista */
.btn-ghost {
    background: transparent;
    border: none;
    border-radius: 8px;
    font-weight: 500;
    color: #1F2937;
    padding: 10px 24px;
    transition: all 0.3s ease;
}

.btn-ghost:hover {
    background-color: rgba(118, 75, 162, 0.1);
    color: #764ba2;
}

/* Hover global para botones */
button:hover {
    cursor: pointer;
}
</style>