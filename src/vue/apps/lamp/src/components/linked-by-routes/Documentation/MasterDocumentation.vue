<template>
  <div class="vc_master_documentation main-app-padding" b-ui-theme="default">
    <h1>Master slide “{{ masterName }}”</h1>

    <section>
      <h2>Props</h2>

      <ul class="content">
        <li v-for="(spec, name) in props" :key="name">
          <code>{{ name }}</code>
          <span
            v-if="spec.description"
            v-html="
              ': ' +
                convertMarkdownToHtml(spec.description) +
                formatPropSpec(spec)
            "
            >:</span
          >
        </li>
      </ul>
    </section>

    <section v-if="master.example">
      <h2>
        Example
        <router-link
          :to="{
            name: 'slides-preview',
            params: { presRef: `EP_master_${masterName}` }
          }"
        >
          <material-icon name="presentation" />
        </router-link>
      </h2>

      <pre><code>{{ master.exampleClean }}</code></pre>
    </section>

    <section v-html="documentation" />
  </div>
</template>

<script>
import { masterCollection } from '@bldr/lamp-core'
import { convertMarkdownToHtml } from '@bldr/markdown-to-html'

export default {
  name: 'MasterDocumentation',
  computed: {
    masterName () {
      return this.$route.params.master
    },
    master () {
      return masterCollection.get(this.masterName)
    },
    props () {
      return this.master.propsDef
    },
    documentation () {
      if ('documentation' in this.master) {
        return convertMarkdownToHtml(this.master.documentation)
      }
      return ''
    }
  },
  methods: {
    convertMarkdownToHtml,
    formatPropSpec (spec) {
      const options = []
      if (spec.required) options.push('required')
      if (spec.markup) options.push('markup')
      if (spec.assetUri) options.push('assetUri')
      if (spec.default) options.push(`default=${spec.default}`)
      if (spec.type) {
        if (spec.type.name) {
          options.push(`type=${spec.type.name}`)
        } else if (Array.isArray(spec.type)) {
          const types = []
          for (const type of spec.type) {
            types.push(type.name)
          }
          options.push(`types=${types.join(',')}`)
        }
      }

      if (options.length) {
        return ` (${options.join(', ')})`
      }
      return ''
    }
  }
}
</script>

<style lang="scss">
.vc_master_documentation {
  font-size: 1.4vw;
}
</style>
