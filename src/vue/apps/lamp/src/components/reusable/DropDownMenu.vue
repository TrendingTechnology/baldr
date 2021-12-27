<template>
  <div class="vc_drop_down_menu">
    <baldr-menu :content="menu" />
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'

// import VueFileToolbarMenu from 'vue-file-toolbar-menu'
import BaldrMenu from '@bldr/menu-webapp'
import { getWebappMenuDef } from '@bldr/menu-adapter'

import * as actions from '@/lib/actions'
import router from '@/lib/router'

@Component({
  components: {
    BaldrMenu
  }
})
export default class DropDownMenu extends Vue {
  get menu () {
    return getWebappMenuDef(router, actions)
  }
}
</script>

<style lang="scss">
:root {
  --bar-font-family: 'Alegreya Sans';
  --bar-menu-min-width: 400px;
}
</style>
