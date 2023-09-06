import { reactive } from "https://esm.sh/@vue/reactivity@3.3.4"
import { watch } from "https://esm.sh/@vue-reactivity/watch@0.2.0"

const localStorage = globalThis.localStorage

const coreObject = {}
export default new Proxy(coreObject, {
    get(coreObject, key) {
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
    set(coreObject, key, newValue) {
        localStorage.setItem(key, JSON.stringify(newValue))
        return true
    },
})