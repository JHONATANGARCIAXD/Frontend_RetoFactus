<template class="">
    <q-page class="q-pa-md k" style="margin: 0; padding: 0; height: 100%; background-color: aqua;">
        <div class="q-pa-md modern-container">
            <!-- Header minimalista y elegante xd -->
            <div class="header-section q-mb-lg">
                <div class="row items-center justify-between">
                    <div class="flex items-center q-gutter-md">
                        <div class="icon-wrapper">
                            <q-icon name="apps" size="32px" color="white" />
                        </div>
                        <div>
                            <div class="text-h4 text-weight-bold text-grey-9">Categorías</div>
                            <div class="text-subtitle2 text-grey-6">Administra tus categorías de productos</div>
                        </div>
                    </div>
                    <Button label="Agregar" icon="add" @click="op = 0, mostrarModal = true, cleanInfo()" color="primary"
                        size="md" />
                </div>
            </div>

            <q-card flat bordered class="table-card">
                <Table :rows="rows" :columns="columns" v-model:pagination="pagination" @request="getPagination"
                    :loandingTable="loandingTable">

                    <template #status="props">
                        <td class="text-center">
                            <Qchip :color="props.row.status == 0 ? 'green' : 'red'" text-color="white"
                                :label="props.row.status == 0 ? 'Activo' : 'Inactivo'" size="ld" class="state-chip" />
                        </td>
                    </template>

                    <template #options="props">
                        <td class="text-center">
                            <buttonsTable icon="edit" color="grey-7" size="24px"
                                @click="showInfoProduct(props.row), op = 1, mostrarModal = true"
                                :disable="props.row.status == 1" tooltip="Editar" />
                            <buttonsTable :icon="props.row.status == 0 ? 'block' : 'check_circle'"
                                :color="props.row.status == 0 ? 'red' : 'green'" size="24px"
                                @click="updateState(props.row)"
                                :tooltip="props.row.status == 0 ? 'Inactivar' : 'Activar'" />
                        </td>
                    </template>
                </Table>
            </q-card>
        </div>
    </q-page>

    <Modal v-model="mostrarModal" width="550px" max-width="95vw" :formRef="true" :persistent="true" @submit="Categoria">
        <template #header>
            <div class="flex justify-between items-center">
                <div class="flex items-center q-gutter-sm">
                    <div>
                        <q-icon color="white" :name="op == 0 ? 'add_circle_outline' : 'edit_outlined'" size="28px" />
                    </div>
                    <div class="text-h5 text-bold text-white">
                        {{ op == 0 ? 'Nueva Categoría' : 'Editar Categoría' }}
                    </div>
                </div>

                <Button icon="close" flat round dense v-close-popup @click="cleanInfo()" text-color="white"
                    :outline="false" :rounded="false" />
            </div>
        </template>

        <template #body>
            <div class="simple-body">
                <q-input outlined v-model="nombre" label="Nombre" placeholder="Nombre de la categoría" lazy-rules
                    :rules="[val => !!val || 'Campo requerido']">
                    <template v-slot:prepend>
                        <q-icon name="label" />
                    </template>
                </q-input>

                <q-input outlined v-model="descripcion" label="Descripción"
                    placeholder="Describe brevemente la categoría..." lazy-rules autogrow type="textarea" rows="3"
                    :rules="[val => !!val || 'Campo requerido']">
                    <template v-slot:prepend>
                        <q-icon name="description" />
                    </template>
                </q-input>
            </div>
        </template>

        <template #footer>
            <div class="simple-footer">
                <Button label="Cancelar" @click="cleanInfo()" v-close-popup color="negative" />
                <Button type="submit" :loading="spinner_btn" :label="op == 0 ? 'Guardar' : 'Editar'" color="positive" />
            </div>
        </template>
    </Modal>

</template>

<style scoped>
.header-section {
    background: white;
    padding: 24px;
    border-radius: 12px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.icon-wrapper {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    width: 56px;
    height: 56px;
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
}

.btn-add {
    box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
}

.table-card {
    border-radius: 12px;
    overflow: hidden;
}

.state-chip {
    font-weight: 500;
}

/* Modal Simple y Elegante */
</style>

<script setup>
import { onMounted, ref } from 'vue';
import { getData, postData, putData } from '../services/apiclient.js';
import { useNotifications } from '../composables/useNotifications.js';
import buttonsTable from '../components/buttonsTable.vue';
import Qchip from '../components/Qchip.vue';
import Table from '../components/Table.vue';
import Modal from '../components/Modal.vue';
import Button from '../components/button.vue';

const { error, success } = useNotifications();

// Variables reactivas
let loandingTable = ref(true);
let spinner = ref(false);
let spinner_btn = ref(false);
let mostrarModal = ref(false);
let op = ref(0);

const pagination = ref({
    page: 1,
    rowsPerPage: 10,
    rowsNumber: 0
});

const getPagination = (props) => {
    pagination.value = {
        page: props.pagination.page,
        rowsPerPage: props.pagination.rowsPerPage,
        rowsNumber: props.pagination.rowsNumber
    }
    getCategories()
}

let rows = ref([]);

const columns = ref([
    { name: 'name', align: 'center', label: 'Nombre', field: 'name' },
    { name: 'description', label: 'Descripción', field: 'description', align: 'center' },
    { name: 'status', label: 'Estado', align: 'center' },
    { name: 'options', label: "Opciones", align: 'center' }
]);

let id_nuevo = ref('');
let id = ref(null);
let nombre = ref('');
let descripcion = ref('');

const getCategories = async () => {
    loandingTable.value = true;
    try {
        const res = await getData(`/categories/getCategories`);
        pagination.value.rowsNumber = res.msg.totalRows
        rows.value = res.msg.categories;
    } catch (err) {
        error(err.response?.data?.errors?.[0]?.msg || 'Error al cargar categorías');
    } finally {
        loandingTable.value = false;
    }
};

const cleanInfo = () => {
    id.value = null;
    id_nuevo.value = '';
    nombre.value = '';
    descripcion.value = '';
};

const showInfoProduct = (props) => {
    id.value = props.documentId;
    id_nuevo.value = props.code;
    nombre.value = props.name;
    descripcion.value = props.description;
};

const Categoria = async () => {
    spinner_btn.value = true;
    if (op.value === 0) {
        try {
            await postData("/categories/saveCategories", {
                name: nombre.value,
                description: descripcion.value
            });
            success("Categoría creada con éxito");
            mostrarModal.value = false;
            getCategories();
            cleanInfo();
        } catch (err) {
            error(err.response?.data?.error?.message || 'Error al crear categoría');
        } finally {
            spinner_btn.value = false;
        }
    } else {
        try {
            await putData(`/categories/${id.value}`, {
                data: {
                    name: nombre.value,
                    description: descripcion.value,
                }
            });
            success("Categoría actualizada con éxito");
            getCategories();
            mostrarModal.value = false;
            cleanInfo();
        } catch (err) {
            error(err.response?.data?.error?.message || 'Error al actualizar categoría');
        } finally {
            spinner_btn.value = false;
        }
    }
};

const updateState = async (props) => {
    spinner.value = true;
    try {
        await putData(`/categories/${props.id}`, {
            data: {
                state: props.state === 0 ? 1 : 0
            }
        });
        success("Estado actualizado");
        getCategories();
    } catch (err) {
        error(err.response?.data?.error?.message || 'Error al actualizar estado');
    } finally {
        spinner.value = false;
    }
};

onMounted(() => {
    getCategories();
});
</script>
