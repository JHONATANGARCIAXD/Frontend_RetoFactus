<template>
    <q-page class="q-pa-md" style="background-color: #F9F8F6;">
        
            <!-- Header minimalista y elegante -->
            <div class="header-section q-mb-lg">
                <div class="row items-center justify-between">
                    <div class="flex items-center q-gutter-md">
                        <div class="icon-wrapper">
                            <q-icon name="inventory_2" size="32px" color="white" />
                        </div>
                        <div>
                            <div class="text-h4 text-weight-bold text-grey-9">Productos</div>
                            <div class="text-subtitle2 text-grey-6">Administra tu inventario</div>
                        </div>
                    </div>
                    <Button label="Agregar" icon="add" @click="op = 0, modalProducto = true, cleanInfo(), generateReference()"
            color="primary" size="md" to="/app/productos/newProducto" />
                </div>
            </div>

            <q-card flat bordered class="table-card">

                <Table :rows="rows" :columns="columns" v-model:pagination="pagination" @request="getPagination"
                    :loandingTable="loandingTable">

                    <template #status="props">
                        <td class="text-center">
                            <Qchip :color="props.row.state == 0 ? 'green' : 'red'" text-color="white"
                                :label="props.row.state == 0 ? 'Activo' : 'Inactivo'" size="ld" />
                        </td>
                    </template>

                    <template #options="props">
                        <td class="text-center">
                            <buttonsTable icon="edit" color="grey-7" size="24px"
                                @click="showInfoProduct(props.row), op = 1, modalProducto = true"
                                :disable="props.row.state == 1" tooltip="Editar" />
                            <buttonsTable :icon="props.row.state == 0 ? 'block' : 'check_circle'"
                                :color="props.row.state == 0 ? 'red' : 'green'" size="24px"
                                @click="updateState(props.row)"
                                :tooltip="props.row.state == 0 ? 'Inactivar' : 'Activar'" />
                        </td>
                    </template>


                    <template v-slot:body-cell-categoria="props">
                        <td class="text-center">
                            <div>
                                {{ props.row.categories[0]?.name || "SIN CATEGORIA" }}
                            </div>
                        </td>
                    </template>
                </Table>
            </q-card>
        
    </q-page>

    <Modal v-model="modalProducto" width="750px" max-width="95vw" :formRef="true" :persistent="true" @submit="Product">
        <template #header>
            <div class="flex justify-between items-center">
                <div class="flex items-center q-gutter-sm">
                    <div>
                        <q-icon color="white" :name="op == 0 ? 'add_circle_outline' : 'edit_outlined'" size="28px" />
                    </div>
                    <div class="text-h5 text-bold text-white">
                        {{ op == 0 ? 'Nuevo Producto' : 'Editar Producto' }}
                    </div>
                </div>

                <Button icon="close" flat round dense v-close-popup @click="cleanInfo()" text-color="white" :outline="false" :rounded="false" />
            </div>
        </template>

        <template #body>
            <q-stepper v-model="step" vertical color="primary" animated flat class="product-stepper">
                <q-step :name="1" title="Información Básica" icon="inventory_2" :done="step > 1">
                    <q-input filled v-model="formData.referencia" label="Codigo de Referencia*" lazy-rules
                        :rules="[val => !!val || 'Escribe la referencia']">
                        <template v-slot:prepend>
                            <q-icon name="confirmation_number" color="grey-6" />
                        </template>
                    </q-input>

                    <q-select filled v-model="formData.categoria" :options="categorias" label="Categoría*" use-input
                        input-debounce="700" @filter="getCategorie" :rules="[val => val || 'Seleccione la categoría']"
                        :option-label="val => val.name" :option-value="val => val.id" map-options clearable>
                        <template v-slot:prepend>
                            <q-icon name="category" color="grey-6" />
                        </template>

                        <template #no-option>
                            <q-item>
                                <q-item-section class="text-grey">
                                    No se encontraron categorías
                                </q-item-section>
                            </q-item>
                        </template>


                    </q-select>

                    <q-input filled v-model="formData.nombre" label="Nombre del Producto*" lazy-rules
                        :rules="[val => !!val || 'Escribe el nombre']">
                        <template v-slot:prepend>
                            <q-icon name="inventory_2" color="grey-6" />
                        </template>
                    </q-input>

                    <div class="row q-col-gutter-md">
                        <div class="col">
                            <q-input filled v-model="formData.precio" label="Precio*" lazy-rules
                                :rules="[val => !!val || 'Escribe el precio', val => !isNaN(val) || 'Solo números']">
                                <template v-slot:prepend>
                                    <q-icon name="attach_money" color="grey-6" />
                                </template>
                            </q-input>
                        </div>
                        <div class="col">
                            <q-select filled v-model="formData.unidad_medida" :options="unidades_medidas"
                                option-label="name" option-value="id" emit-value map-options label="Unidad de Medida*"
                                lazy-rules :rules="[val => !!val || 'Selecciona la unidad de medida']">
                                <template v-slot:prepend>
                                    <q-icon name="straighten" color="grey-6" />
                                </template>
                            </q-select>
                        </div>
                    </div>


                </q-step>
                <q-step :name="2" title="Información Tributaria" icon="description" :done="step > 2">

                    <div class="row q-col-gutter-md q-pb-md">
                        <div class="col">
                            <q-select filled v-model="formData.excluido"
                                :options="[{ label: 'No', value: 0 }, { label: 'Sí', value: 1 }]" label="Excento"
                                emit-value map-options>
                                <template v-slot:prepend>
                                    <q-icon name="block" color="grey-6" />
                                </template>
                            </q-select>
                        </div>
                    </div>

                    <div class="row q-col-gutter-md" v-if="formData.excluido == 0">

                        <div class="col">
                            <q-select filled v-model="formData.tributo" :options="tributos" label="Tipo de Tributo"
                                option-label="name" option-value="id" emit-value map-options>
                                <template v-slot:prepend>
                                    <q-icon name="receipt_long" color="grey-6" />
                                </template>
                            </q-select>
                        </div>
                        <div class="col">
                            <q-input filled v-model="formData.valor_impuesto" label="Impuesto(%)" lazy-rules
                                :rules="[val => !!val || 'Escribe el impuesto', val => !isNaN(val) || 'Solo números']">
                                <template v-slot:prepend>
                                    <q-icon name="percent" color="grey-6" />
                                </template>
                            </q-input>
                        </div>
                    </div>

                    <div class="q-pb-md">
                        <q-select filled v-model="formData.codigo_estandar" :options="codigos_estandar"
                            label="Código Estándar" option-label="nombre" option-value="id" emit-value map-options
                            :rules="[]">
                            <template v-slot:prepend>
                                <q-icon name="code" color="grey-6" />
                            </template>
                        </q-select>
                    </div>
                </q-step>
            </q-stepper>
        </template>

        <template #footer>
            <div class="flex justify-between items-center w-full">
                <Button label="Cancelar" @click="cleanInfo()" v-close-popup color="negative" />


                <div class="q-gutter-sm flex">
                    <Button v-if="step !== 1" label="Volver" @click="step = step - 1" color="primary" />

                    <Button v-if="step === 1" label="Siguiente"
                        :type="!formData.categoria || !formData.precio || !formData.nombre || !formData.referencia || !formData.unidad_medida ? 'submit' : 'button'"
                        @click="step = 2" color="primary" />

                    <Button v-if="step === 2" type="submit" :loading="spinner_btn" color="positive"
                        :label="op == 0 ? 'Guardar' : 'Editar'" :outline="false" />
                </div>
            </div>
        </template>
    </Modal>

    <q-dialog v-model="spinner" persistent>
        <q-card>
            <q-card-section>
                <div>
                    <q-spinner-ios color="primary" size="3em" />
                </div>
            </q-card-section>
        </q-card>
    </q-dialog>

