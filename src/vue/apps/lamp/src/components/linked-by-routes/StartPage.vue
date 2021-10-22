<template>
  <div
    class="vc_start_page main-app-padding main-app-fullscreen"
    b-ui-theme="default"
  >
    <drop-down-menu v-if="!$isElectron" />

    <div class="top-icon">
      <div class="logo"><material-icon color="red" name="baldr" />Baldr</div>
      <div @click="tmp" cclass="subtitle">Präsentations-Software für den Schuleinsatz</div>
    </div>

    <open-interface />

    <vanish-icon name="baldr"/>

    <recent-presentations />
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import { state } from '@bldr/icons'

import { styleConfigurator } from '@bldr/style-configurator'

import OpenInterface from '@/components/reusable/OpenInterface/index.vue'
import RecentPresentations from '@/components/reusable/RecentPresentations.vue'
import DropDownMenu from '@/components/reusable/DropDownMenu.vue'

@Component({
  components: {
    OpenInterface,
    RecentPresentations,
    DropDownMenu
  }
})
export default class StartPage extends Vue {
  mounted () {
    styleConfigurator.reset()
  }

  tmp() {
    state.isMouseActive = !state.isMouseActive
  }
}
</script>

<style lang="scss">
.vc_start_page {
  display: table;
  font-size: 2vw;

  .vc_open_interface {
    display: table-cell;
    vertical-align: middle;
  }

  .top-icon {
    left: 0vw;
    position: absolute;
    text-align: center;
    top: 5vw;
    width: 100%;

    .logo {
      color: $red;
      font-family: $font-family-sans-small-caps;
      font-size: 10vw;
      font-weight: bold;
    }
  }

  .vc_drop_down_menu {
    font-size: 0.8em;
    left: 1vw;
    position: absolute;
    top: 1vw;
  }
}
</style>
