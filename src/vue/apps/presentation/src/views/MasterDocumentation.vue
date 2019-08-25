<template>
  <div class="master-documentation">
    <h1>Master slide “{{ masterName }}”</h1>

    <h2>Props</h2>

    <ul class="content" v-for="(spec, name) in props" :key="name">
      <li>{{ name }} <span v-if="spec.required">*</span></li>
    </ul>
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
    props () {
      return this.master.vue.props
    },
    documentation () {
      if ('documentation' in this.master) {
        return marked(this.master.documentation)
      }
      return ''
    }
  },
  created: function () {
    this.$centerVertically.set(false)
    this.$darkMode.set(false)
  }
}
</script>

<style lang="scss" scoped>
  .master-documentation {
    font-size: 1.4vw;
  }
</style>