</template>
<script setup>
import { ref, onMounted } from 'vue';
import { getData, postData, putData } from '../services/apiclient.js';
import { formatters } from '../composables/useFormats.js';
import { useNotifications } from '../composables/useNotifications.js';
import buttonsTable from '../components/buttonsTable.vue';
import Qchip from '../components/Qchip.vue';
import Table from '../components/Table.vue';
import Modal from '../components/Modal.vue';
import Button from '../components/button.vue';
import axios from 'axios';

const { error, success } = useNotifications();

// Reactive variables
let spinner = ref(false);
let loandingTable = ref(true)

let spinner_btn = ref(false)
let modalProducto = ref(false);

let step = ref(1);
let op = ref(0);


const tributos = ref([]);
const categorias = ref([]);
const unidades_medidas = ref([]);

const columns = ref([
    { name: 'referencia', align: 'center', label: 'Referencia', field: 'code_reference' },
    { name: 'nombre', align: 'center', label: 'Nombre', field: 'name' },
    { name: 'categoria', align: "center", label: 'Categoria', },
    { name: 'precio', align: "center", label: 'Precio', field: 'price', format: val => formatters.price(val) },
    { name: 'status', align: "center", label: 'Estado' },
    { name: 'options', align: "center", label: "Opciones" }
]);

const rows = ref([]);

const codigos_estandar = ref([
    { id: 1, nombre: "Estándar de adopción del contribuyente" },
    { id: 2, nombre: "UNSPSC" },
    { id: 3, nombre: "Partida Arancelaria" },
    { id: 4, nombre: "GTIN" }
])

const formData = ref({
    documentId: null,
    referencia: '',
    nombre: '',
    categoria: { name: '', id: null },
    precio: '',
    cantidad: '',
    unidad_medida: null,
    valor_impuesto: 19,
    tributo: 1,
    codigo_estandar: 1,
    excluido: 0
});


const pagination = ref({
    page: 1,
    rowsPerPage: 10,
    rowsNumber: 0
})

const getPagination = (props) => {
    pagination.value = {
        page: props.pagination.page,
        rowsPerPage: props.pagination.rowsPerPage,
        rowsNumber: props.pagination.rowsNumber
    }

    getproductos()
}


