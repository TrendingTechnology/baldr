/* eslint-disable */
import notifications from 'vue-notification';
class Notification {
    constructor(Vue) {
        this.Vue = Vue;
        this.Vue.use(notifications);
        Vue.config.errorHandler = (error, vm, info) => {
            this.error(error);
        };
    }
    success(text, title) {
        const notification = {
            group: 'default',
            text,
            duration: 5000,
            type: 'success'
        };
        if (title != null) {
            notification.title = title;
        }
        this.Vue.prototype.$notify(notification);
    }
    /**
     * @params An error object or a text for the notification.
     */
    error(text, title) {
        if (typeof text === 'object') {
            const error = text;
            text = error.message;
            title = error.name;
            console.log(error); // eslint-disable-line
        }
        const notification = {
            group: 'default',
            text,
            duration: 10000,
            type: 'error'
        };
        if (title) {
            notification.title = title;
        }
        this.Vue.prototype.$notify(notification);
    }
}
export let showMessage;
// export type PluginFunction<T> = (Vue: typeof _Vue, options?: T) => void;
export default {
    install(Vue) {
        showMessage = new Notification(Vue);
        Vue.prototype.$showMessage = showMessage;
    }
};
