import { defineStore } from "pinia";
import { ref } from "vue";

export const usePruebasStores = defineStore("token", () => {
    let token = ref("")

    function setToken(tk) {
        token.value = tk
    }

    function clearToken() {
        localStorage.removeItem("token")
    }

    return {
        token, setToken, clearToken
    }
},
    {
        persist: true
    })