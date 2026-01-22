// Comprehensive tests for lazy-resolver with revocable proxy support
import { resolve } from '../index.js'

let passed = 0
let failed = 0

function test(name, fn) {
  return fn()
    .then(() => {
      console.log(`✓ ${name}`)
      passed++
    })
    .catch(err => {
      console.error(`✗ ${name}`)
      console.error(`  ${err.message}`)
      failed++
    })
}

function assertEquals(actual, expected, message) {
  const actualStr = JSON.stringify(actual)
  const expectedStr = JSON.stringify(expected)
  if (actualStr !== expectedStr) {
    throw new Error(`${message || 'Assertion failed'}: expected ${expectedStr}, got ${actualStr}`)
  }
}

console.log('Running tests...\n')

// Test 1: Basic property access (default mode)
await test('Default mode: basic property access', async () => {
  const obj = { name: 'John', age: 30 }
  const result = await resolve(Promise.resolve(obj)).name
  assertEquals(result, 'John', 'Should get name property')
})

// Test 2: Nested property access (default mode)
await test('Default mode: nested property access', async () => {
  const obj = { user: { profile: { name: 'Alice' } } }
  const result = await resolve(Promise.resolve(obj)).user.profile.name
  assertEquals(result, 'Alice', 'Should get nested property')
})

// Test 3: Function call (default mode)
await test('Default mode: function call', async () => {
  const obj = { getValue: () => 42 }
  const result = await resolve(Promise.resolve(obj)).getValue()
  assertEquals(result, 42, 'Should call function')
})

// Test 4: Array method chaining (default mode)
await test('Default mode: array method chaining', async () => {
  const obj = { items: [1, 2, 3, 4] }
  const result = await resolve(Promise.resolve(obj))
    .items
    .map(x => x * 2)
    .filter(x => x > 4)
  assertEquals(result, [6, 8], 'Should chain array methods')
})

// Test 5: Basic property access (revocable mode)
await test('Revocable mode: basic property access', async () => {
  const obj = { name: 'John', age: 30 }
  const result = await resolve(Promise.resolve(obj), { revocable: true }).name
  assertEquals(result, 'John', 'Should get name property in revocable mode')
})

// Test 6: Nested property access (revocable mode)
await test('Revocable mode: nested property access', async () => {
  const obj = { user: { profile: { name: 'Alice' } } }
  const result = await resolve(Promise.resolve(obj), { revocable: true }).user.profile.name
  assertEquals(result, 'Alice', 'Should get nested property in revocable mode')
})

// Test 7: Function call (revocable mode)
await test('Revocable mode: function call', async () => {
  const obj = { getValue: () => 42 }
  const result = await resolve(Promise.resolve(obj), { revocable: true }).getValue()
  assertEquals(result, 42, 'Should call function in revocable mode')
})

// Test 8: Array method chaining (revocable mode)
await test('Revocable mode: array method chaining', async () => {
  const obj = { items: [1, 2, 3, 4] }
  const result = await resolve(Promise.resolve(obj), { revocable: true })
    .items
    .map(x => x * 2)
    .filter(x => x > 4)
  assertEquals(result, [6, 8], 'Should chain array methods in revocable mode')
})

// Test 9: Backward compatibility - no options parameter
await test('Backward compatibility: works without options', async () => {
  const obj = { value: 'test' }
  const result = await resolve(Promise.resolve(obj)).value
  assertEquals(result, 'test', 'Should work without options parameter')
})

// Test 10: Immediate value (not a promise) - default mode
await test('Default mode: immediate value', async () => {
  const obj = { name: 'Bob' }
  const result = await resolve(obj).name
  assertEquals(result, 'Bob', 'Should work with immediate values')
})

// Test 11: Immediate value (not a promise) - revocable mode
await test('Revocable mode: immediate value', async () => {
  const obj = { name: 'Bob' }
  const result = await resolve(obj, { revocable: true }).name
  assertEquals(result, 'Bob', 'Should work with immediate values in revocable mode')
})

// Test 12: Method with arguments
await test('Method with arguments', async () => {
  const obj = { 
    multiply: (a, b) => a * b 
  }
  const result = await resolve(Promise.resolve(obj)).multiply(5, 3)
  assertEquals(result, 15, 'Should call method with arguments')
})

// Test 13: Complex chaining scenario
await test('Complex chaining scenario', async () => {
  const api = {
    getData: () => ({
      items: [
        { id: 1, value: 10 },
        { id: 2, value: 20 },
        { id: 3, value: 30 }
      ]
    })
  }
  const result = await resolve(Promise.resolve(api))
    .getData()
    .items
    .filter(item => item.value > 15)
    .map(item => item.value)
    .reduce((sum, val) => sum + val, 0)
  
  assertEquals(result, 50, 'Should handle complex chaining')
})

console.log('\n' + '='.repeat(50))
console.log(`Tests completed: ${passed} passed, ${failed} failed`)
if (failed === 0) {
  console.log('✓ All tests passed!')
} else {
  console.log(`✗ ${failed} test(s) failed`)
  process.exit(1)
}
