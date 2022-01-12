/**
 * A selection of material design icons (https://materialdesignicons.com)
 * extended with some custom icons.
 *
 * @module @bldr/icons
 */

import _Vue from 'vue'

import ColorIcon from './components/ColorIcon.vue'
export { default as ColorIcon } from './components/ColorIcon.vue'

import ClickableIcon from './components/ClickableIcon.vue'
export { default as ClickableIcon } from './components/ClickableIcon.vue'

import MaterialIcon from './components/MaterialIcon.vue'
export { default as MaterialIcon } from './components/MaterialIcon.vue'

import PlainIcon from './components/PlainIcon.vue'
export { default as PlainIcon } from './components/PlainIcon.vue'

import VanishIcon from './components/VanishIcon.vue'
export { default as VanishIcon } from './components/VanishIcon.vue'

// export const iconNames = [
//   "account-group",
//   "account-plus",
//   "account-star",
//   "air-filter",
//   "arrow-left",
//   "baldr",
//   "chevron-down",
//   "chevron-left",
//   "chevron-right",
//   "chevron-up",
//   "close",
//   "cloud",
//   "cloud-download",
//   "cloze",
//   "counter",
//   "delete",
//   "dice-multiple",
//   "document-camera",
//   "document-camera-off",
//   "export",
//   "fadeout",
//   "file-audio",
//   "file-document",
//   "file-image",
//   "file-outline",
//   "file-presentation-box",
//   "file-tree",
//   "file-video",
//   "folder-open",
//   "fullscreen",
//   "google-spreadsheet",
//   "image",
//   "import",
//   "imslp",
//   "instrument",
//   "magnify",
//   "multi-part",
//   "musescore",
//   "music",
//   "musicbrainz",
//   "musicbrainz-recording",
//   "musicbrainz-work",
//   "notebook",
//   "open-in-new",
//   "pause",
//   "pencil",
//   "person",
//   "play",
//   "play-speed",
//   "presentation",
//   "question",
//   "quote",
//   "save",
//   "seat-outline",
//   "skip-next",
//   "skip-previous",
//   "slides",
//   "steps",
//   "table-of-contents",
//   "task",
//   "test-tube",
//   "timeline-text",
//   "update",
//   "video-switch",
//   "video-vintage",
//   "wikicommons",
//   "wikidata",
//   "wikipedia",
//   "window-open",
//   "worker",
//   "youtube"
// ]

import iconNames from './icons.json'
export { default as iconNames } from './icons.json'

export const state = {
  vanishIcons: false
}

export function validateIconName (iconName: string): true {
  if (!iconNames.includes(iconName)) {
    throw new Error(`No icon named “${iconName}” found!`)
  }
  return true
}

export function validateColorName (colorName: string): boolean {
  return [
    'white',
    'yellow',
    'orange',
    'red',
    'brown',
    'gray',
    'green',
    'blue',
    'purple',
    'black',
    //
    'white-light',
    'yellow-light',
    'orange-light',
    'red-light',
    'brown-light',
    'gray-light',
    'green-light',
    'blue-light',
    'purple-light',
    'black-light',
    //
    'white-dark',
    'yellow-dark',
    'orange-dark',
    'red-dark',
    'brown-dark',
    'gray-dark',
    'green-dark',
    'blue-dark',
    'purple-dark',
    'black-dark'
  ].includes(colorName)
}

/**
 * Hide the mouse after x seconds of inactivity.
 *
 * @param {Number} seconds
 */
export function registerMouseMoveTimeout (seconds: number = 5): void {
  let isMouseTimerSet: number | null = null

  document.addEventListener('mousemove', () => {
    if (isMouseTimerSet) {
      window.clearTimeout(isMouseTimerSet)
    }
    if (state.vanishIcons) {
      state.vanishIcons = false
    }
    isMouseTimerSet = window.setTimeout(() => {
      isMouseTimerSet = null
      state.vanishIcons = true
    }, seconds * 1000)
  })
}

const Plugin = {
  install (Vue: typeof _Vue) {
    Vue.component('clickable-icon', ClickableIcon)
    Vue.component('color-icon', ColorIcon)
    Vue.component('material-icon', MaterialIcon)
    Vue.component('plain-icon', PlainIcon)
    Vue.component('vanish-icon', VanishIcon)
    registerMouseMoveTimeout(1)
  }
}

export default Plugin
