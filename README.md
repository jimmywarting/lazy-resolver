# lazy-resolver

[![Greenkeeper badge](https://badges.greenkeeper.io/jimmywarting/lazy-resolver.svg)](https://greenkeeper.io/)
Skip hoops with promises

```bash
npm install lazy-resolver
```

# Example:

```js
const resolve = require('lazy-resolver') // This is a Proxy handler
const fetch = require('node-fetch')
const utils = {fetch}

resolve(utils) // this will chain a noop function until you call then()
  .fetch('https://httpbin.org/get?items=4&items=2') // promise
  .json() // promise
  .args
  .items
  .map(n => ~~n * 4)
  .then(console.log, console.warn)
```

Do you know how lodash _.get works or angulars $parse works?
this lib is kind of like that, you can test deep objects/path
but it dose it with promises and by chaining a dummy function
to evaluate the code when a promise has been resolved
