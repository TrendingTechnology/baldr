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

<script lang="ts">
import Vue from 'vue'
import { masterCollection } from '@bldr/lamp-core'
import { convertMarkdownToHtml } from '@bldr/markdown-to-html'

import { LampTypes } from '@bldr/type-definitions'

import Component from 'vue-class-component'

@Component({ methods: { convertMarkdownToHtml } })
export default class MasterDocumentation extends Vue {
  get masterName (): string {
    return this.$route.params.master
  }

  get master (): LampTypes.Master {
    return masterCollection.get(this.masterName)
  }

  get props (): LampTypes.PropsDefintion {
    return this.master.propsDef
  }

  get documentation (): string {
    if (this.master.documentation != null) {
      return convertMarkdownToHtml(this.master.documentation)
    }
    return ''
  }

  formatPropSpec (spec: LampTypes.MasterProp): string {
    const options = []
    if (spec.required != null && spec.required) {
      options.push('required')
    }
    if (spec.markup != null && spec.markup) {
      options.push('markup')
    }
    if (spec.assetUri != null && spec.assetUri) {
      options.push('assetUri')
    }
    if (spec.default) {
      options.push(`default=${spec.default}`)
    }
    if (spec.type != null) {
      if (!Array.isArray(spec.type)) {
        options.push(`type=${spec.type.name}`)
      } else {
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
</script>

<style lang="scss">
.vc_master_documentation {
  font-size: 1.4vw;
}
</style>
