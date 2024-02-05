import * as yaml from "https://deno.land/std@0.168.0/encoding/yaml.ts"
import { FileSystem, glob } from "https://deno.land/x/quickr@0.6.60/main/file_system.js"

export const createStorageObject = (path)=>{
    let hasBeenInit = false
    let cache = {}
    const initCacheIfNeeded = ()=>{
        if (!hasBeenInit) {
            hasBeenInit = true
            try {
                Object.assign(cache, yaml.parse(Deno.readTextFileSync(path)))
                if (Object.getPrototypeOf(cache) == Object.getPrototypeOf({})) {
                    console.warn(`Note: it appears the cache ${JSON.stringify(path)} was corrupted. It will be reset`)
                    FileSystem.sync.write({path, data: ""})
                }
            } catch (error) {
                FileSystem.sync.write({path, data: ""})
            }
        }
    }
    const proxyObject = new Proxy(cache, {
        get(self, key) {
            initCacheIfNeeded()
            return cache[key]
        },
        set(self, key, newValue) {
            initCacheIfNeeded()
            FileSystem.write({
                path,
                data: yaml.stringify(cache),
            })
            return true
        },
        deleteProperty(self, key) {
            initCacheIfNeeded()
            const itWasAKey = Object.hasOwn(cache, key)
            delete cache[key]
            if (itWasAKey) {
                FileSystem.write({
                    path,
                    data: yaml.stringify(cache),
                })
            }
        },
        ownKeys(self, ...args) {
            return Object.keys(cache)
        },
        has(self, key) {
            return Object.hasOwn(cache, key)
        },
    })
    return proxyObject
}