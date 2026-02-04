<template>
    <div class="row justify-center items-center window-height"
        style="background: linear-gradient(135deg, #331955 0%, #764ba2 100%);">
        <div class="flex column col-xs-11 col-sm-6 col-md-4 col-lg-3 items-center rounded-borders shadow-24 justify-center q-py-lg q-px-lg"
            style="background: #F9F8F6; border-radius: 12px; transition: all 0.3s ease;">
            <div class="text-center q-mb-sm">
                <h4 class="text-h4 q-ma-none text-weight-bold" style="color: #331955;">Bienvenido</h4>
                <p class="text-grey-7 q-mt-sm">Ingresa tus credenciales</p>
            </div>

            <q-form @submit="handleLogin()" class="full-width q-mb-sm">
                <div class="col-xs-12">
                    <q-input label="Correo electrónico" v-model="email" outlined  class="q-mb-sm"
                        placeholder="ejemplo@email.com" lazy-rules :rules="[
                            val => !!val || 'Campo requerido',
                            val => /.+@.+\..+/.test(val) || 'Correo inválido'
                        ]">
                        <template v-slot:prepend>
                            <q-icon name="email" color="primary" />
                        </template>
                    </q-input>
                </div>

                <div class="full-width q-mb-lg">
                    <q-input label="Contraseña" v-model="password" outlined 
                        :type="showPassword ? 'text' : 'password'" placeholder="Ingresa tu contraseña" lazy-rules
                        :rules="[
                            val => !!val || 'Campo requerido',
                        ]">
                        <template v-slot:prepend>
                            <q-icon name="lock" color="primary" />
                        </template>

                        <template v-slot:append>
                            <q-btn class="q-pa-none q-ma-none" @click="showPassword = !showPassword" round dense flat
                                color="primary" :icon="showPassword ? 'visibility_off' : 'visibility'" tabindex="-1" />
                        </template>
                    </q-input>
                </div>

                <Button label="Iniciar Sesión" color="primary" type="submit" custom-class="full-width q-py-sm text-weight-bold"
                    :loading="loading" :rounded="false" :disabled="loading" size="lg" :outline="false" />
            </q-form>
        </div>
    </div>
</template>

<style scoped></style>

<script setup>

import { useQuasar } from 'quasar';
import { ref } from 'vue';
import { postData } from '../services/apiclient.js';
import { usePruebasStores } from '../store/store.js';
import { useRouter } from 'vue-router';
import Button from '../components/button.vue';

const loading = ref(false)
const showPassword = ref(false)

const email = ref("")
const password = ref("")
const pruebasStore = usePruebasStores()

const $q = useQuasar()
const router = useRouter()

const notify = (message, type) => {
    $q.notify({
        message: `${message}`,
        type: `${type}`,
        position: "top",
        timeout: 2000
    })
}

const clearFields = () => {
    email.value = ""
    password.value = ""
}

const handleLogin = async () => {
    loading.value = true
    try {
        const res = await postData("/users/loginUsers", {
            email: email.value,
            password: password.value
        })

        notify(res.msg, "positive")
        pruebasStore.setToken(res.token)

        router.push("/app/home")

    }
    catch (error) {
        console.log(error);
        notify(error.response?.data?.details?.message || error.message, "negative")
    }
    finally {
        loading.value = false
        clearFields()
    }
}

</script>
