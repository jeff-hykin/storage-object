# Usage

`npm install storage-object`

```js
const storageObject = require("storage-object")

// saves it to localstorage
storageObject.user = {name:"bob"}
const bob = storageObject.user

// this also saves the change to localstorage
bob.username = "bob123"
// (reload the page and storageObject.user.username will still be "bob123")
```