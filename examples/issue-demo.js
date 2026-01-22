// Example demonstrating the exact use case from the issue
// This shows the elegant chaining that the issue author appreciates

import { resolve } from '../index.js'

console.log('=== Issue Example Demonstration ===\n')

// Simulate a window object with fetch
const mockWindow = {
  fetch: (url) => {
    console.log(`Fetching: ${url}`)
    return Promise.resolve({
      json: () => Promise.resolve({
        args: {
          items: ['4', '2']
        }
      })
    })
  }
}

console.log('1. Default mode (non-revocable) - Elegant chaining works!')
console.log('   This maintains the behavior the issue author likes:\n')

// This is the exact pattern from the issue - no .then() needed!
const result1 = resolve(mockWindow)
  .fetch('https://httpbin.org/get?items=4&items=2')
  .json()
  .args
  .items
  .map(n => ~~n * 4)

// Process the results
await result1.forEach(n => console.log(`   Result: ${n}`))

console.log('\n2. Revocable mode - Works during chain, but proxy is cleaned up')
console.log('   The proxy is revoked AFTER the promise resolves:\n')

const result2 = resolve(mockWindow, { revocable: true })
  .fetch('https://httpbin.org/get?items=4&items=2')
  .json()
  .args
  .items
  .map(n => ~~n * 4)

await result2.forEach(n => console.log(`   Result: ${n}`))

console.log('\n=== Key Insight ===')
console.log('Both modes work for the chaining pattern!')
console.log('The difference is what happens AFTER:')
console.log('  • Default: Proxy stays alive, can be reused')
console.log('  • Revocable: Proxy is cleaned up, better for memory')
console.log('\nFor the use case in the issue, DEFAULT MODE is recommended')
console.log('because it preserves the elegant chaining experience.')
