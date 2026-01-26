import { createApp } from 'vue'
import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
import { Quasar, Notify } from 'quasar'
import '@quasar/extras/material-icons/material-icons.css'
import '@quasar/extras/material-symbols-outlined/material-symbols-outlined.css'
import 'quasar/src/css/index.sass'
import App from './App.vue'
import { router } from './routes/Routes'

const myApp = createApp(App)
const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)
myApp.use(router)

myApp.use(pinia)
myApp.use(Quasar, {
    plugins: {
        Notify
    },
})

myApp.mount('#app')