<template>
  <div class="vc_drop_down_menu">
    <baldr-menu :content="menu" />
  </div>
</template>

<script>
// import VueFileToolbarMenu from 'vue-file-toolbar-menu'
import BaldrMenu from '@bldr/menu'
import menuTemplate from '@/menu.js'
import actions from '@/actions.js'
import router from '@/routes.js'

function convertMenuItem (raw) {
  const result = {}
  if (raw.role) return
  // label
  if (!raw.label) throw new Error(`Raw menu entry needs a key named label: ${raw}`)
  result.label = raw.label
  // click
  if (!raw.action) throw new Error(`Raw menu entry needs a key named action: ${raw}`)
  let click
  if (raw.action === 'openExternalUrl') {

  } else if (raw.action === 'pushRouter') {
    click = () => {
      router.push({ name: raw.arguments })
    }
  } else if (raw.action === 'executeCallback') {
    click = actions[raw.arguments]
  } else {
    throw new Error(`Unkown action for raw menu entry: ${raw}`)
  }
  result.click = click
  if (raw.keyboardShortcut) result.keyboardShortcut = raw.keyboardShortcut
  return result
}

/**
 * @param {Array.<RawMenuItem>} input - An array of raw menu items.
 * @param {Array} output - An array with processed menu items.
 *
 * @returns {Array} A recursive array of processed menu items.
 */
function traverseMenuItemList (input, output) {
  for (const rawMenuItem of input) {
    let result
    if (rawMenuItem.submenu) {
      result = {
        label: rawMenuItem.label,
        submenu: traverseMenuItemList(rawMenuItem.submenu, [])
      }
    } else {
      result = convertMenuItem(rawMenuItem)
    }
    if (result) output.push(result)
  }
  return output
}

/**
 * @param {Array} input - An array of raw menu items.
 *
 * @returns {Array} A recursive array of processed menu items.
 */
function traverseMenu (input) {
  const newMenu = []
  traverseMenuItemList(input, newMenu)
  return newMenu
}

export default {
  name: 'DropDownMenu',
  components: {
    BaldrMenu
  },
  computed: {
    menu () {
      return traverseMenu(menuTemplate)
    }
  }
}
</script>

<style lang="scss">
:root {
  --bar-font-family: "Alegreya Sans";
  --bar-menu-min-width: 400px;
}
</style>
