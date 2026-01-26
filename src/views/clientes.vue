<template>
    <q-page class="q-pa-md" style="background-color: white;">
        <div class="q-pa-md modern-container">
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
                    <Button label="Agregar" icon="add" @click="op = 0, mostrarModal = true, cleanInfo()" color="primary"
                        size="md" />
                </div>
            </div>

            <q-card flat bordered class="table-card">
                <Table :rows="rows" :columns="columns" v-model:pagination="pagination" @request="getPagination"
                    :loandingTable="loandingTable">

                    <template v-slot:body-cell-names="props">
                        <q-td key="names" :props="props">
                            <div>{{ props.row.names || props.row.trade_name || props.row.company }}</div>
                        </q-td>
                    </template>

                    <template #status="props">
                        <td class="text-center">
                            <Qchip :color="props.row.state == 0 ? 'green' : 'red'" text-color="white"
                                :label="props.row.state == 0 ? 'Activo' : 'Inactivo'" size="ld" class="state-chip" />
                        </td>
                    </template>

                    <template #options="props">
                        <td class="text-center">
                            <buttonsTable icon="edit" color="grey-7" size="24px"
                                @click="showInfoClient(props.row), op = 1, mostrarModal = true" tooltip="Editar" />
                            <buttonsTable :icon="props.row.state == 0 ? 'toggle_on' : 'toggle_off'"
                                :color="props.row.state == 0 ? 'red' : 'green'" size="24px"
                                @click="updateState(props.row)"
                                :tooltip="props.row.state == 0 ? 'Inactivar' : 'Activar'" />
                        </td>
                    </template>

                </Table>
            </q-card>
        </div>
    </q-page>


    <Modal v-model="mostrarModal" width="700px" max-width="95vw" :formRef="true" :persistent="true" @submit="Client">
        <template #header>
            <div class="simple-header">
                <div class="header-icon">
                    <q-icon :name="op == 0 ? 'add_circle_outline' : 'edit_outlined'" size="28px" />
                </div>
                <div class="header-title">
                    {{ op == 0 ? 'Nuevo Cliente' : 'Editar Cliente' }}
                </div>
                <Button icon="close" flat round dense v-close-popup @click="cleanInfo()" text-color="white"
                    :outline="false" :rounded="false" />
            </div>
        </template>

        <template #body>
            <q-stepper v-model="step" vertical color="primary" animated flat class="client-stepper">
                <q-step :name="1" title="Información Básica" icon="settings" :done="step > 1">
                    <div class="input-group">
                        <q-select label="Tipo de Persona*" v-model="tipo_persona" :options="typePerson"
                            option-label="label" option-value="value" map-options emit-value filled lazy-rules autofocus
                            :rules="[val => !!val || 'Seleccione el tipo de persona']">
                            <template v-slot:prepend>
                                <q-icon name="people" color="grey-6" />
                            </template>
                        </q-select>
                    </div>

                    <div class="input-group">
                        <q-select label="Tipo de Documento*" v-model="tipo_documento" :options="typesDocuments"
                            option-label="label" option-value="value" map-options emit-value filled lazy-rules
                            :rules="[val => !!val || 'Seleccione un tipo de documento']">
                            <template v-slot:prepend>
                                <q-icon name="badge" color="grey-6" />
                            </template>
                        </q-select>
                    </div>

                    <div class="input-group">
                        <q-input filled v-model="identificacion_nueva"
                            :label="tipo_documento == 6 || tipo_documento == 10 ? 'Número NIT*' : 'Número de Identificación*'"
                            lazy-rules
                            :mask="tipo_documento == 6 || tipo_documento == 10 ? '#########-#' : '####################'"
                            :rules="[
                                val => !!val || (tipo_documento == 6 || tipo_documento == 10 ? 'Digite el número de NIT' : 'Digite el número de identificación'),
                                val => tipo_documento == 6 || tipo_documento == 10 ? /^[0-9-]+-[0-9]+$/.test(val) || 'EL NIT debe tener el formato correcto' : /^[0-9]+$/.test(val) || 'La identificación solo puede contener números'
                            ]">
                            <template v-slot:prepend>
                                <q-icon name="badge" color="grey-6" />
                            </template>
                        </q-input>
                    </div>

                    <div class="input-group" v-if="tipo_persona === '2'">
                        <q-input filled v-model="nombre" label="Nombre Completo*" lazy-rules autocapitalized
                            :rules="[val => !!val || 'Escribe el nombre']">
                            <template v-slot:prepend>
                                <q-icon name="person" color="grey-6" />
                            </template>
                        </q-input>
                    </div>

                    <div class="input-group" v-if="tipo_persona === '1'">
                        <q-input filled v-model="razon_social" label="Razón Social*" lazy-rules
                            :rules="[val => !!val || 'Escribe la razón social']">
                            <template v-slot:prepend>
                                <q-icon name="business" color="grey-6" />
                            </template>
                        </q-input>
                    </div>

                    <div class="input-group" v-if="tipo_persona === '1'">
                        <q-input filled v-model="nombre_comercial" label="Nombre Comercial">
                            <template v-slot:prepend>
                                <q-icon name="store" color="grey-6" />
                            </template>
                        </q-input>
                    </div>
                </q-step>

                <q-step :name="2" title="Información de Contacto" icon="contact_mail" :done="step > 2">
                    <div class="input-group">
                        <q-input filled v-model="direccion" label="Dirección*" lazy-rules
                            :rules="[val => !!val || 'Escribe la dirección']">
                            <template v-slot:prepend>
                                <q-icon name="location_on" color="grey-6" />
                            </template>
                        </q-input>
                    </div>

                    <div class="input-group">
                        <q-input filled v-model="telefono" label="Teléfono*" lazy-rules mask="##########"
                            :rules="[val => !!val || 'Escribe el teléfono']">
                            <template v-slot:prepend>
                                <q-icon name="phone" color="grey-6" />
                            </template>
                        </q-input>
                    </div>

                    <div class="input-group">
                        <q-input filled v-model="correo" label="Correo Electronico*" lazy-rules :rules="[
                            val => !!val || 'Escribe el correo',
                            val => /.+@.+\..+/.test(val) || 'Correo inválido'
                        ]">
                            <template v-slot:prepend>
                                <q-icon name="email" color="grey-6" />
                            </template>
                        </q-input>
                    </div>

                    <div class="input-group">
                        <q-select filled v-model="municipio" label="Municipio" lazy-rules
                            :rules="[val => !!val || 'Selecciona el municipio']" :options="municipalities"
                            :option-label="val => val ? (val.name + ', ' + val.department) : ''" input-debounce="700"
                            use-input @filter="getMunicipalities" option-value="id" map-options emit-value clearable>
                            <template v-slot:prepend>
                                <q-icon name="location_city" color="grey-6" />
                            </template>


                            <template #no-option>
                                <q-item>
                                    <q-item-section class="text-grey">
                                        No se encontraron Municipios
                                    </q-item-section>
                                </q-item>
                            </template>
                        </q-select>
                    </div>
                </q-step>
            </q-stepper>
        </template>

        <template #footer>
            <div class="simple-footer">
                <Button label="Cancelar" @click="cleanInfo()" v-close-popup color="negative" />
                <div class="footer-actions">
                    <Button v-if="step !== 1" label="Volver" @click="step = step - 1" color="primary" />
                    <Button v-if="step === 1" label="Siguiente" @click="step = 2" color="primary"
                        :disabled="!tipo_persona || !tipo_documento || !identificacion_nueva || (tipo_persona === '2' && !nombre) || (tipo_persona === '1' && (!razon_social))"
                        :active-tooltip="!tipo_persona || !tipo_documento || !identificacion_nueva || (tipo_persona === '2' && !nombre) || (tipo_persona === '1' && (!razon_social))"
                        tooltip="Complete todos los campos obligatorios para continuar" />
                    <Button v-if="step === 2" type="submit" :loading="spinner_btn" color="positive"
                        :label="op == 0 ? 'Guardar' : 'Editar'" :outline="false" />
                </div>
            </div>
        </template>
    </Modal>


    <q-dialog v-model="spinner">
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

