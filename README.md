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
resolve(window)
  .fetch('https://httpbin.org/get?items=4&items=2')
  .json()
  .args
  .items
  .map(n => ~~n * 4)
  .forEach(n => console.log(n))
```

Test if obj exist, similar to lodash/get or optional chaining
```js
const obj = {}
exist = await resolve(obj).foo.bar().buz[28]
```

# Revocable Proxies

The library now supports optional revocable proxies using `Proxy.revocable`. When enabled, the proxy is automatically revoked once the target promise resolves, which can help with memory management.

```js
// Enable revocable mode
const result = resolve(import('node-fetch'), { revocable: true }).default

// The proxy will be revoked after the promise resolves
await result(url).then(response => console.log(response))
```

## Trade-offs

**Default mode (non-revocable):**
- ✓ Elegant chaining without `.then()` calls
- ✓ Proxy can be used indefinitely
- ✗ Proxy objects stay in memory

**Revocable mode:**
- ✓ Memory efficient (proxy is cleaned up after resolution)
- ✓ Prevents accidental usage after resolution
- ✗ Loses the ability to chain after initial resolution
- ✗ Cannot use the elegant syntax for complex promise chains

For most use cases, the default non-revocable mode is recommended to maintain the elegant chaining syntax.
