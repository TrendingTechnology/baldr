import Vue from 'vue'

import { LampTypes } from '@bldr/type-definitions'

/**
 * Store object to save the current plubic master component to be able to
 * trigger some callbacks on the component
 */
export const currentMaster = {
  publicMainComponent: Vue
}

/**
 * Validate the master specification. This function doesn’t change the
 * the input object. The input object is passed through unchanged. The
 * validation handles Typescript.
 *
 * @TODO remove
 *
 * @param masterSpec The specification of the master slide.
 *
 * @returns The unchanged object of the specification.
 */
export function validateMasterSpec (
  masterSpec: LampTypes.MasterSpec
): LampTypes.MasterSpec {
  return masterSpec
}

/**
 * Register all master components. Search for  `main.vue` and `preview.vue`
 * files in the subfolder `masters`.
 *
 * @see {@link https://github.com/chrisvfritz/vue-enterprise-boilerplate/blob/master/src/components/_globals.js}
 * @see {@link https://webpack.js.org/guides/dependency-management/#require-context}
 */
export function registerMasterComponents (): void {
  function findMasterName (fileName: string): string {
    const match = fileName.match(/\.\/([\w]+)\/.*/)
    if (match == null) {
      throw new Error(`The master name couldn’t be retrieved from ${fileName}”`)
    }
    return match[1]
  }

  const requireComponentMain = require.context(
    '../masters',
    true,
    /.+main\.vue$/
  )
  requireComponentMain.keys().forEach(fileName => {
    // ./masterName/main.vue
    const masterName = findMasterName(fileName)
    const componentMain = requireComponentMain(fileName)

    Vue.component(`${masterName}-master-main`, componentMain.default)
  })

  const requireComponentPreview = require.context(
    '../masters',
    true,
    /.+preview\.vue$/
  )
  requireComponentPreview.keys().forEach(fileName => {
    // ./masterName/preview.vue
    const masterName = findMasterName(fileName)
    const componentPreview = requireComponentPreview(fileName)
    Vue.component(`${masterName}-master-preview`, componentPreview.default)
  })
}
