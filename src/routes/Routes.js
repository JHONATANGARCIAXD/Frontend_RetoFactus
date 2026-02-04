import { createRouter, createWebHashHistory } from "vue-router"
import Productos from "../views/productos.vue"
import Login from "../views/login.vue"
import Layout from "../layouts/layout.vue"
import Categorias from "../views/categorias.vue"
import Clientes from "../views/clientes.vue"
import Ventas from "../views/ventas.vue"
import Perfil from "../views/myPorfile.vue"
import Home from "../views/home.vue"
import NuevoCliente from "../views/nuevoCliente.vue"
import CrearProducto from "../views/crearProducto.vue"
const routes = [
    { path: "/", component: Login },
    {
        path: "/app", component: Layout, children: [
            { path: "home", component: Home },
            { path: "productos", children: [
                {path: "", component: Productos},
                {path: "newProducto", component: CrearProducto}
            ]  },

            { path: "categorias", component: Categorias },
            {
                path: "clientes", children: [
                    { path: "", component: Clientes },
                    { path: "newCliente", component: NuevoCliente },
                ]

            },

            { path: "ventas", component: Ventas },
            { path: "MiPerfil", component: Perfil }
        ]
    },

]

//  router.beforeEach(async (to, from, next) => {  

//     next()
//  })


export const router = createRouter({
    history: createWebHashHistory(),
    routes
})