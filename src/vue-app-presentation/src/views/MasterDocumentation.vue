<template>
  <div class="vc_master_documentation default-padding" b-ui-theme="default">
    <h1>Master slide “{{ masterName }}”</h1>

    <section>
      <h2>Props</h2>

      <ul class="content">
        <li
          v-for="(spec, name) in props"
          :key="name"
        >
          <code>{{ name }}</code>
          <span v-if="spec.required">*</span>
          <span v-if="spec.markup"> (markup)</span>
          <span v-if="spec.description" v-html="markupToHtml(spec.description)"></span>
        </li>
      </ul>
    </section>

    <section v-if="master.example">
      <h2>Example <material-icon name="presentation" @click.native="openExample"/></h2>

      <pre><code>{{ master.exampleClean }}</code></pre>
    </section>

    <section v-html="documentation"/>
  </div>
</template>

<script>
import {  markupToHtml } from '@/lib.js'

export default {
  name: 'MasterDocumentation',
  computed: {
    masterName () {
      return this.$route.params.master
    },
    master () {
      return this.$masters.get(this.masterName)
    },
    props () {
      return this.master.vue.props
    },
    documentation () {
      if ('documentation' in this.master) {
        return markupToHtml(this.master.documentation)
      }
      return ''
    }
  },
  methods: {
    markupToHtml,
    openExample () {
      this.$store.dispatch('presentation/openPresentation', this.master.example).then(() => {
        if (this.$route.name !== 'slides') this.$router.push({ name: 'slides' })
      })
    }
  }
}
</script>

<style lang="scss" scoped>
  .vc_master_documentation {
    font-size: 1.4vw;
  }
</style>
