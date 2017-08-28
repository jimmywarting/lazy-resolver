module.exports = function resolve(target) {
  return new Proxy(() => {}, {
    get(noop, key) {
      return key === 'then' ? target.then.bind(target) : resolve(
        Promise.resolve(target).then(target => 
          typeof target[key] === 'function' 
            ? target[key].bind(target)
            : target[key]
        )
      )
    },

    apply(noop, that, args) {
      return resolve(target.then(result => 
        result.apply(that, args)
      ))
    }
  })
}
