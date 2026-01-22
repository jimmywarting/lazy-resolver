/**
 * @template T
 * @typedef {T | Promise<T>} Awaitable
 */

/**
 * @template T
 * @typedef {T extends Promise<infer U> ? U : T} UnwrapPromise
 */

/**
 * Lazy<T> creates a "proxy promise" that:
 * — exposes T's properties
 * — exposes T's methods as callable functions
 * — unwraps Promise<T> → T at the type level
 *
 * @template T
 * @typedef {{
 *   then: Promise<T>['then'],
 * } & {
 *   [K in keyof UnwrapPromise<T>]:
 *     UnwrapPromise<T>[K] extends (...args: infer A) => infer R
 *       ? (...args: A) => Lazy<R>
 *       : Lazy<UnwrapPromise<T>[K]>
 * }} Lazy<T>
 */

/**
 * @template T
 * @param {Awaitable<T>} target
 * @param {Object} [options]
 * @param {boolean} [options.revocable=false] - If true, the proxy will be revoked once the target promise resolves
 * @returns {Lazy<T>}
 */
const resolve = (target, options = {}) => {
  const { revocable = false } = options
  
  // If revocable mode is enabled, use Proxy.revocable
  if (revocable) {
    const { proxy, revoke } = Proxy.revocable(() => {}, {
      get (noop, key) {
        if (key === 'then') {
          const p = Promise.resolve(target)
          return p.then.bind(p)
        }

        return resolve(
          Promise.resolve(target).then(obj => {
            const val = obj[key]
            return typeof val === 'function' ? val.bind(obj) : val
          }),
          options
        )
      },

      apply (noop, that, args) {
        return resolve(
          Promise.resolve(target).then(fn => {
            return fn.apply(that, args)
          }),
          options
        )
      }
    })
    
    // Revoke the proxy once the target promise resolves
    Promise.resolve(target).then(() => {
      revoke()
    }).catch(() => {
      // Still revoke on error to prevent memory leaks
      revoke()
    })
    
    return proxy
  }
  
  // Default non-revocable mode (current behavior)
  return new Proxy(() => {}, {
    get (noop, key) {
      if (key === 'then') {
        const p = Promise.resolve(target)
        return p.then.bind(p)
      }

      return resolve(
        Promise.resolve(target).then(obj => {
          const val = obj[key]
          return typeof val === 'function' ? val.bind(obj) : val
        }),
        options
      )
    },

    apply (noop, that, args) {
      return resolve(
        Promise.resolve(target).then(fn => {
          return fn.apply(that, args)
        }),
        options
      )
    }
  })
}

export { 
  resolve
}
