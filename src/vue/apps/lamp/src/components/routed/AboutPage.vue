<template>
  <div
    class="vc_about_page valign-wrapper main-app-fullscreen main-app-padding"
    b-ui-theme="default"
  >
    <app-info-simple
      class="valign-center"
      package-name="@bldr/lamp"
      :version="version"
    />
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'

import { AppInfoSimple } from '@bldr/components-collection'

@Component({
  components: {
    AppInfoSimple
  }
})
export default class AboutPage extends Vue {
  version = lampVersion
}
</script>

<style lang="scss">
.vc_about_page {
  th {
    text-align: left;
    padding-right: 1em;
  }
}
</style>
