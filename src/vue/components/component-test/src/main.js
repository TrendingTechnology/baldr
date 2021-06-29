export default {
  install: function (Vue) {
    Vue.prototype.$componentTest = {
      msg: function (message) {
        console.log(message)
      }
    }
  }
}
