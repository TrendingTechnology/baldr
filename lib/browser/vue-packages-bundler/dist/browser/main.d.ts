export { CreateElement, VNode, VNodeData, VueConstructor } from 'vue';
export { Component, Vue, Prop, Watch } from 'vue-property-decorator';
import { Vue as VueAlias } from 'vue-property-decorator';
export { VueAlias };
export { mapGetters, mapActions, createNamespacedHelpers } from 'vuex';
export declare const Vuex: {
    Store: typeof import("vuex").Store;
    install: typeof import("vuex").install;
    mapState: import("vuex").Mapper<import("vuex").Computed> & import("vuex").MapperWithNamespace<import("vuex").Computed> & import("vuex").MapperForState & import("vuex").MapperForStateWithNamespace;
    mapMutations: import("vuex").Mapper<import("vuex").MutationMethod> & import("vuex").MapperWithNamespace<import("vuex").MutationMethod> & import("vuex").MapperForMutation & import("vuex").MapperForMutationWithNamespace;
    mapGetters: import("vuex").Mapper<import("vuex").Computed> & import("vuex").MapperWithNamespace<import("vuex").Computed>;
    mapActions: import("vuex").Mapper<import("vuex").ActionMethod> & import("vuex").MapperWithNamespace<import("vuex").ActionMethod> & import("vuex").MapperForAction & import("vuex").MapperForActionWithNamespace;
    createNamespacedHelpers: typeof import("vuex").createNamespacedHelpers;
};
export { RouteConfig, Route, NavigationGuardNext } from 'vue-router';
import VueRouterDefault from 'vue-router';
export declare const VueRouter: typeof VueRouterDefault;
