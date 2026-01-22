// Example demonstrating both default and revocable modes
import { resolve } from '../index.js'

console.log('=== Default Mode (non-revocable) ===')
// Default mode: Proxy remains active after promise resolves
const obj = { 
  user: { 
    name: 'John',
    profile: {
      age: 30
    }
  } 
}

// This works - chaining continues after await
const defaultResult = resolve(Promise.resolve(obj))
await defaultResult.user.name.then(name => {
  console.log('Default mode - Name:', name)
})

console.log('\n=== Revocable Mode ===')
// Revocable mode: Proxy is revoked once promise resolves
const revocableResult = resolve(Promise.resolve(obj), { revocable: true })

// This still works because the proxy is used before the promise resolves
await revocableResult.user.profile.age.then(age => {
  console.log('Revocable mode - Age:', age)
})

console.log('\n=== Testing with Functions ===')
const api = {
  getData: () => ({ items: [1, 2, 3, 4] }),
  multiply: (x) => x * 2
}

// Default mode with function chaining
const defaultApi = resolve(Promise.resolve(api))
await defaultApi
  .getData()
  .items
  .map(n => n * 4)
  .then(result => console.log('Default mode - Mapped items:', result))

// Revocable mode with function chaining
const revocableApi = resolve(Promise.resolve(api), { revocable: true })
await revocableApi
  .getData()
  .items
  .map(n => n * 4)
  .then(result => console.log('Revocable mode - Mapped items:', result))

console.log('\n✓ All examples completed successfully')
