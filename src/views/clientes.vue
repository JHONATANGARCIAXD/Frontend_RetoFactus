<template>
    <q-page class="q-pa-md" style="background-color: #F9F8F6;">
        <div class=" modern-container">
            <!-- Header minimalista y elegante uwu -->
            <div class="header-section q-mb-lg">
                <div class="row items-center justify-between">
                    <div class="flex items-center q-gutter-md">
                        <div class="icon-wrapper">
                            <q-icon name="apps" size="32px" color="white" />
                        </div>
                        <div>
                            <div class="text-h4 text-weight-bold text-grey-9">Clientes</div>
                            <div class="text-subtitle2 text-grey-6">Administra tus clientes</div>
                        </div>
                    </div>
                    <Button label="Agregar" icon="add" @click="router.push({path: 'clientes/newCliente'})" color="primary" size="md" />
                </div>
            </div>


            <div class="row q-gutter-md q-mb-md">
                <div class="col-3 col-xs-11 col-sm-5 col-md-3">
                    <q-input label="Buscar por nombre o identificación" debounce="500" v-model="filters.search"
                        @update:model-value="getClients" label-color="primary" dense clearable outlined />
                </div>
                <div class="col-1 col-xs-11 col-sm-3 col-md-2">
                    <q-select v-model="filters.status" label="Estado" :options="status" emit-value map-options
                        @update:model-value="getClients" label-color="primary" dense outlined />
                </div>
            </div>

            <q-card flat bordered class="table-card">
                <Table :rows="rows" :columns="columns" v-model:pagination="pagination" @request="getPagination"
                    :loandingTable="loandingTable">

                    <template #status="props">
                        <td class="text-center">
                            <Qchip :color="props.row.status == 0 ? 'positive' : 'negative'" text-color="white"
                                :label="props.row.status == 0 ? 'Activo' : 'Inactivo'" size="ld" />
                        </td>
                    </template>

                    <template #options="props">
                        <td class="text-center">
                            <buttonsTable :icon="props.row.status == 0 ? 'block' : 'check_circle'"
                                :color="props.row.status == 0 ? 'negative' : 'positive'" size="24px"
                                @click="updateState(props.row)"
                                :tooltip="props.row.status == 0 ? 'Inactivar' : 'Activar'" />
                        </td>
                    </template>

                </Table>
            </q-card>
        </div>
    </q-page>






</template>
<script setup>

