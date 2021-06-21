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

<script>
import OpenInterface from '@/components/OpenInterface'
import RecentPresentations from '@/components/RecentPresentations'

import DropDownMenu from '@/components/DropDownMenu'

export default {
  name: 'StartPage',
  components: {
    OpenInterface,
    RecentPresentations,
    DropDownMenu
  },
  mounted: function () {
    this.$style.reset()
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
      position: absolute;
      top: 1vw;
      left: 1vw;
      font-size: 0.8em;
    }
  }
</style>
