<template>
  <div class="vc_master_documentation main-app-padding" b-ui-theme="default">
    <h1>
      Master-Folie „{{ displayName }}“ (<code>{{ masterName }}</code
      >)
    </h1>

    <section v-html="description" />

    <section>
      <h2>Felder</h2>

      <ul class="content">
        <li v-for="(field, fieldName) in fields" :key="fieldName">
          <master-field :fieldName="fieldName" :field="field"></master-field>
        </li>
      </ul>
    </section>

    <master-presentation-example :master-name="masterName" />
  </div>
</template>

<script lang="ts">
import Component from 'vue-class-component'
import Vue from 'vue'

import {
  FieldDefinitionCollection,
  masterCollection,
  Master
} from '@bldr/presentation-parser'

import MasterField from './MasterField.vue'
import MasterPresentationExample from './MasterPresentationExample.vue'

@Component({
  components: {
    MasterField,
    MasterPresentationExample
  }
})
export default class MasterDocumentation extends Vue {
  get masterName (): string {
    return this.$route.params.master
  }

  get master (): Master {
    return masterCollection[this.masterName]
  }

  get displayName (): string {
    return this.master.displayName
  }

  get fields (): FieldDefinitionCollection {
    return this.master.fieldsDefintion
  }

  get description (): string | undefined {
    if (this.master.description != null) {
      return this.master.description
    }
  }
}
</script>

<style lang="scss">
.vc_master_documentation {
  font-size: 1.4vw;
}
</style>
