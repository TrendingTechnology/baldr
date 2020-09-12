<template>
  <footer class="vc_app_footer">
    <app-info package-name="@bldr/seating-plan" :version="version"/>

    <span v-if="apiVersion">
      <a
        href="https://baldr.friedrich.rocks/api/version"
        :title="`@bldr/rest-api (${apiVersion})`"
      ><material-icon name="cloud"/>
    </a>
    </span>
  </footer>
</template>

<script>
import packageJson from '@/../package.json'
import { mapGetters } from 'vuex'
import { AppInfo } from '@bldr/components-collection'

export default {
  name: 'AppFooter',
  components: {
    AppInfo
  },
  computed: {
    ...mapGetters(['apiVersion']),
    npmPackageLink () {
      return `https://www.npmjs.com/package/${this.packageJson.name}`
    },
    packageJson () {
      return packageJson
    },
    version () {
      return this.packageJson.version
    }
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
