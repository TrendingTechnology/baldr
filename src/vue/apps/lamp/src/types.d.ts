import Vue, { VNode } from 'vue'

import { Configuration } from '@bldr/type-definitions'

/**
 * YAML files inside the folder
 * `vue/apps/masters/masterName/example.baldr.yml`. `masterName` is the name
 * of the master slide for example `audio.`
 */
interface ExampleMasterPresentationCollection {
  [masterName: string]: string
}

/**
 * YAML files inside the folder `vue/apps/lamp/examples`. `fileName` is the
 * basename of `fileName.baldr.yml`
 */
interface ExampleCommonPresentationCollection {
  [fileName: string]: string
}

declare global {
  const config: Configuration

  /**
   * Into string converted presentation examples.
   */
  const rawYamlExamples: {
    common: ExampleCommonPresentationCollection
    masters: ExampleMasterPresentationCollection
  }

  /**
   * This version string is imported from the package.json file.
   * using the DefinePlugin in vue.config.js
   */
  const lampVersion: string

  namespace JSX {
    // tslint:disable no-empty-interface
    interface Element extends VNode {}
    // tslint:disable no-empty-interface
    interface ElementClass extends Vue {}
    interface IntrinsicElements {
      [elem: string]: any
    }
  }
}
