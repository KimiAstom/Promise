function Promise(callback) {
  this.promiseState = 'pending'
  this.promiseValue = ''
  let _this = this
  try {
    callback(resolve, reject)
  } catch (error) {
    reject(error)
  }

  function resolve(data) {
    if (_this.promiseState !== 'pending') return
    _this.promiseValue = data
    _this.promiseState = 'fulfilled'
    if (!_this.callback) return
    _this.callback.resolve(_this.promiseValue)

  }

  function reject(error) {
    if (_this.promiseState !== 'pending') return
    _this.promiseValue = error
    _this.promiseState = 'rejected'
    if (!_this.callback) return
    _this.callback.reject(_this.promiseValue)
  }
}


Promise.prototype.then = function (resolve, reject) {
  return new Promise((newResolve, newReject) => {
    if (this.promiseState === 'fulfilled') {
      let result = resolve(this.promiseValue)
      if (result instanceof Promise) {
        result.then(v => {
          newResolve(result.promiseValue)
        }, e => {
          newReject(result.promiseValue)
        })
      } else {
        newResolve(result)
      }
    } else if (this.promiseState === 'rejected') {
      let result = reject(this.promiseValue)
      if (result instanceof Promise) {
        result.then(v => {
          newResolve(result.promiseValue)
        }, e => {
          newReject(result.promiseValue)
        })
      } else {
        newResolve(result)
      }
    } else {
      this.callback = {
        resolve: function (data) {
          let result = resolve(data)
          if (result instanceof Promise) {
            result.then(v => {
              newResolve(result.promiseValue)
            }, e => {
              newReject(result.promiseValue)
            })
          } else {
            newResolve(result)
          }
        },
        reject: function (error) {
          let result = reject(error)
          if (result instanceof Promise) {
            result.then(v => {
              newResolve(result.promiseValue)
            }, e => {
              newReject(result.promiseValue)
            })
          } else {
            newResolve(result)
          }
        }
      }
    }
  })
}