/**
 * A selection of material design icons (https://materialdesignicons.com)
 * extended with some custom icons.
 *
 * @module @bldr/icons
 */
import material from './MaterialIcon.vue'
import plain from './PlainIcon.vue'
import color from './ColorIcon.vue'
import vanish from './VanishIcon.vue'

import iconsJson from './icons.json'

export const icons = iconsJson
export const MaterialIcon = material
export const PlainIcon = plain
export const ColorIcon = color
export const VanishIcon = vanish

export const state = {
  showIcons: true
}

export function validateIconName (iconName) {
  if (!icons.includes(iconName)) {
    throw new Error(`No icon named “${iconName}” found!`)
  }
  return true
}

export function validateColorName (colorName) {
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
export function registerMouseMoveTimeout (seconds = 5) {
  let isMouseTimerSet = null

  document.addEventListener('mousemove', () => {
    if (isMouseTimerSet) {
      window.clearTimeout(isMouseTimerSet)
    }
    if (!state.isMouseActive) {
      state.showIcons = true
    }
    isMouseTimerSet = window.setTimeout(() => {
      isMouseTimerSet = null
      state.showIcons = false
    }, seconds * 1000)
  })
}

const Plugin = {
  install (Vue) {
    Vue.component('material-icon', MaterialIcon)
    Vue.component('plain-icon', PlainIcon)
    Vue.component('color-icon', ColorIcon)
    Vue.component('vanish-icon', VanishIcon)
    registerMouseMoveTimeout(1)
  }
}

export default Plugin
