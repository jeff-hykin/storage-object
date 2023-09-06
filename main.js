import { reactive } from "https://esm.sh/@vue/reactivity@3.3.4"
import { watch } from "https://esm.sh/@vue-reactivity/watch@0.2.0"

const localStorage = globalThis.localStorage

export const storageObject = new Proxy(localStorage, {
    get(self, key) {
        let rawValue 
        try {
            rawValue = localStorage.getItem(key)
            let value = JSON.parse(rawValue)
            if (value instanceof Object) {
                value = reactive(value)
                watch(value, (newValue)=> {
                    localStorage.setItem(key, JSON.stringify(newValue))
                })
            }
            return value
        } catch (error) {
            return rawValue
        }
    },
    set(self, key, newValue) {
        localStorage.setItem(key, JSON.stringify(newValue))
        return true
    },
    deleteProperty(self, key) {
        try {
            return localStorage.removeItem(key)
        } catch (error) {
            
        }
    },
    ownKeys(self, ...args) {
        return Object.keys(localStorage)
    },
    has(self, key) {
        return Object.keys(localStorage).includes(key)
    },
})

export default storageObject