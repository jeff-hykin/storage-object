const { reactive } = require("@vue/reactivity")
const { watch } = require("@vue-reactivity/watch")

const localStorage = window.localStorage

const coreObject = {}
const storageObject = module.exports = new Proxy(coreObject, {
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
    },
})