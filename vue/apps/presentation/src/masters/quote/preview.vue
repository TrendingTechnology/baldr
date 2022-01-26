<template>
  <div :class="classes">
    <p class="text" v-html="text" />
    <p class="attribution" v-if="author || date">
      <span class="author" v-if="author" v-html="author" />
      <span v-if="author && date">, </span>
      <span class="date" v-if="date" v-html="date" />
      <span class="source" v-if="source" v-html="` - aus: ${this.source}`" />
    </p>
  </div>
</template>

<script lang="ts">
import Component from 'vue-class-component'
import { Prop } from 'vue-property-decorator'

import MasterPreview from '../MasterPreview.vue'

@Component
export default class QuoteMasterPreview extends MasterPreview {
  masterName = 'quote'

  @Prop({
    type: String,
    required: true
  })
  text!: string

  @Prop({
    type: String
  })
  author!: string

  @Prop({
    type: [String, Number]
  })
  date!: string

  @Prop({
    type: String
  })
  source!: string

  get classes (): string[] {
    const classes = ['vc_quote_master_preview', 'slide-preview-fullscreen']

    if (this.text.length > 400) {
      classes.push('slide-preview-valign-top')
    } else {
      classes.push('slide-preview-valign-center')
    }
    return classes
  }
}
</script>
<style lang="scss">
.vc_quote_master_preview {
  padding-left: 10%;
  padding-right: 10%;

  .text {
    font-style: italic;
  }

  .quotation-mark {
    font-family: $font-family-sans;
    font-weight: 900;
  }

  .attribution {
    font-size: 0.8em;
    text-align: right;
  }

  .author {
    font-family: $font-family-small-caps;
  }
}
</style>
