# Proxy.revocable Implementation

This document explains the implementation of `Proxy.revocable` support in lazy-resolver.

## Overview

The issue requested testing `Proxy.revocable` to potentially revoke proxies once modules have loaded. This implementation provides **optional** revocable proxy support while maintaining full backward compatibility.

## Implementation Details

### API Changes

The `resolve()` function now accepts an optional `options` parameter:

```js
resolve(target, { revocable: true })
```

### Behavior

#### Default Mode (revocable: false)
- Original behavior preserved
- Proxy remains active indefinitely
- Elegant chaining works without `.then()` calls
- Best for most use cases

#### Revocable Mode (revocable: true)
- Uses `Proxy.revocable()` 
- Proxy is automatically revoked when the target promise resolves/rejects
- Memory efficient - proxy is cleaned up
- Still supports chaining during initial resolution

## Examples

See the `examples/` directory for:
- `basic-usage.js` - Basic usage of both modes
- `tradeoffs.js` - Detailed trade-off analysis
- `issue-demo.js` - Demonstrates the exact use case from the issue
- `test.js` - Comprehensive test suite

## Decision Guidance

**Use default mode (non-revocable) when:**
- You want the elegant chaining syntax without `.then()`
- The proxy will be used multiple times
- Memory usage is not a critical concern

**Use revocable mode when:**
- Memory efficiency is important
- The proxy is only needed during initial resolution
- You want to prevent accidental usage after resolution

## Testing

All tests pass for both modes:
- ✓ Property access
- ✓ Nested properties
- ✓ Function calls
- ✓ Method chaining
- ✓ Array methods
- ✓ Complex chaining scenarios
- ✓ Backward compatibility

## Conclusion

The implementation provides the flexibility requested in the issue while preserving the elegant API that makes lazy-resolver useful. The default behavior remains unchanged, ensuring no breaking changes.
