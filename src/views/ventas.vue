<template>
    <q-page class="q-pa-md" style="background-color: #F9F8F6; ">
        
            <!-- Header minimalista y elegante -->
            <div class="header-section q-mb-lg">
                <div class="row items-center justify-between">
                    <div class="flex items-center q-gutter-md">
                        <div class="icon-wrapper">
                            <q-icon name="point_of_sale" size="32px" color="white" />
                        </div>
                        <div>
                            <div class="text-h4 text-weight-bold text-grey-9">Ventas</div>
                            <div class="text-subtitle2 text-grey-6">Gestiona las ventas realizadas</div>
                        </div>
                    </div>
                    <Button label="Nueva Venta" icon="add" @click="op = 0, mostrarModal = true" 
                        color="primary" size="md" />
                </div>
            </div>

            <q-card flat bordered class="table-card">
                <Table :rows="rows" :columns="columns" v-model:pagination="pagination" @request="getPagination"
                    :loandingTable="loandingTable">

                    <template v-slot:body-cell-cliente="props">
                        <q-td key="cliente" :props="props">
                            <div class="flex items-center">
                                <q-avatar color="primary" text-color="white" size="sm" class="q-mr-sm">
                                    {{ props.row.cliente?.nombre?.charAt(0).toUpperCase() || 'C' }}
                                </q-avatar>
                                {{ props.row.cliente?.nombre || 'N/A' }}
                            </div>
                        </q-td>
                    </template>

                    <template v-slot:body-cell-total="props">
                        <q-td :props="props">
                            <div class="text-weight-bold text-positive">
                                ${{ new Intl.NumberFormat('es-CO').format(props.row.total) }}
                            </div>
                        </q-td>
                    </template>

                    <template v-slot:body-cell-fecha="props">
                        <q-td :props="props">
                            <div class="text-body2">
                                {{ new Date(props.row.fecha).toLocaleDateString('es-CO') }}
                            </div>
                            <div class="text-caption text-grey-6">
                                {{ new Date(props.row.fecha).toLocaleTimeString('es-CO', {
                                    hour: '2-digit',
                                    minute: '2-digit'
                                }) }}
                            </div>
                        </q-td>
                    </template>

                    <template #options="props">
                        <td class="text-center">
                            <buttonsTable icon="visibility" color="grey-7" size="24px"
                                @click="verDetalles = true, DetalleVenta(props.row)" tooltip="Ver Detalles" />
                        </td>
                    </template>
                </Table>
            </q-card>
        

        <!-- Modal con diseño mejorado estilo clientes -->
        <q-dialog v-model="mostrarModal" persistent :maximized="true">
            <q-card class="modern-modal">
                <q-card-section class="modal-header q-pb-md">
                    <div class="row items-center">
                        <div class="col">
                            <div class="text-h5 text-weight-bold text-grey-9">
                                <q-icon :name="op == 0 ? 'shopping_cart' : 'edit'" size="28px" class="q-mr-sm"
                                    color="primary" />
                                {{ op == 0 ? 'Nueva Venta' : 'Editar Venta' }}
                            </div>
                            <div class="text-subtitle2 text-grey-6 q-mt-xs">
                                {{ op == 0 ? 'Completa los pasos para registrar una venta' : 'Modifica los datos de la venta' }}
                            </div>
                        </div>
                        <Button icon="close" flat round dense v-close-popup @click="limpiarFormulario()" color="grey-7" :outline="false" :rounded="false" />
                    </div>
                </q-card-section>

                <q-separator />

                <q-card-section class="q-pt-lg q-pb-lg" style="max-height: calc(100vh - 180px); overflow-y: auto;">
                    <q-form ref="myFormRef" @submit="guardarVenta()" class="q-gutter-md">

                        <q-stepper v-model="step" vertical color="primary" animated flat>
                            
                            <!-- PASO 1: Selección de Cliente -->
                            <q-step :name="1" title="Seleccionar Cliente" icon="person" :done="step > 1">
                                <div class="input-group">
                                    <q-select filled v-model="cliente" :options="clientes"
                                        label="Cliente*" option-label="names"
                                        option-value="documentId" @filter="getClientes" use-input
                                        input-debounce="300" clearable lazy-rules
                                        :rules="[val => !!val || 'Seleccione un cliente']"
                                        behavior="menu">
                                        <template v-slot:prepend>
                                            <q-icon name="person_search" color="grey-6" />
                                        </template>
                                        <template v-slot:no-option>
                                            <q-item>
                                                <q-item-section class="text-grey text-center">
                                                    <q-item-label>No hay clientes disponibles</q-item-label>
                                                </q-item-section>
                                            </q-item>
                                        </template>
                                        <template v-slot:option="scope">
                                            <q-item v-bind="scope.itemProps">
                                                <q-item-section avatar>
                                                    <q-avatar color="primary" text-color="white" size="md">
                                                        {{ scope.opt.names?.charAt(0).toUpperCase() || 'C' }}
                                                    </q-avatar>
                                                </q-item-section>
                                                <q-item-section>
                                                    <q-item-label>{{ scope.opt.names }}</q-item-label>
                                                    <q-item-label caption>{{ scope.opt.identification }}</q-item-label>
                                                </q-item-section>
                                            </q-item>
                                        </template>
                                    </q-select>
                                </div>

                                <!-- Información del cliente seleccionado -->
                                <transition enter-active-class="animated fadeIn">
                                    <div v-if="cliente" class="q-mt-md">
                                        <div class="row q-col-gutter-md">
                                            <div class="col-12 col-sm-4">
                                                <q-input filled v-model="cliente_identificacion" label="Identificación">
                                                    <template v-slot:prepend>
                                                        <q-icon name="badge" color="grey-6" />
                                                    </template>
                                                </q-input>
                                            </div>
                                            <div class="col-12 col-sm-4">
                                                <q-input filled v-model="cliente_email" label="Email" type="email">
                                                    <template v-slot:prepend>
                                                        <q-icon name="email" color="grey-6" />
                                                    </template>
                                                </q-input>
                                            </div>
                                            <div class="col-12 col-sm-4">
                                                <q-input filled v-model="cliente_telefono" label="Teléfono">
                                                    <template v-slot:prepend>
                                                        <q-icon name="phone" color="grey-6" />
                                                    </template>
                                                </q-input>
                                            </div>
                                        </div>
                                    </div>
                                </transition>

                                <q-stepper-navigation>
                                    <Button @click="step = 2" color="primary" label="Siguiente" :disabled="!cliente" />
                                </q-stepper-navigation>
                            </q-step>

                            <!-- PASO 2: Agregar Productos -->
                            <q-step :name="2" title="Agregar Productos" icon="inventory_2" :done="step > 2">
                                <div class="input-group">
                                    <q-select filled v-model="id_producto" :options="productos_disponibles"
                                        label="Buscar Producto" option-label="name" clearable use-input
                                        input-debounce="300" @filter="filterProductos" behavior="menu">
                                        <template v-slot:prepend>
                                            <q-icon name="search" color="grey-6" />
                                        </template>
                                        <template v-slot:option="scope">
                                            <q-item v-bind="scope.itemProps">
                                                <q-item-section avatar>
                                                    <q-avatar color="orange" text-color="white" icon="inventory_2" />
                                                </q-item-section>
                                                <q-item-section>
                                                    <q-item-label>{{ scope.opt.name }}</q-item-label>
                                                    <q-item-label caption>
                                                        Ref: {{ scope.opt.code_reference }} | 
                                                        Precio: ${{ new Intl.NumberFormat('es-CO').format(scope.opt.price) }}
                                                    </q-item-label>
                                                </q-item-section>
                                            </q-item>
                                        </template>
                                    </q-select>
                                </div>

                                <!-- Configuración del producto seleccionado -->
                                <transition enter-active-class="animated fadeIn">
                                    <div v-if="id_producto" class="q-mt-md">
                                        <q-card flat bordered>
                                            <q-card-section class="q-pa-md">
                                                <div class="text-subtitle1 text-weight-bold text-grey-8 q-mb-md">
                                                    {{ id_producto.name }}
                                                </div>
                                                
                                                <div class="row q-col-gutter-md">
                                                    <div class="col-12 col-sm-4">
                                                        <q-input filled v-model.number="cantidad_producto" type="number"
                                                            label="Cantidad*" min="1" lazy-rules
                                                            :rules="[val => val > 0 || 'Debe ser mayor a 0']">
                                                            <template v-slot:prepend>
                                                                <q-icon name="format_list_numbered" color="grey-6" />
                                                            </template>
                                                        </q-input>
                                                    </div>
                                                    <div class="col-12 col-sm-4">
                                                        <q-input filled v-model.number="descuento_producto" type="number"
                                                            label="Descuento %" min="0" max="100" placeholder="0">
                                                            <template v-slot:prepend>
                                                                <q-icon name="discount" color="grey-6" />
                                                            </template>
                                                        </q-input>
                                                    </div>
                                                    <div class="col-12 col-sm-4">
                                                        <q-input filled readonly label="Subtotal" 
                                                            :model-value="'$' + calcularSubtotalProducto()">
                                                            <template v-slot:prepend>
                                                                <q-icon name="payments" color="green-6" />
                                                            </template>
                                                        </q-input>
                                                    </div>
                                                </div>

                                                <div class="row q-gutter-sm q-mt-md">
                                                    <Button v-if="op_producto == 0" @click="agregarProducto()"
                                                        :disabled="!cantidad_producto || cantidad_producto <= 0" 
                                                        color="primary" icon="add_shopping_cart" 
                                                        label="Agregar al Carrito" custom-class="col" />
                                                    <Button v-else @click="actualizarProducto()" 
                                                        color="orange" icon="check" label="Actualizar" />
                                                    <Button v-if="op_producto == 1" @click="cancelarEdicion()" 
                                                        flat color="grey-7" label="Cancelar" />
                                                </div>
                                            </q-card-section>
                                        </q-card>
                                    </div>
                                </transition>

                                <!-- Lista de productos en el carrito -->
                                <div v-if="productos_seleccionados.length > 0" class="q-mt-md">
                                    <div class="text-subtitle2 text-weight-bold q-mb-sm">
                                        Productos en el Carrito ({{ productos_seleccionados.length }})
                                    </div>
                                    <q-list bordered separator>
                                        <q-item v-for="(item, index) in productos_seleccionados" :key="index" class="q-pa-md">
                                            <q-item-section avatar>
                                                <q-avatar color="primary" text-color="white" icon="inventory_2" />
                                            </q-item-section>
                                            <q-item-section>
                                                <q-item-label class="text-weight-medium">{{ item.nombre }}</q-item-label>
                                                <q-item-label caption>
                                                    Cantidad: {{ item.cantidad }} | 
                                                    Precio: ${{ new Intl.NumberFormat('es-CO').format(item.precio) }}
                                                    <span v-if="item.descuento > 0"> | Desc: {{ item.descuento }}%</span>
                                                    <span v-if="item.impuesto > 0" class="text-info"> | IVA: ${{ new Intl.NumberFormat('es-CO').format(item.impuesto) }}</span>
                                                </q-item-label>
                                            </q-item-section>
                                            <q-item-section side top>
                                                <div>
                                                    <div class="text-h6 text-weight-bold text-positive q-mb-sm">
                                                        ${{ new Intl.NumberFormat('es-CO').format(item.total || item.subtotal) }}
                                                    </div>
                                                    <div class="row q-gutter-xs justify-end">
                                                        <Button 
                                                            size="sm" 
                                                            flat 
                                                            round
                                                            dense 
                                                            icon="edit" 
                                                            color="orange"
                                                            :outline="false" :rounded="false"
                                                            @click="editarProducto(item, index)"
                                                            tooltip="Editar" :active-tooltip="true" />
                                                        <Button 
                                                            size="sm" 
                                                            flat 
                                                            round
                                                            dense 
                                                            icon="delete" 
                                                            color="red"
                                                            :outline="false" :rounded="false"
                                                            @click="eliminarProducto(index)"
                                                            tooltip="Eliminar" :active-tooltip="true" />
                                                    </div>
                                                </div>
                                            </q-item-section>
                                        </q-item>
                                    </q-list>
                                </div>

                                <q-stepper-navigation>
                                    <Button @click="step = 3" color="primary" label="Siguiente" 
                                        :disabled="productos_seleccionados.length == 0" />
                                    <Button flat @click="step = 1" color="primary" label="Atrás" custom-class="q-ml-sm" />
                                </q-stepper-navigation>
                            </q-step>

                            <!-- PASO 3: Información de Pago -->
                            <q-step :name="3" title="Información de Pago" icon="payment" :done="step > 3">
                                <div class="text-h6 text-weight-bold text-grey-9 q-mb-md">Detalles del Pago</div>
                                
                                <div class="row q-col-gutter-md">
                                    <!-- Método de Pago -->
                                    <div class="col-12 col-sm-6">
                                        <q-select 
                                            filled 
                                            v-model="metodo_pago" 
                                            :options="metodos_pago"
                                            label="Método de Pago*"
                                            option-label="label"
                                            option-value="value"
                                            map-options
                                            emit-value
                                            lazy-rules
                                            :rules="[val => !!val || 'Seleccione un método de pago']">
                                            <template v-slot:prepend>
                                                <q-icon name="credit_card" color="grey-6" />
                                            </template>
                                        </q-select>
                                    </div>

                                    <!-- Forma de Pago -->
                                    <div class="col-12 col-sm-6">
                                        <q-select 
                                            filled 
                                            v-model="forma_pago" 
                                            :options="formas_pago"
                                            label="Forma de Pago*"
                                            option-label="label"
                                            option-value="value"
                                            map-options
                                            emit-value
                                            lazy-rules
                                            :rules="[val => !!val || 'Seleccione una forma de pago']">
                                            <template v-slot:prepend>
                                                <q-icon name="account_balance" color="grey-6" />
                                            </template>
                                        </q-select>
                                    </div>

                                    <!-- Observaciones -->
                                    <div class="col-12">
                                        <q-input 
                                            filled 
                                            v-model="observaciones" 
                                            label="Observaciones"
                                            type="textarea"
                                            rows="3"
                                            placeholder="Escribe observaciones adicionales (opcional)">
                                            <template v-slot:prepend>
                                                <q-icon name="notes" color="grey-6" />
                                            </template>
                                        </q-input>
                                    </div>
                                </div>

                                <q-stepper-navigation>
                                    <Button @click="step = 4" color="primary" label="Siguiente" 
                                        :disabled="!metodo_pago || !forma_pago" />
                                    <Button flat @click="step = 2" color="primary" label="Atrás" custom-class="q-ml-sm" />
                                </q-stepper-navigation>
                            </q-step>

                            <!-- PASO 4: Resumen de Venta -->
                            <q-step :name="4" title="Resumen de Venta" icon="receipt">
                                <div class="text-h6 text-weight-bold text-grey-9 q-mb-md">Resumen de la Venta</div>
                                
                                <!-- Info del Cliente -->
                                <div class="q-mb-md">
                                    <div class="text-subtitle2 text-weight-bold text-grey-7 q-mb-sm">Cliente</div>
                                    <q-card flat bordered>
                                        <q-card-section class="q-pa-md">
                                            <div class="row items-center">
                                                <q-avatar color="primary" text-color="white" size="48px" class="q-mr-md">
                                                    {{ cliente?.names?.charAt(0).toUpperCase() || 'C' }}
                                                </q-avatar>
                                                <div>
                                                    <div class="text-body1 text-weight-bold">{{ cliente?.names }}</div>
                                                    <div class="text-caption text-grey-7">{{ cliente_identificacion }}</div>
                                                </div>
                                            </div>
                                        </q-card-section>
                                    </q-card>
                                </div>

                                <!-- Productos -->
                                <div class="q-mb-md">
                                    <div class="text-subtitle2 text-weight-bold text-grey-7 q-mb-sm">
                                        Productos ({{ productos_seleccionados.length }})
                                    </div>
                                    <q-card flat bordered>
                                        <q-list separator>
                                            <q-item v-for="(item, index) in productos_seleccionados" :key="index" class="q-pa-md">
                                                <q-item-section avatar>
                                                    <q-avatar color="orange" text-color="white" icon="inventory_2" />
                                                </q-item-section>
                                                <q-item-section>
                                                    <q-item-label class="text-weight-medium">{{ item.nombre }}</q-item-label>
                                                    <q-item-label caption>
                                                        {{ item.cantidad }} × ${{ new Intl.NumberFormat('es-CO').format(item.precio) }}
                                                        <span v-if="item.descuento > 0" class="text-orange">
                                                            ({{ item.descuento }}% desc.)
                                                        </span>
                                                    </q-item-label>
                                                    <q-item-label caption v-if="item.impuesto > 0" class="text-info">
                                                        + IVA: ${{ new Intl.NumberFormat('es-CO').format(item.impuesto) }}
                                                    </q-item-label>
                                                </q-item-section>
                                                <q-item-section side>
                                                    <div class="text-body1 text-weight-bold text-positive">
                                                        ${{ new Intl.NumberFormat('es-CO').format(item.total || item.subtotal) }}
                                                    </div>
                                                </q-item-section>
                                            </q-item>
                                        </q-list>
                                    </q-card>
                                </div>

                                <!-- Totales -->
                                <q-card flat bordered class="bg-grey-2">
                                    <q-card-section class="q-pa-md">
                                        <div class="row items-center justify-between q-mb-xs">
                                            <div class="text-body2 text-grey-7">Subtotal:</div>
                                            <div class="text-body1 text-weight-medium">
                                                ${{ new Intl.NumberFormat('es-CO').format(calcularSubtotal()) }}
                                            </div>
                                        </div>
                                        <div class="row items-center justify-between q-mb-xs">
                                            <div class="text-body2 text-grey-7">Descuento Total:</div>
                                            <div class="text-body1 text-weight-medium text-orange">
                                                -${{ new Intl.NumberFormat('es-CO').format(calcularDescuentoTotal()) }}
                                            </div>
                                        </div>
                                        <div class="row items-center justify-between q-mb-sm">
                                            <div class="text-body2 text-grey-7">Impuestos (IVA):</div>
                                            <div class="text-body1 text-weight-medium text-info">
                                                ${{ new Intl.NumberFormat('es-CO').format(calcularImpuestosTotal()) }}
                                            </div>
                                        </div>
                                        <q-separator class="q-my-sm" />
                                        <div class="row items-center justify-between">
                                            <div class="text-h6 text-weight-bold">TOTAL:</div>
                                            <div class="text-h5 text-weight-bold text-positive">
                                                ${{ new Intl.NumberFormat('es-CO').format(calcularTotal()) }}
                                            </div>
                                        </div>
                                    </q-card-section>
                                </q-card>

                                <q-stepper-navigation>
                                    <Button type="submit" :loading="spinner" color="positive" 
                                        icon="check_circle" label="Completar Venta" :outline="false" />
                                    <Button flat @click="step = 3" color="primary" label="Atrás" custom-class="q-ml-sm" />
                                </q-stepper-navigation>
                            </q-step>

                        </q-stepper>

                    </q-form>
                </q-card-section>
            </q-card>
        </q-dialog>

        <q-dialog v-model="verDetalles" persistent maximized transition-show="slide-up" transition-hide="slide-down">
            <q-card class="">
                <q-bar class=" text-white q-pa-lg">
                    <div class="flex items-center">
                        <q-icon name="receipt_long" size="1.8rem" class="q-mr-sm" />
                        <div class="text-h5 font-weight-medium">DETALLE DE VENTA</div>
                    </div>
                    <q-space />
                    <Button dense flat icon="close" size="1.6rem" v-close-popup :outline="false" :rounded="false"
                        tooltip="Cerrar" :active-tooltip="true" />
                </q-bar>

                <q-card-section class="q-pa-xl bg-grey-1">
                    <!-- Cards de información superior -->
                    <div class="row q-gutter-lg q-mb-xl">
                        <q-card class="col bg-white q-pa-lg shadow-8 rounded-borders">
                            <q-card-section class="text-center q-pa-md">
                                <div class="bg-blue-100 rounded-full inline-flex p-3 q-mb-md">
                                    <q-icon name="person" size="2.5rem" color="primary" />
                                </div>
                                <div class="text-subtitle1 text-grey-6 q-mb-xs">Cliente</div>
                                <div class="text-h4 text-weight-bold text-dark">{{ nombre_cliente }}</div>
                            </q-card-section>
                        </q-card>

                        <q-card class="col bg-white q-pa-lg shadow-8 rounded-borders">
                            <q-card-section class="text-center q-pa-md">
                                <div class="bg-orange-100 rounded-full inline-flex p-3 q-mb-md">
                                    <q-icon name="event" size="2.5rem" color="orange" />
                                </div>
                                <div class="text-subtitle1 text-grey-6 q-mb-xs">Fecha de Venta</div>
                                <div class="text-h5 text-weight-bold text-dark q-mb-xs">
                                    {{ new Date(fecha_venta).toLocaleDateString("es-CO") }}
                                </div>
                                <div class="text-body2 text-grey-5">
                                    {{ new Date(fecha_venta).toLocaleTimeString('es-CO', {
                                        hour: '2-digit',
                                        minute: '2-digit'
                                    }) }}
                                </div>
                            </q-card-section>
                        </q-card>

                        <q-card class="col bg-white q-pa-lg shadow-8 rounded-borders">
                            <q-card-section class="text-center q-pa-md">
                                <div class="bg-green-100 rounded-full inline-flex p-3 q-mb-md">
                                    <q-icon name="payments" size="2.5rem" color="green-6" />
                                </div>
                                <div class="text-subtitle1 text-grey-6 q-mb-xs">Total de Venta</div>
                                <div class="text-h3 text-weight-bold text-green-6">
                                    ${{ new Intl.NumberFormat('es-CO').format(total_venta) }}
                                </div>
                            </q-card-section>
                        </q-card>
                    </div>

                    <!-- Tabla de productos -->
                    <q-card class="bg-white shadow-12 rounded-borders overflow-hidden">
                        <q-card-section class="bg-gradient-to-r from-primary/5 to-blue-50 q-pa-lg border-b">
                            <div class="text-h5 text-primary text-weight-medium flex items-center">
                                <q-icon name="inventory_2" size="1.8rem" class="q-mr-sm" />
                                Productos Vendidos
                                <q-chip
                                    :label="`${rows_detelle_venta.length} ${rows_detelle_venta.length === 1 ? 'producto' : 'productos'}`"
                                    color="primary" text-color="white" size="sm" class="q-ml-md" />
                            </div>
                        </q-card-section>

                        <q-card-section class="q-pa-none">
                            <q-table :columns="column_detalle_venta" :rows="rows_detelle_venta" row-key="producto" flat
                                class="modern-table" hide-pagination>


                                <template v-slot:body-cell-referencia="props">
                                    <q-td :props="props" class="q-pa-md">
                                        {{ props.row.id.referencia }}
                                    </q-td>
                                </template>

                                <template v-slot:body-cell-producto="props">
                                    <q-td :props="props" class="q-pa-md">
                                        {{ props.row.id.nombre }}
                                    </q-td>
                                </template>

                                <template v-slot:body-cell-cantidad="props">
                                    <q-td :props="props" class="text-center">
                                        {{ props.row.cantidad }}
                                    </q-td>
                                </template>

                                <template v-slot:body-cell-precio_unitario="props">
                                    <q-td :props="props">
                                        ${{ props.row.id.precio }}
                                    </q-td>
                                </template>

                                <template v-slot:body-cell-subtotal="props">
                                    <q-td :props="props">
                                        ${{ props.row.cantidad * props.row.id.precio }}
                                    </q-td>
                                </template>
                            </q-table>
                        </q-card-section>

                        <!-- Resumen final -->
                        <q-card-section class="bg-gradient-to-r from-green-50 to-emerald-50 border-t">
                            <div class="row justify-end q-gutter-md">
                                <div class="col-md-4 col-sm-6 col-xs-12">
                                    <q-card flat class="bg-white shadow-2 rounded-borders">
                                        <q-card-section class="q-pa-lg">
                                            <div class="text-center">
                                                <div class="text-subtitle1 text-grey-6 q-mb-sm">TOTAL GENERAL</div>
                                                <div class="text-h4 text-weight-bold text-green-6">
                                                    ${{ new Intl.NumberFormat('es-CO').format(total_venta) }}
                                                </div>
                                                <q-separator class="q-my-md" />
                                                <div class="text-caption text-grey-5">
                                                    Venta realizada el {{ new
                                                        Date(fecha_venta).toLocaleDateString("es-CO") }}
                                                </div>
                                            </div>
                                        </q-card-section>
                                    </q-card>
                                </div>
                            </div>
                        </q-card-section>
                    </q-card>
                </q-card-section>
            </q-card>
        </q-dialog>
    </q-page>
