declare module '@bldr/icons'
declare module '@bldr/shortcuts'
declare module '@bldr/modal-dialog'
declare module '@bldr/media-client'
declare module 'vue-native-websocket'
declare module '@bldr/components-collection'

/**
 * This version string is imported from the package.json file.
 * using the DefinePlugin in vue.config.js
 */
declare const lampVersion: string

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

/**
 * Into string converted presentation examples.
 */
declare const rawYamlExamples: {
  common: ExampleCommonPresentationCollection
  masters: ExampleMasterPresentationCollection
}
