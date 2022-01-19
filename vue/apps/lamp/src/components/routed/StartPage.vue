<template>
  <div
    class="vc_start_page main-app-padding main-app-fullscreen"
    b-ui-theme="default"
  >
    <drop-down-menu v-if="!$isElectron" />

    <clickable-icon @click.native="update()" class="gradually-appear" name="update" />

    <div class="top-icon">
      <div class="logo"><color-icon color="red" name="baldr" />Baldr</div>
      <div class="subtitle">Präsentations-Software für den Schuleinsatz</div>
    </div>

    <open-interface />

    <recent-presentations />

    <section class="add-hoc-slides">
      <router-link :to="{ name: 'camera' }"
        ><material-icon color="red" name="master-camera" outline="circle"
      /></router-link>

      <router-link :to="{ name: 'editor' }"
        ><material-icon color="blue" name="master-editor" outline="circle"
      /></router-link>
    </section>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'

import { styleConfigurator } from '@bldr/style-configurator'

import * as actions from '../../lib/actions'

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
  mounted (): void {
    styleConfigurator.reset()
  }

  update () {
    actions.update()
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

  .baldr-icon_update {
    position: absolute;
    top: 1em;
    right: 1em;
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

  .add-hoc-slides {
    bottom: 3vw;
    color: $white !important;
    left: 0;
    position: absolute;
    text-align: center;
    width: 100%;

    .baldr-icon {
      margin: 0 0.5em;
    }
  }
}
</style>