</template>

<script setup>
import { ref } from 'vue';
import {getData} from "../services/apiclient.js"
import Button from '../components/button.vue';
import Table from '../components/Table.vue';
import buttonsTable from '../components/buttonsTable.vue';

// Variables principales
const loandingTable = ref(false);
const rows = ref([]);
const mostrarModal = ref(false);
const verDetalles = ref(false);
const spinner = ref(false);
const op = ref(0);
const step = ref(1);
const spinner_btn = ref(false);

const pagination = ref({
    page: 1,
    rowsPerPage: 10,
    rowsNumber: 0
});

const columns = ref([
    { name: 'cliente', label: 'Cliente', align: 'center', field: 'cliente' },
    { name: 'fecha', label: 'Fecha', align: 'center', field: 'fecha' },
    { name: 'total', label: 'Total', align: 'center', field: 'total' },
    { name: 'status', label: 'Estado', align: 'center' },
    { name: 'options', label: 'Acciones', align: 'center' }
]);

// Variables de formulario y utilidades
const clientes = ref([]);
const productos_disponibles = ref([]);
const productos_seleccionados = ref([]);
const cliente = ref(null);
const cliente_identificacion = ref('');
const cliente_email = ref('');
const cliente_telefono = ref('');
const id_producto = ref(null);
const cantidad_producto = ref(1);
const descuento_producto = ref(0);
const op_producto = ref(0);
const metodo_pago = ref(null);
const metodos_pago = [
    { label: 'Efectivo', value: 'efectivo' },
    { label: 'Tarjeta', value: 'tarjeta' },
    { label: 'Transferencia', value: 'transferencia' }
];
const forma_pago = ref(null);
const formas_pago = [
    { label: 'Contado', value: 'contado' },
    { label: 'Crédito', value: 'credito' }
];
const observaciones = ref('');