// -------------------- IMPORTS --------------------
import { ref, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import { getData, postData, putData } from '../services/apiclient.js';
import { useNotifications } from '../composables/useNotifications.js';
import axios from 'axios';
import Modal from '../components/Modal.vue';
import Button from '../components/button.vue';
import Table from '../components/Table.vue';
import buttonsTable from '../components/buttonsTable.vue';
import Qchip from '../components/Qchip.vue';

// -------------------- VARIABLES --------------------
const { error, success } = useNotifications();
const router = useRouter()


let op = ref(0);
let mostrarModal = ref(false);
let mostrarModalConfirm = ref(false);
let spinner = ref(false);
const loandingTable = ref(false);
let spinner_btn = ref(false);
let step = ref(1);

const pagination = ref({
    page: 1,
    rowsPerPage: 10,
    rowsNumber: 0
});

const status = ref([
    { label: 'Todos', value: '' },
    { label: 'Activos', value: 0 },
    { label: 'Inactivos', value: 1 }
])

const filters = ref({
    search: null,
    status: ''
})

const identificacion_nueva = ref("");
const nombre = ref("");
const direccion = ref("");
const telefono = ref("");
const correo = ref("");
const tipo_documento = ref("");
const tipo_persona = ref("");
const municipio = ref("");
const razon_social = ref("");
const nombre_comercial = ref("");
let identificacion_original = ""

// --------COLUMNAS Y ROWS TABLA -------- //

const columns = [
    { name: 'identification', align: 'center', label: 'Identificacion', field: 'document_number' },
    { name: 'names', align: 'center', label: 'Nombre', field: row => `${row.first_name} ${row.last_name}` },
    { name: 'address', align: 'center', label: 'Direccion', field: 'address' },
    { name: 'phone', align: 'center', label: 'Telefono', field: 'phone' },
    { name: 'email', align: 'center', label: 'Correo', field: 'email' },
    { name: 'status', align: 'center', label: 'Estado', field: 'state' },
    { name: 'options', align: 'center', label: 'Opciones' }
];

const rows = ref([]);

const getPagination = (props) => {
    pagination.value = {
        page: props.pagination.page,
        rowsPerPage: props.pagination.rowsPerPage,
        rowsNumber: pagination.value.rowsNumber
    }

    getClients()
}

// -------------------- MUNICIPIOS --------------------
const municipalities = ref([]);
const token = JSON.parse(localStorage.getItem('token')) || '';
const getMunicipalities = async (val, update) => {
    try {
        if (!val || val.length < 3) {
            municipalities.value = [];
            return;
        }
        const res = await axios.get(`https://api-sandbox.factus.com.co/v1/municipalities?name=${val}`, {
            headers: {
                'Accept': 'application/json',
                'Authorization': `Bearer ${token.token}`,
            },
        });
        update(() => {
            municipalities.value = res.data.data;
        });
    } catch (error) {
        // Manejo de error
    }
};


const getClients = async () => {
    loandingTable.value = true;
    try {
        const res = await getData("/users/getUsers", {
            params: {
                search: filters.value.search,
                role: 'client',
                status: filters.value.status,
                page: pagination.value.page,
                limit: pagination.value.rowsPerPage
            }
        });

        rows.value = res.msg.users

        pagination.value.rowsNumber = res.msg.totalRows
    } catch (err) {
        console.log(err)
        error(err.response?.data?.error?.message || 'Error al cargar clientes');
    }
    finally {
        loandingTable.value = false;
    }
};

// -- CREAR / MODIFICAR CLIENTES -- //
const Client = async () => {
    spinner_btn.value = true;
    if (op.value == 0) {
        try {
            await postData("/clients", {
                data: {
                    identification_document_id: tipo_documento.value,
                    legal_organization_id: tipo_persona.value,
                    identification: identificacion_nueva.value,
                    names: nombre.value || "",
                    trade_name: nombre_comercial.value || "",
                    company: razon_social.value || "",
                    address: direccion.value,
                    phone: telefono.value,
                    email: correo.value,
                    municipality_id: municipio.value,
                    dv: identificacion_nueva.value.split("-")[1] || ""
                }
            });
            getClients();
            success("Cliente creado correctamente");
            mostrarModal.value = false;
        } catch (err) {
            error(err.response?.data?.error?.message || 'Error al crear cliente');
        }
        finally {
            spinner_btn.value = false;
        }

    } else {
        try {
            await putData(`/clients/${identificacion_original}`, {
                data: {
                    identification_document_id: tipo_documento.value,
                    legal_organization_id: tipo_persona.value,
                    identification: identificacion_nueva.value,
                    names: nombre.value || "",
                    trade_name: nombre_comercial.value || "",
                    company: razon_social.value || "",
                    address: direccion.value,
                    phone: telefono.value,
                    email: correo.value,
                    municipality_id: municipio.value,
                    dv: identificacion_nueva.value.split("-")[1] || ""
                }
            });
            getClients();
            success("Cliente actualizado correctamente");
            mostrarModal.value = false;
        } catch (err) {
            error(err.response?.data?.error?.message || 'Error al actualizar cliente');
        }
        finally {
            spinner_btn.value = false;
        }
    }
};

// -- ACTUALIZAR ESTADO CLIENTE -- //
const updateState = async (props) => {
    spinner.value = true;
    try {

        console.log(props)

        let enpoint = props.status == 0 ? 'inactive' : 'active'

        let res = await putData(`/users/${enpoint}Users/${props.id}`, {
            data: {
                state: props.state == 0 ? 1 : 0
            }
        });

        getClients();
        success(res.msg);

    } catch (err) {
        error(err.response?.data?.error?.message || 'Error al actualizar estado');
    }
    finally {
        spinner.value = false;
    }
};

// -------------------- FUNCIONES AUXILIARES --------------------
const cleanInfo = () => {
    identificacion_nueva.value = "";
    nombre.value = "";
    direccion.value = "";
    telefono.value = "";
    correo.value = "";
    tipo_documento.value = "";
    tipo_persona.value = "";
    municipio.value = "";
    razon_social.value = "";
    nombre_comercial.value = "";
    step.value = 1;
};

// -- MOSTRAR INFORMACION CLIENTE -- //
const showInfoClient = (props) => {
    identificacion_original = props.documentId;
    identificacion_nueva.value = props.identification;
    tipo_persona.value = props.legal_organization_id.toString();
    tipo_documento.value = props.identification_document_id.toString();
    nombre.value = props.names;
    razon_social.value = props.company;
    nombre_comercial.value = props.trade_name;
    direccion.value = props.address;
    telefono.value = props.phone;
    correo.value = props.email;
    municipio.value = props.municipality_id;
    step.value = 1;
};

onMounted(async () => {
    getClients();
});

</script>


<style scoped>
.header-section {
    background: white;
    padding: 24px;
    border-radius: 12px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.icon-wrapper {
    background: linear-gradient(135deg, #331955 0%, #764ba2 100%);
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


/* Modal Simple y Elegante (mismo patrón que productos) */
.simple-header {
    display: flex;
    align-items: center;
    gap: 16px;
    padding: 20px 28px;
}

.header-icon {
    width: 48px;
    height: 48px;
    background: rgba(255, 255, 255, 0.2);
    border-radius: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
}

.header-title {
    flex: 1;
    font-size: 22px;
    font-weight: 600;
    color: white;
    letter-spacing: -0.3px;
}

.close-icon {
    color: white;
    opacity: 0.9;
    transition: opacity 0.2s;
}

.close-icon:hover {
    opacity: 1;
}

.client-stepper {
    background: white;
}

.client-stepper :deep(.q-stepper__step-inner) {
    padding: 0;
    padding-left: 0;
}

.client-stepper :deep(.q-stepper__step-content) {
    padding: 0 60px;
}

.client-stepper :deep(.q-field) {
    margin-bottom: 20px;
}

.client-stepper :deep(.q-field--focused .q-field__control):before {
    border-color: #667eea;
    border-width: 2px;
}

.client-stepper :deep(.q-field__label) {
    color: #546e7a;
    font-weight: 500;
}

.client-stepper :deep(.q-field--focused .q-field__label) {
    color: #667eea;
}

.simple-footer {
    padding: 16px 28px;
    background: #f8f9fa;
    border-radius: 0 0 12px 12px;
    display: flex;
    gap: 12px;
    justify-content: space-between;
    align-items: center;
}

.footer-actions {
    display: flex;
    gap: 12px;
}
</style>