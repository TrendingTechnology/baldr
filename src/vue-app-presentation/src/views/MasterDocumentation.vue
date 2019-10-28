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
          {{ name }}
          <span v-if="spec.required">*</span>
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
  methods: {
    openExample () {
      this.$store.dispatch('openPresentation', this.master.example).then(() => {
        this.$router.push('/slides')
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
