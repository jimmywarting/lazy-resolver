module.exports = function resolve(target) {
  return new Proxy(() => {}, {
    get(noop, key) {
      return key === 'then' ? target.then.bind(target) : resolve(
        Promise.resolve(target).then(target => {
          if (typeof target[key] === 'function') 
            return target[key].bind(target)
          return target[key]
        })
      )
    },

    apply(noop, that, args) {
      return resolve(target.then(result => {
        return result.apply(that, args)
      }))
    }
  })
}
