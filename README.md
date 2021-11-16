# lazy-resolver
Skip hoops with promises

```bash
npm install lazy-resolver
```
Do you know how lodash _.get works or angulars $parse works?
this lib is kind of like that, you can test deep objects/path
but it dose it with promises and by chaining a dummy function
to evaluate the code when a promise has been resolved

# Example:

```js
const resolve = require('lazy-resolver') // This is a Proxy handler
const fetch = resolve(import('node-fetch')).default

fetch(url)
  .then(response => console.log(response))
```

Go beond what's possible and make promise chain sync-ish looking
```js
// Node variant
const fetch = resolve(import('node-fetch')).default
fetch('https://httpbin.org/get?items=4&items=2')
  .json()
  .args
  .items
  .map(n => ~~n * 4)
  .then(console.log, console.warn)

// Browser variant
const result = await resolve(window)
  .fetch('https://httpbin.org/get?items=4&items=2')
  .json()
  .args
  .items
  .map(n => ~~n * 4)
```

Test if obj exist, similar to lodash/get or optional chaining
```js
const obj = {}
exist = await resolve(obj).foo.bar().buz[28]
```
