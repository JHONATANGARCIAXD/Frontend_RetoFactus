import { createRouter, createWebHashHistory } from "vue-router"
import Productos from "../views/productos.vue"
import Login from "../views/login.vue"
import Layout from "../layouts/layout.vue"
import Categorias from "../views/categorias.vue"
import Clientes from "../views/clientes.vue"
import Ventas from "../views/ventas.vue"
import Perfil from "../views/myPorfile.vue"

const routes = [
    { path: "/", component: Login },
    {
        path: "/home", component: Layout, children: [
            { path: "productos", component: Productos },
            { path: "categorias", component: Categorias },
            { path: "clientes", component: Clientes },
            {path: "ventas", component: Ventas},
            {path: "MiPerfil", component: Perfil}
        ]
    },

]


export const router = createRouter({
    history: createWebHashHistory(),
    routes
})