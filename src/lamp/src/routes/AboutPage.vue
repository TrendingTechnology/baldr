<template>
  <div class="vc_about_page valign-wrapper main-app-fullscreen main-app-padding" b-ui-theme="default">
    <app-info-simple
      class="valign-center"
      package-name="@bldr/lamp"
      :version="lampVersion"
    />
  </div>
</template>

<script>
/* globals lampVersion */
import { AppInfoSimple } from '@bldr/components-collection'

export default {
  name: 'AboutPage',
  components: {
    AppInfoSimple
  },
  data () {
    return {
      lampVersion: lampVersion
    }
  }
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
