<template>
    <q-layout view="hHh LpR fFf">

        <q-header elevated class="modern-header">
            <q-toolbar class="q-py-md q-px-lg">
                <q-btn dense flat round :icon="leftDrawerOpen ? 'close': 'menu'" @click="leftDrawerOpen = !leftDrawerOpen">
                    <q-tooltip class="bg-grey-9"  anchor="bottom middle">{{ leftDrawerOpen ? 'Cerrar': 'Menú' }}</q-tooltip>
                </q-btn>
                <q-toolbar-title>
                    <div class="row items-center q-gutter-md">
                        <div class="column">
                            <span class="text-h5 text-weight-bold">Reto Factus</span>
                            <span class="text-caption text-grey-3">Panel Administrativo</span>
                        </div>
                    </div>
                </q-toolbar-title>

                <q-space />

                <div class="row q-gutter-sm">
                    <q-btn flat round icon="account_circle" class="header-btn">
                        <q-tooltip class="bg-grey-9">Perfil</q-tooltip>
                        <q-menu>
                            <q-list style="min-width: 200px">
                                <q-item clickable v-close-popup to="/app/MiPerfil">
                                    <q-item-section avatar>
                                        <q-icon name="person" />
                                    </q-item-section>
                                    <q-item-section>Mi Perfil</q-item-section>
                                </q-item>
                                <q-separator />
                                <q-item clickable v-close-popup>
                                    <q-item-section avatar>
                                        <q-icon name="logout" color="negative" />
                                    </q-item-section>

                                    <q-item-section class="text-negative" @click="logout">Cerrar Sesión</q-item-section>
                                </q-item>
                            </q-list>
                        </q-menu>
                    </q-btn>
                </div>
            </q-toolbar>
        </q-header>


        <q-drawer v-model="leftDrawerOpen" :width="100" style="background-color: #190019; " side="left">

            <q-list>
                <q-item v-for="item in itemsMenu" :key="item.to" clickable v-ripple :to="item.to" class="menu-item"
                    active-class="active-menu-item">
                    <q-icon :name="item.icon" size="30px" />
                    <p>{{ item.name }}</p>
                </q-item>
            </q-list>



        </q-drawer>



        <q-page-container class="page-container bg-red">
            <router-view />
        </q-page-container>

        <q-footer class="modern-footer">
            <q-toolbar class="q-py-md q-px-lg">
                <div class="row items-center justify-center full-width">
                    <div class="row items-center q-gutter-sm">
                        <q-icon name="copyright" size="18px" />
                        <span class="text-body2">{{ fecha }} Reto Factus - Todos los derechos reservados</span>
                    </div>
                </div>
            </q-toolbar>
        </q-footer>

    </q-layout>
</template>

<script setup>
import { ref } from 'vue'
import { usePruebasStores } from '../store/store'
import { useRouter } from 'vue-router'

const pruebasStore = usePruebasStores()
const router = useRouter()

let fecha = new Date().getFullYear()

const leftDrawerOpen = ref(false)

const logout = () => {
    pruebasStore.clearToken()
    router.push('/')
}

const itemsMenu = [
    { name: 'Inicio', icon: 'home', to: '/app/home' },
    { name: 'Productos', icon: 'shopping_cart', to: '/app/productos' },
    { name: 'Categorías', icon: 'category', to: '/app/categorias' },
    { name: 'Clientes', icon: 'people', to: '/app/clientes' },
    { name: 'Ventas', icon: 'point_of_sale', to: '/app/ventas' },
]

</script>

<style scoped>
/* header */
.modern-header {
    background: linear-gradient(135deg, #331955 0%, #764ba2 100%);
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
}

.header-btn {
    transition: all 0.3s ease;
}

.header-btn:hover {
    background-color: rgba(255, 255, 255, 0.1);
    transform: translateY(-2px);
}

.menu-btn:hover {
    background-color: rgba(255, 255, 255, 0.15);
}


.drawer-header {
    padding: 20px 0;
}

.avatar-shadow {
    box-shadow: 0 8px 24px rgba(102, 126, 234, 0.3);
}

.menu-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    border-radius: 12px 0 0 12px;
    background-color: #190019;
    color: #F9F8F6;
    margin-left: 12px;
    margin-top: 20px;
}

.menu-item p {
    font-size: 10px;
    padding: 0;
    margin: 0;
    color: #F9F8F6;
}

.menu-item:not(.active-menu-item):hover {
    background-color: rgba(189, 189, 189, 0.189);
}

.active-menu-item {
    background: #F9F8F6;
    color: #190019;
    box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
}

.active-menu-item {
    color: #190019;
}

.active-menu-item p {
    color: #190019;
}

.modern-footer {
    background-color: #1F2937;
    color: #fbe4d8;
}


.page-container {
    background-color: rgba(228, 227, 227, 0.549) !important;
    min-height: 100vh !important;
}
</style>