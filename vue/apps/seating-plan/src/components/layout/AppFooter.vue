<template>
  <footer class="vc_app_footer">
    <app-info package-name="@bldr/seating-plan" :version="version" />

    <span v-if="apiVersion">
      <a
        href="https://baldr.friedrich.rocks/api/version"
        :title="`@bldr/rest-api (${apiVersion})`"
        ><material-icon name="cloud" />
      </a>
    </span>
  </footer>
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'
import { mapGetters } from 'vuex'

import packageJson from '@/../package.json'
import { AppInfo } from '@bldr/components-collection'

@Component({
  components: {
    AppInfo
  },
  computed: {
    ...mapGetters(['apiVersion'])
  }
})
export default class AppFooter extends Vue {
  get npmPackageLink () {
    return `https://www.npmjs.com/package/${this.packageJson.name}`
  }

  get packageJson () {
    return packageJson
  }

  get version () {
    return this.packageJson.version
  }
}
</script>

<style lang="scss">
.vc_app_footer {
  width: 100%;
  text-align: right;
  font-size: 0.7em;

  .baldr-icons-cloud {
    color: $green;
  }

  @media print {
    display: none;
  }
}
</style>
