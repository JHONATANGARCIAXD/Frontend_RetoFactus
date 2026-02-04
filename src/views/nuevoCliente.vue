<template>
    <q-page class="q-pa-md" style="background-color: #F9F8F6;">
        <div class="modern-container flex column" style="align-items: center;">
            <div class="header-section q-mb-lg">
                <div class="row items-center justify-between">
                    <div class="flex items-center q-gutter-md">
                        <div class="icon-wrapper">
                            <q-icon name="person_add" size="32px" color="white" />
                        </div>
                        <div>
                            <div class="text-h4 text-weight-bold text-grey-9">Nuevo Cliente</div>
                            <div class="text-subtitle2 text-grey-6">Registra la información del cliente</div>
                        </div>
                    </div>
                    <Button label="Limpiar" icon="cleaning_services" color="primary" size="md" @click="cleanInfo" />
                </div>
            </div>

            <div class="form-container">
                <q-card bordered class="section-card">
                    <q-form class="q-gutter-md" ref="form">
                        <!-- Información Básica -->
                        <q-card-section>
                            <div class="section-title">Información Básica</div>
                            <div class="row q-col-gutter-md">
                                <div class="col-12 col-sm-6 col-md-6 col-lg-6">
                                    <q-select ref="selectPersona" label="Tipo de Persona*" v-model="typePerson"
                                        :options="typesPersons" option-label="label" option-value="value" map-options
                                        emit-value filled lazy-rules
                                        :rules="[val => !!val || 'Seleccione el tipo de persona']">
                                        <template v-slot:prepend>
                                            <q-icon name="people" color="grey-6" />
                                        </template>
                                    </q-select>
                                </div>

                                <div class="col-12 col-sm-6 col-md-6">
                                    <q-select label="Tipo de Documento*" v-model="typeDocument" :options="typeDocuments"
                                        :option-label="typeDocument ? row => `${row.name} / ${row.description}` : ''"
                                        map-options emit-value option-value="id" filled lazy-rules
                                        :rules="[val => !!val || 'Seleccione un tipo de documento']">
                                        <template #option="props">
                                            <q-item v-bind="props.itemProps">
                                                <q-item-section>
                                                    <q-item-label>{{ props.opt.name }} / {{ props.opt.description
                                                        }}</q-item-label>
                                                </q-item-section>
                                            </q-item>
                                        </template>
                                    </q-select>
                                </div>

                                <div class="col-12 col-sm-6" v-if="typePerson === '2'">
                                    <q-input v-model="firstName" filled label="Nombre(s)*" lazy-rules autocapitalized
                                        :rules="[val => !!val || 'Escribe el nombre']">
                                        <template v-slot:prepend>
                                            <q-icon name="person" color="grey-6" />
                                        </template>
                                    </q-input>
                                </div>

                                <div class="col-12 col-sm-6" v-if="typePerson === '2'">
                                    <q-input v-model="lastName" filled label="Apellido(s)*" lazy-rules autocapitalized
                                        :rules="[val => !!val || 'Escribe el nombre']">
                                        <template v-slot:prepend>
                                            <q-icon name="person" color="grey-6" />
                                        </template>
                                    </q-input>
                                </div>

                                <div class="col-12 col-sm-6" v-if="typePerson === '1'">
                                    <q-input filled v-model="companyName" label="Razón Social*" lazy-rules
                                        :rules="[val => !!val || 'Escribe la razón social']">
                                        <template v-slot:prepend>
                                            <q-icon name="business" color="grey-6" />
                                        </template>
                                    </q-input>
                                </div>

                                <div class="col-12 col-sm-6" v-if="typePerson === '1'">
                                    <q-input filled v-model="tradeName" label="Nombre Comercial">
                                        <template v-slot:prepend>
                                            <q-icon name="store" color="grey-6" />
                                        </template>
                                    </q-input>
                                </div>

                                <div class="col-12 col-sm-6">
                                    <q-input filled v-model="documentNumber"
                                        :label="typeDocument == 6 || typeDocument == 10 ? 'Número NIT*' : 'Número de Identificación*'"
                                        lazy-rules
                                        :mask="typeDocument == 6 || typeDocument == 10 ? '#########-#' : '####################'"
                                        :rules="[
                                            val => !!val || (typeDocument == 6 || typeDocument == 10 ? 'Digite el número de NIT' : 'Digite el número de identificación'),
                                            val => typeDocument == 6 || typeDocument == 10 ? /^[0-9-]+-[0-9]+$/.test(val) || 'EL NIT debe tener el formato correcto' : /^[0-9]+$/.test(val) || 'La identificación solo puede contener números'
                                        ]">
                                        <template v-slot:prepend>
                                            <q-icon name="badge" color="grey-6" />
                                        </template>
                                    </q-input>
                                </div>
                            </div>
                        </q-card-section>

                        <q-separator />

                        <!-- Información de Contacto -->
                        <q-card-section>
                            <div class="section-title">Información de Contacto</div>
                            <div class="row q-col-gutter-md">
                                <div class="col-12 col-md-6">
                                    <q-input filled v-model="email" label="Correo Electrónico*" lazy-rules :rules="[
                                        val => !!val || 'Escribe el Correo Electrónico',
                                        val => /.+@.+\..+/.test(val) || 'Correo Electrónico inválido'
                                    ]">
                                        <template v-slot:prepend>
                                            <q-icon name="email" color="grey-6" />
                                        </template>
                                    </q-input>
                                </div>
                                <div class="col-12 col-md-6">
                                    <q-input filled v-model="phone" label="Teléfono*" lazy-rules mask="##########"
                                        :rules="[val => !!val || 'Escribe el teléfono']">
                                        <template v-slot:prepend>
                                            <q-icon name="phone" color="grey-6" />
                                        </template>
                                    </q-input>
                                </div>
                            </div>
                        </q-card-section>

                        <q-separator />

                        <!-- Ubicación -->
                        <q-card-section>
                            <div class="section-title">Ubicación</div>
                            <div class="row q-col-gutter-md">
                                <div class="col-12 col-md-6">
                                    <q-input filled v-model="address" label="Dirección*" lazy-rules
                                        :rules="[val => !!val || 'Escribe la dirección']">
                                        <template v-slot:prepend>
                                            <q-icon name="location_on" color="grey-6" />
                                        </template>
                                    </q-input>
                                </div>
                                <div class="col-12 col-md-6">
                                    <q-select filled v-model="municipalitie" label="Municipio" lazy-rules
                                        :rules="[val => !!val || 'Selecciona el municipio']" :options="municipalities"
                                        :option-label="val => val ? (val.name + ', ' + val.department) : ''"
                                        input-debounce="700" use-input @filter="getmunicipalities" clearable>
                                        <template v-slot:prepend>
                                            <q-icon name="location_city" color="grey-6" />
                                        </template>
                                        <template #no-option>
                                            <q-item>
                                                <q-item-section class="text-grey">
                                                    No se encontraron municipios
                                                </q-item-section>
                                            </q-item>
                                        </template>
                                    </q-select>
                                </div>
                            </div>
                        </q-card-section>

                        <q-separator />

                        <!-- Acciones -->
                        <q-card-section class="simple-footer">
                            <Button label="Cancelar" @click="router.back()" color="negative" />
                            <Button :loading="spinner_btn" @click="Client()" color="positive" label="Guardar" />
                        </q-card-section>
                    </q-form>
                </q-card>
            </div>
        </div>


        <Spiner  v-model="spiner"></Spiner>

    </q-page>
