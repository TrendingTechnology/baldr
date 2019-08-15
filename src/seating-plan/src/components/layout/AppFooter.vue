<template>
  <footer>
    <compilation-info package-name="@bldr/seating-plan" :version="version"/>

    <span v-if="apiVersion">
      <a href="https://www.npmjs.com/package/@bldr/rest-api">@bldr/rest-api ({{ apiVersion }})</a>
      &nbsp;
    </span>
    <a :href="npmPackageLink">{{ packageJson.name }} ({{ version }})</a>
  </footer>
</template>

<script>
import packageJson from '@/../package.json'
import { mapGetters } from 'vuex'
import { CompilationInfo } from '@bldr/vue-components'

export default {
  name: 'AppFooter',
  components: {
    CompilationInfo
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

<style scoped>
  footer {
    width: 100%;
    text-align: right;
    font-size: 0.7em;
  }

  @media print {
    footer {
      display: none;
    }
  }
</style>
