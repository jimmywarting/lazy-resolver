// Example demonstrating the trade-offs of revocable vs non-revocable proxies
import { resolve } from '../index.js'

console.log('=== Demonstrating Trade-offs ===\n')

const data = {
  users: [
    { name: 'Alice', age: 25 },
    { name: 'Bob', age: 30 }
  ],
  settings: {
    theme: 'dark',
    locale: 'en'
  }
}

console.log('1. Non-revocable (default): Can chain indefinitely')
const nonRevocable = resolve(Promise.resolve(data))
await nonRevocable.users
  .filter(u => u.age > 25)
  .map(u => u.name)
  .join(', ')
  .then(result => console.log('   Result:', result))

console.log('\n2. Revocable: Proxy is revoked after resolution')
const revocableProxy = resolve(Promise.resolve(data), { revocable: true })
await revocableProxy.settings.theme.then(theme => {
  console.log('   Theme:', theme)
})

console.log('\n3. Testing error handling with revocable')
const errorData = Promise.resolve({ error: 'Test error' })
const revocableError = resolve(errorData, { revocable: true })
await revocableError.error.then(err => {
  console.log('   Error data accessed and proxy revoked:', err)
})

console.log('\n=== Trade-off Summary ===')
console.log('Non-revocable (default):')
console.log('  ✓ Elegant chaining without .then()')
console.log('  ✓ Can continue using proxy indefinitely')
console.log('  - Proxy object stays in memory')
console.log('')
console.log('Revocable:')
console.log('  ✓ Memory efficient (proxy is cleaned up)')
console.log('  ✓ Prevents accidental usage after resolution')
console.log('  - Cannot chain after initial resolution')
console.log('  - Loses elegant syntax for complex chains')