</template>

<script setup>
import Button from '../components/button.vue';
import Spiner from '../components/spiner.vue';
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import { useNotifications } from '../composables/useNotifications.js';
import { getData, postData } from '../services/apiclient.js';

const { error, success } = useNotifications();
const router = useRouter()

const documentNumber = ref("");
const firstName = ref("")
const lastName = ref("")
const address = ref("");
const phone = ref("");
const email = ref("");
const typeDocument = ref("");
const typePerson = ref("2")
const municipalitie = ref("");
const companyName = ref("");
const tradeName = ref("");

const form = ref(null)

const spiner = ref(false);
const spinner_btn = ref(false);

const typesPersons = ref([
    { label: 'Persona Natural', value: '2' },
    { label: 'Persona Jurídica', value: '1' }
]);



const typeDocuments = ref([])
const getTypeDocuments = async () => {
    try {
        const res = await getData('/typeDocuments/getTypeDocuments')
        typeDocuments.value = res.msg
    }
    catch (err) {
        error(err.msg || 'Error')
    }
}


const municipalities = ref([]);
const getmunicipalities = async (val, update) => {
    try {
        if (!val || val.length < 3) {
            municipalities.value = [];
            return;
        }

        const res = await getData(`/municipalities/getmunicipalities`, {
            params: {
                search: val
            }
        })

        update(() => {
            municipalities.value = res.msg;
        });
    } catch (err) {
        error(res.msg || "Error")
    }
};


const Client = async () => {

    const ok = await form.value.validate()
    if (!ok) {
        const firstError = document.querySelector(".q-field--error input, .q-field--error textarea");
        if (firstError) {
            firstError.scrollIntoView({ behavior: "smooth", block: "center" });
            firstError.focus();
        }
        return;
    }

    spinner_btn.value = true;
    try {
        await postData("/users/saveUsers", {
            type_document: typeDocument.value,
            document_number: documentNumber.value,
            first_name: firstName.value,
            last_name: lastName.value,
            phone: phone.value,
            email: email.value,
            address: address.value,
            legal_organization_id: typePerson.value,
            tribute_id: 18,
            company: companyName.value,
            trade_name: tradeName.value,
            municipality: municipalitie.value

        });
        success("Cliente creado correctamente");
        cleanInfo();
    } catch (err) {
        console.log(err)
        error(err.response?.data?.error?.message || 'Error al crear cliente');
    }
    finally {
        spinner_btn.value = false;
    }
};

const cleanInfo = () => {
    documentNumber.value = "";
    firstName.value = "";
    lastName.value = ""
    address.value = "";
    phone.value = "";
    email.value = "";
    typeDocument.value = "";
    typePerson.value = "";
    municipalitie.value = "";
    companyName.value = "";
    tradeName.value = "";
};


onMounted( async () => {
    spiner.value = true
    await getTypeDocuments()
    spiner.value = false
})

</script>

<style scoped>
.header-section {
    background: white;
    width: 60%;
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
    padding: 20px 24px;
    display: flex;
    gap: 12px;
    justify-content: flex-end;
    align-items: center;
}

.footer-actions {
    display: flex;
    gap: 12px;
}

.form-container {
    width: 100%;
    max-width: 900px;
}

.section-card {
    background: white;
    border-radius: 12px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
    margin-bottom: 16px;
}

.action-card {
    background: white;
    border-radius: 12px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}

.section-title {
    font-size: 17px;
    font-weight: 600;
    color: #37474f;
    margin-bottom: 16px;
    padding-bottom: 8px;
    border-bottom: 2px solid #f5f5f5;
}

.section-card :deep(.q-field) {
    margin-bottom: 4px;
}

.input-group {
    margin-bottom: 12px;
}
</style>
