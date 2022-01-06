<template>
  <span class="vc_master_field">
    <code>{{ fieldName }}</code>
    <span v-if="description" v-html="description" />
    <span v-if="furtherFieldAttributes"> ({{ furtherFieldAttributes }})</span>
  </span>
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'
import { Prop } from 'vue-property-decorator'

import { convertMarkdownToHtml } from '@bldr/markdown-to-html'
import { FieldDefinition } from '@bldr/presentation-parser'

interface FieldType {
  name?: string
}

@Component
export default class MasterField extends Vue {
  @Prop({
    type: String,
    required: true
  })
  fieldName!: string

  @Prop({
    type: Object,
    required: true
  })
  field!: FieldDefinition

  get description (): string | undefined {
    if (this.field.description != null) {
      return ': ' + convertMarkdownToHtml(this.field.description)
    }
  }

  get type (): string | undefined {
    if (this.field.type == null) {
      return
    }

    if (Array.isArray(this.field.type)) {
      const types = []
      for (const type of this.field.type) {
        types.push(type.name)
      }
      return types.join(',')
    }

    const t = this.field.type as FieldType
    if (t.name != null) {
      return t.name
    }
  }

  get furtherFieldAttributes (): string | undefined {
    const options = []
    if (this.field.required != null && this.field.required) {
      options.push('required')
    }
    if (this.field.markup != null && this.field.markup) {
      options.push('markup')
    }
    if (this.field.assetUri != null && this.field.assetUri) {
      options.push('assetUri')
    }
    if (this.field.default) {
      options.push(`default=${this.field.default}`)
    }
    if (this.type != null) {
      options.push(`type=${this.type}`)
    }
    if (options.length) {
      return options.join(', ')
    }
  }
}
</script>