// -------------------- IMPORTS --------------------
import { ref, onMounted, computed } from 'vue';
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
    { name: 'identification', align: 'center', label: 'Identificacion', field: 'identification' },
    { name: 'names', align: 'center', label: 'Nombre' },
    { name: 'address', align: 'center', label: 'Direccion', field: 'address' },
    { name: 'phone', align: 'center', label: 'Telefono', field: 'phone' },
    { name: 'email', align: 'center', label: 'Correo', field: 'email' },
    { name: 'status', align: 'center', label: 'Estado', field: 'state' },
    { name: 'options', align: 'center', label: 'Opciones' }
];

const rows = ref([]);
const allRows = ref([]);

const applyPagination = () => {
    const page = pagination.value.page || 1;
    const rowsPerPage = pagination.value.rowsPerPage || 10;

    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;

    rows.value = allRows.value.slice(start, end);
    pagination.value.rowsNumber = allRows.value.length;
}

const getPagination = (props) => {
    if (!props || !props.pagination) return;
    pagination.value = {
        page: props.pagination.page,
        rowsPerPage: props.pagination.rowsPerPage,
        rowsNumber: pagination.value.rowsNumber
    }
    applyPagination();
}


// TIPOS DE PERSONA
const typePerson = [
    { label: 'Persona Natural', value: '2' },
    { label: 'Persona Jurídica', value: '1' }
];


// TIPOS DE DOCUMENTOS PERSONA NATURAL 

const typesDocumentsNatural = [
    { label: 'Registro civil', value: '1' },
    { label: 'Tarjeta de identidad', value: '2' },
    { label: 'Cédula de ciudadanía', value: '3' },
    { label: 'Pasaporte', value: '7' },
    { label: 'Documento de identificación extranjero', value: '8' },
    { label: 'PEP', value: '9' },
    { label: 'NUIP*', value: '11' }
];

// TIPOS DE DOCUMENTOS PERSONA JURIDICA

const typesDocumentsJuridica = [
    { label: 'NIT', value: '6' },
    { label: 'NIT otro país', value: '10' }
];


// -------------------- COMPUTED --------------------
const typesDocuments = computed(() => {
    if (op.value == 0) {
        tipo_documento.value = "";
        identificacion_nueva.value = "";
    }
    if (tipo_persona.value === '2') {
        return typesDocumentsNatural;
    } else if (tipo_persona.value === '1') {
        return typesDocumentsJuridica;
    }
    return [];
});


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

// -------------------- PETICIONES --------------------

// -- TRAER CLIENTES -- //
const getClients = async () => {
    loandingTable.value = true;
    try {
        const res = await getData("/clients");
        allRows.value = (res.data || []).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        applyPagination();
    } catch (err) {
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
        await putData(`/clients/${props.documentId}`, {
            data: {
                state: props.state == 0 ? 1 : 0
            }
        });

        getClients();
        success("Estado actualizado correctamente");

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

    const res = await axios.get(`https://api-sandbox.factus.com.co/v1/municipalities`, {
        headers: {
            'Accept': 'application/json',
            'Authorization': `Bearer ${token.token}`,
        },
    });

    municipalities.value = res.data.data;
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

/* Modal Simple y Elegante (mismo patrón que productos) */
.simple-header {
    display: flex;
    align-items: center;
    gap: 16px;
    padding: 20px 28px;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
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