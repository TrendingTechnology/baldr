import _Vue from 'vue';
declare class Notification {
    Vue: typeof _Vue;
    constructor(Vue: typeof _Vue);
    success(text: string, title?: string): void;
    /**
     * @params An error object or a text for the notification.
     */
    error(text: string | Error, title?: string): void;
}
declare module 'vue/types/vue' {
    interface Vue {
        $showMessage: Notification;
    }
    interface VueConstructor {
        $showMessage: Notification;
    }
}
export declare let showMessage: Notification;
declare const _default: {
    install(Vue: typeof _Vue): void;
};
export default _default;
