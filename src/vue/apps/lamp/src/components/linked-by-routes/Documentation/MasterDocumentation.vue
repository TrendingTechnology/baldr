<template>
  <div class="vc_master_documentation main-app-padding" b-ui-theme="default">
    <h1>Master-Folie “{{ displayName }}” (<code>{{name}}</code>)</h1>

    <section v-html="description" />

    <section>
      <h2>Felder</h2>

      <ul class="content">
        <li v-for="(field, fieldName) in fields" :key="fieldName">
          <master-field :fieldName="fieldName" :field="field"></master-field>
        </li>
      </ul>
    </section>

    <section v-if="master.example">
      <h2>
        Beispiel-Präsentation
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
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'

import { convertMarkdownToHtml } from '@bldr/markdown-to-html'
import { LampTypes } from '@bldr/type-definitions'
import {
  masterCollection as masterCollectionNg,
  MasterWrapper,
  FieldDefinitionCollection
} from '@bldr/presentation-parser'

import { masterCollection } from '../../../masters.js'

import MasterField from './MasterField.vue'

@Component({
  methods: { convertMarkdownToHtml },
  components: {
    MasterField
  }
})
export default class MasterDocumentation extends Vue {
  get name (): string {
    return this.$route.params.master
  }

  get displayName (): string {
    return this.masterNg.displayName
  }

  get master (): LampTypes.Master {
    return masterCollection.get(this.name)
  }

  get masterNg (): MasterWrapper {
    return masterCollectionNg[this.name]
  }

  get fields (): FieldDefinitionCollection {
    return this.masterNg.fieldsDefintion
  }

  get description (): string {
    if (this.masterNg.description != null) {
      return this.masterNg.description
    }
  }
}
</script>

<style lang="scss">
.vc_master_documentation {
  font-size: 1.4vw;
}
</style>
