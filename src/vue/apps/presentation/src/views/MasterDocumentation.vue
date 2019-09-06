<template>
  <div class="master-documentation">
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

      <pre><code>{{ master.example }}</code></pre>
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
      this.$store.dispatch('openPresentation', this.master.example)
      this.$router.push('/slides')
    }
  },
  created: function () {
    this.$centerVertically.set(false)
    this.$darkMode.set(false)
    this.$overflow.set(false)
  }
}
</script>

<style lang="scss" scoped>
  .master-documentation {
    font-size: 1.4vw;
  }
</style>
