/* eslint-disable */

import notifications, { NotificationOptions } from 'vue-notification'

import _Vue from 'vue'

class Notification {

  Vue: typeof _Vue

  constructor(Vue: typeof _Vue) {
    this.Vue = Vue
    this.Vue.use(notifications)

    Vue.config.errorHandler = (error: Error, vm: Vue, info) => {
      this.error(error)
    }
  }

  success(text: string, title?: string) {
    const notification: NotificationOptions = {
      group: 'default',
      text,
      duration: 5000,
      type: 'success'
    }
    if (title != null) {
      notification.title = title
    }
    this.Vue.prototype.$notify(notification)
  }

  /**
   * @params An error object or a text for the notification.
   */
  error(text: string | Error, title?: string) {
    if (typeof text === 'object') {
      const error = text
      text = error.message
      title = error.name
      console.log(error) // eslint-disable-line
    }
    const notification: NotificationOptions = {
      group: 'default',
      text,
      duration: 10000,
      type: 'error'
    }
    if (title) {
      notification.title = title
    }
    this.Vue.prototype.$notify(notification)
  }
}

declare module 'vue/types/vue' {
  interface Vue {
    $showMessage: Notification
  }

  interface VueConstructor {
    $showMessage: Notification
  }
}

// export type PluginFunction<T> = (Vue: typeof _Vue, options?: T) => void;
export default {
  install(Vue: typeof _Vue, options?: any): void {
    Vue.prototype.$showMessage = new Notification(Vue)
  }
}