const getproductos = async () => {
    loandingTable.value = true
    try {
        const res = await getData(`/products/getProducts`)

        pagination.value.rowsNumber = res.meta.pagination.total

        rows.value = res.data;

    } catch (err) {
        error(err.response.data.errors[0].msg);
    }
    finally {
        loandingTable.value = false
    }

};

const getCategorie = async (search, update) => {
    try {
        if (search.length < 1) {
            categorias.value = [];
            return;
        }
        const res = await getData(`/categories?filters[name][$startsWithi][0]=${search}&filters[state][$eq]=0`);
        update(() => {
            categorias.value = res.data;
        })
    } catch (err) {
        console.log(err);
    }
};

// PETICIONES A FACTUS PARA UNIDADES DE MEDIDA Y TRIBUTOS 
const token = JSON.parse(localStorage.getItem('token')) || '';
const getUnidadesMedidad = async () => {
    try {
        const res = await axios.get("https://api-sandbox.factus.com.co/v1/measurement-units", {
            headers: {
                'Accept': 'application/json',
                'Authorization': `Bearer ${token.token}`,
            },
        });
        unidades_medidas.value = res.data.data;
    } catch (err) {
        console.log(err);
    }
};

const getTributos = async () => {
    try {
        const res = await axios.get("https://api-sandbox.factus.com.co/v1/tributes/products?name=", {
            headers: {
                'Accept': 'application/json',
                'Authorization': `Bearer ${token.token}`,
            },
        });
        tributos.value = res.data.data;
    } catch (err) {
        console.log(err);
    }
};



const generateReference = () => {
    let ref = 'PROD-' + Math.random().toString(36).substring(2, 8).toUpperCase();
    formData.value.referencia = ref;
};

// Product management
const showInfoProduct = (props) => {
    modalProducto.value = true;
    formData.value.documentId = props.documentId;
    formData.value.nombre = props.name;
    formData.value.precio = props.price;
    formData.value.referencia = props.code_reference;
    formData.value.categoria = { name: props.categories[0]?.name || '', id: props.categories[0]?.id || null };
    formData.value.unidad_medida = props.unit_measure_id;
    formData.value.excluido = props.is_excluded ? 1 : 0;
    formData.value.valor_impuesto = props.tax_rate;
    formData.value.tributo = props.tribute_id;
    formData.value.codigo_estandar = props.standard_code_id;
};

const cleanInfo = () => {
    step.value = 1;
    formData.value = {
        referencia: '',
        nombre: '',
        categoria: null,
        precio: '',
        cantidad: '',
        unidad_medida: null,
        valor_impuesto: 19,
        tributo: 1,
        codigo_estandar: 1,
        excluido: 0
    };
}


const Product = async () => {
    if (op.value === 0) {
        try {
            spinner_btn.value = true;
            const res = await postData("/products", {
                data: {
                    code_reference: formData.value.referencia,
                    name: formData.value.nombre,
                    price: Number(formData.value.precio),
                    unit_measure_id: formData.value.unidad_medida,
                    standard_code_id: formData.value.codigo_estandar,
                    tax_rate: Number(formData.value.valor_impuesto),
                    tribute_id: formData.value.tributo,
                    is_excluded: formData.value.excluido,
                    categories: {
                        connect: [formData.value.categoria.id]
                    }
                }
            });

            getproductos()
            success("Producto creado con éxito");
            modalProducto.value = false;
            cleanInfo();
        } catch (err) {
            error(err.response.data.error?.message);
        }

        finally {
            spinner_btn.value = false;
        }
    } else {
        try {
            spinner_btn.value = true;
            const res = await putData(`/products/${formData.value.documentId}`, {
                data: {
                    code_reference: formData.value.referencia,
                    name: formData.value.nombre,
                    price: Number(formData.value.precio),
                    unit_measure_id: formData.value.unidad_medida,
                    standard_code_id: formData.value.codigo_estandar,
                    tax_rate: formData.value.excluido == 1 ? 0 : Number(formData.value.valor_impuesto),
                    tribute_id: formData.value.tributo,
                    is_excluded: formData.value.excluido,
                    categories: {
                        connect: [formData.value.categoria.id]
                    }
                }
            });

            getproductos()
            success("Producto actualizado con éxito");
            modalProducto.value = false;
            cleanInfo();

        } catch (err) {
            error(err.response.data.error?.message);
        }
        finally {
            step.value = 1;
            spinner_btn.value = false;
        }
    }
};

// ACTUALIZAR ESTADO DEL PRODUCTO
const updateState = async (props) => {
    spinner.value = true;
    try {
        const res = await putData(`/products/${props.documentId}`, {
            data: {
                state: props.state === 0 ? 1 : 0
            }
        });
        success("Estado actualizado");
        getproductos()
    } catch (err) {
        error(err.response.data.errors[0].msg);
    }

    finally {
        spinner.value = false;
    }
};



// Lifecycle hooks
onMounted(() => {
    getproductos();
    getUnidadesMedidad();
    getTributos();
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
    box-shadow: 0 4px 12px rgba(0, 47, 255, 0.3);
}

.table-card {
    border-radius: 12px;
    overflow: hidden;
}

.modern-container{
    
    background-color: white;
    border-radius: 20px;
}
</style>
