// TODO Move this type defintions to the packages
import type { ComponentTest } from '@baldr/component-test'

declare module 'vue/types/vue' {
  interface Vue {
    $componentTest: {

      /**
       * Say lol
       */
      msg: (message: string) => void
    }
  }
}
