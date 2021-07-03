<template>
  <div class="vc_start_page main-app-padding main-app-fullscreen" b-ui-theme="default">

    <drop-down-menu v-if="!$isElectron"/>

    <div class="top-icon">
      <div class="logo"><material-icon color="red" name="baldr"/>Baldr</div>
      <div class="subtitle">Software im Browser für den Musikunterricht</div>
    </div>

    <open-interface/>

    <recent-presentations/>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'

import { styleConfigurator } from '@bldr/style-configurator'

import OpenInterface from '@/components/OpenInterface/index.vue'
import RecentPresentations from '@/components/RecentPresentations.vue'
import DropDownMenu from '@/components/DropDownMenu.vue'

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
}
</script>

<style lang="scss">
  .vc_start_page {
    font-size: 2vw;
    display: table;

    .vc_open_interface {
      display: table-cell;
      vertical-align: middle;
    }

    .top-icon {
      width: 100%;
      left: 0vw;
      position: absolute;
      text-align: center;
      top: 5vw;

      .logo {
        font-size: 10vw;
        font-family: $font-family-sans-small-caps;
        color: $red;
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
