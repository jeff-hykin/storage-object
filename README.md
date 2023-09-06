# Usage

```js
import storageObject from "https://deno.land/x/storage_object@0.0.1.0/main.js"

// saves it to localstorage
storageObject.user = {name:"bob"}
const bob = storageObject.user

// this also saves the change to localstorage
bob.username = "bob123"

// (reload the page and storageObject.user.username will still be "bob123")
```