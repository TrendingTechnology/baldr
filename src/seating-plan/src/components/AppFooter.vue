<template>
  <footer>
    <a :href="npmPackageLink">{{ packageJson.name }}</a>
    &nbsp;
    <a :href="npmVersionLink">{{ version }}</a>
  </footer>
</template>

<script>
import packageJson from '../../package.json'

export default {
  name: 'AppFooter',
  computed: {
    packageJson () {
      return packageJson
    },
    version () {
      return this.packageJson.version
    },
    npmPackageLink () {
      return `https://www.npmjs.com/package/${this.packageJson.name}`
    },
    npmVersionLink () {
      return `https://www.npmjs.com/package/${this.packageJson.name}/v/${this.packageJson.version}`
    }
  }
}
</script>

<style scoped>
  footer {
    width: 100%;
    text-align: right;
  }

  @media print {
    footer {
      display: none;
    }
  }
</style>
