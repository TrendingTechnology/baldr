import Vue, { PluginFunction, VueConstructor } from 'vue'

// declare class DynamicSelect {
//   focus (): void
//   static install: PluginFunction<never>
// }

declare module 'vue/types/vue' {
  interface Vue {
    /**
     * Global attribute for DynamicSelect
     */
    $dynamicSelect: DynamicSelect
  }

  interface VueConstructor {
    /**
     * Global attribute for DynamicSelect
     */
    $dynamicSelect: DynamicSelect
  }
}

declare module 'vue/types/options' {
  interface ComponentOptions<V extends Vue> {
    $dynamicSelect?: DynamicSelect
  }
}

export default DynamicSelect
