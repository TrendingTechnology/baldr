// vue
export { CreateElement, VNode, VNodeData } from 'vue'
export { Component, Vue, Prop, Watch } from 'vue-property-decorator'
import { Vue as VueAlias } from 'vue-property-decorator'
export { VueAlias }

// vuex
export { mapGetters, mapActions, createNamespacedHelpers } from 'vuex'
import VuexDefault from 'vuex'
export const Vuex = VuexDefault

// vue-router
export { RouteConfig, Route, NavigationGuardNext } from 'vue-router'
import VueRouterDefault from 'vue-router'
export const VueRouter = VueRouterDefault
