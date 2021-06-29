import ComponentTest from './index'

declare module 'vue/types/vue' {
  interface Vue {
    $componentTest: ComponentTest
  }
}
