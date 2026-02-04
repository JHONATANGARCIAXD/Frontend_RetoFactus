<template>
    <q-page class="q-pa-md" style="background-color: #F9F8F6;">

        <!-- Header -->
        <div class="flex justify-between items-center q-mb-md q-pa-md bg-primary rounded-borders">
            <div class="flex items-center q-gutter-sm">
                <q-icon color="white" :name="op == 0 ? 'add_circle_outline' : 'edit_outlined'" size="28px" />
                <div class="text-h5 text-bold text-white">
                    {{ op == 0 ? 'Nuevo Producto' : 'Editar Producto' }}
                </div>
            </div>
        </div>

        <!-- Formulario -->
        <q-form @submit="Product">
            <q-card flat bordered>
                <q-card-section>
                    <q-stepper v-model="step" vertical color="primary" animated flat class="product-stepper">
                        <q-step :name="1" title="Información Básica" icon="inventory_2" :done="step > 1">
                            <q-input filled v-model="formData.referencia" label="Codigo de Referencia*" lazy-rules
                                :rules="[val => !!val || 'Escribe la referencia']">
                                <template v-slot:prepend>
                                    <q-icon name="confirmation_number" color="grey-6" />
                                </template>
                            </q-input>

                            <q-select filled v-model="formData.categoria" :options="categorias" label="Categoría*"
                                use-input input-debounce="700" @filter="getCategorie"
                                :rules="[val => val || 'Seleccione la categoría']" :option-label="val => val.name"
                                :option-value="val => val.id" map-options clearable>
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
                                        option-label="name" option-value="id" emit-value map-options
                                        label="Unidad de Medida*" lazy-rules
                                        :rules="[val => !!val || 'Selecciona la unidad de medida']">
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
                                        :options="[{ label: 'No', value: 0 }, { label: 'Sí', value: 1 }]"
                                        label="Excento" emit-value map-options>
                                        <template v-slot:prepend>
                                            <q-icon name="block" color="grey-6" />
                                        </template>
                                    </q-select>
                                </div>
                            </div>

                            <div class="row q-col-gutter-md" v-if="formData.excluido == 0">
                                <div class="col">
                                    <q-select filled v-model="formData.tributo" :options="tributos"
                                        label="Tipo de Tributo" option-label="name" option-value="id" emit-value
                                        map-options>
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
                                    label="Código Estándar" option-label="nombre" option-value="id" emit-value
                                    map-options :rules="[]">
                                    <template v-slot:prepend>
                                        <q-icon name="code" color="grey-6" />
                                    </template>
                                </q-select>
                            </div>
                        </q-step>
                    </q-stepper>
                </q-card-section>

                <!-- Footer con botones -->
                <q-card-actions class="q-pa-md" align="between">
                    <Button label="Cancelar" @click="goBack()" color="negative" />

                    <div class="q-gutter-sm flex">
                        <Button v-if="step !== 1" label="Volver" @click="step = step - 1" color="primary" />

                        <Button v-if="step === 1" label="Siguiente"
                            :type="!formData.categoria || !formData.precio || !formData.nombre || !formData.referencia || !formData.unidad_medida ? 'submit' : 'button'"
                            @click="step = 2" color="primary" />

                        <Button v-if="step === 2" type="submit" :loading="spinner_btn" color="positive"
                            :label="op == 0 ? 'Guardar' : 'Editar'" :outline="false" />
                    </div>
                </q-card-actions>
            </q-card>
        </q-form>



    </q-page>
</template>
<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { getData, postData, putData } from '../services/apiclient.js';
import { useNotifications } from '../composables/useNotifications.js';
import Button from '../components/button.vue';


const router = useRouter();
const { error, success } = useNotifications();

let spinner_btn = ref(false)

let step = ref(1);
let op = ref(0);

const tributos = ref([]);
const categorias = ref([]);
const unidades_medidas = ref([]);

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

const getCategorie = async (search, update) => {
    try {
        if (search.length < 1) {
            categorias.value = [];
            return;
        }
        const res = await getData(`/categories/getCategories`, {
            params: {
                status: 0
            }
        });

        update(() => {
            categorias.value = res.msg.categories;
        })
    } catch (err) {
        console.log(err);
    }
};

const getUnidadesMedidad = async () => {
    try {
        
        const res = await getData(`/unitsOfMeasurement/getunitsOfMeasurement`)
        unidades_medidas.value = res.msg;
    } catch (err) {
        console.log(err);
    }
};

const generateReference = () => {
    let ref = 'PROD-' + Math.random().toString(36).substring(2, 8).toUpperCase();
    formData.value.referencia = ref;
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

const goBack = () => {
    cleanInfo();
    router.push('/app/productos');
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

            success("Producto creado con éxito");
            cleanInfo();
            router.push('/app/productos');
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

            success("Producto actualizado con éxito");
            cleanInfo();
            router.push('/app/productos');

        } catch (err) {
            error(err.response.data.error?.message);
        }
        finally {
            step.value = 1;
            spinner_btn.value = false;
        }
    }
};

onMounted(() => {
    generateReference();
    getUnidadesMedidad();
});
</script>