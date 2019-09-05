<template>
  <div class="master-documentation">
    <h1>Master slide “{{ masterName }}”</h1>

    <section>
      <h2>Props</h2>

      <ul class="content" v-for="(spec, name) in props" :key="name">
        <li>{{ name }} <span v-if="spec.required">*</span></li>
      </ul>
    </section>

    <section v-if="master.examples">
      <h2>Examples</h2>

      <ul v-for="(example, index) in master.examples" :key="index">
        <li>
          <router-link :to="{
              name: 'master-example',
              params: {
                master: master.name,
                no: index
              }
            }"
          >
            {{ example.title }}
          </router-link>
        </li>
      </ul>
    </section>

    <section v-if="master.exampleYaml">
      <h2>YAML example</h2>

      <a @click="openExampleYaml">open</a>

      <pre><code>{{ master.exampleYaml }}</code></pre>
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
    openExampleYaml () {
      this.$store.dispatch('openPresentation', this.master.exampleYaml)
      this.$router.push('/slides')
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
