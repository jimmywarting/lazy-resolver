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
 * @returns {Lazy<T>}
 */
const resolve = target => {
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
        })
      )
    },

    apply (noop, that, args) {
      return resolve(
        Promise.resolve(target).then(fn => {
          return fn.apply(that, args)
        })
      )
    }
  })
}

export { 
  resolve
}