// Variables para detalle de venta
const nombre_cliente = ref('');
const fecha_venta = ref('');
const total_venta = ref(0);
const rows_detelle_venta = ref([]);
const column_detalle_venta = [
    { name: 'referencia', label: 'Referencia', align: 'center', field: 'referencia' },
    { name: 'producto', label: 'Producto', align: 'center', field: 'producto' },
    { name: 'cantidad', label: 'Cantidad', align: 'center', field: 'cantidad' },
    { name: 'precio_unitario', label: 'Precio Unitario', align: 'center', field: 'precio_unitario' },
    { name: 'subtotal', label: 'Subtotal', align: 'center', field: 'subtotal' }
];






const getClientes = async (val, update) => {
    try {
        const res = await getData(`/clients?filters[names][$startsWithi][0]=${val}`)
        update(()=> {
            clientes.value = res.data
        })

        console.log(clientes.value)
    } catch (err) {
        
    }
};

// Funciones vacías para ventas
const getPagination = (props) => {};
const getVentas = async () => {};
const showInfoVenta = (venta) => {};
const cleanInfo = () => {};
const Venta = async () => {};
const agregarProducto = () => {};
const editarProducto = (item, index) => {};
const actualizarProducto = () => {};
const cancelarEdicion = () => {};
const eliminarProducto = (index) => {};
const calcularSubtotalProducto = () => {};
const calcularSubtotal = () => {};
const calcularDescuentoTotal = () => {};
const calcularImpuestosTotal = () => {};
const calcularTotal = () => {};
const filterProductos = async (val, update) => {
    try{
        const res = await getData(`/products?filters[name][$starstWithi][0]=${val}`)
        update(()=>{
            productos_disponibles.value = res.data
        })
    }
    catch{

    }
};
const onClienteSeleccionado = (val) => {};
</script>

<style scoped>
/* Header Section */
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

.table-card {
    border-radius: 12px;
    overflow: hidden;
}

.state-chip {
    font-weight: 500;
}

/* Modal Styles */
.modern-modal {
    border-radius: 16px;
    max-width: 1200px;
}

.modal-header {
    border-bottom: 1px solid #e0e0e0;
}

.input-group {
    margin-bottom: 1rem;
}

/* Stepper personalizado */
.q-stepper {
    box-shadow: none;
    background: transparent;
}

/* Animaciones */
@keyframes fadeIn {
    from {
        opacity: 0;
        transform: translateY(-10px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

.animated.fadeIn {
    animation: fadeIn 0.3s ease-in-out;
}
</style>
