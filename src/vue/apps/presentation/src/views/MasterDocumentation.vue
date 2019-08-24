<template>
  <div>
    {{ masterName }}
    <section v-html="documentation"/>
  </div>
</template>

<script>
import marked from 'marked'

export default {
  name: 'MasterDocumentation',
  computed: {
    masterName () {
      return this.$route.params.master
    },
    master () {
      return this.$masters[this.masterName]
    },
    documentation () {
      if ('documentation' in this.master) {
        return marked(this.master.documentation)
      }
      return ''
    }
  }
}
</script>
