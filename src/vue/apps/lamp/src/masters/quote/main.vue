<template>
  <div class="vc_quote_master bigger">
    <p class="prolog" v-if="prolog" v-html="prolog" />

    <p class="text" v-html="text" />

    <p class="attribution" v-if="author || date">
      <span class="author" v-if="author" v-html="author" />
      <span v-if="author && date">, </span>
      <span class="date" v-if="date" v-html="date" />
      <span class="source" v-if="source" v-html="` - aus: ${this.source}`" />
    </p>

    <p class="epilog" v-if="epilog" v-html="epilog" />
  </div>
</template>

<script lang="ts">
import Component from 'vue-class-component'
import { Prop } from 'vue-property-decorator'

import MasterMain from '../../components/reusable/MasterMain.vue'

@Component
export default class QuoteMasterMain extends MasterMain {
  masterName = 'quote'

  @Prop({
    type: String,
    required: true
  })
  text: string

  @Prop({
    type: String
  })
  author: string

  @Prop({
    type: [String, Number]
  })
  date: string

  @Prop({
    type: String
  })
  source: string

  @Prop({
    type: String
  })
  prolog: string

  @Prop({
    type: String
  })
  epilog: string
}
</script>

<style lang="scss">
.vc_quote_master {
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

  .prolog,
  .epilog {
    font-size: 0.8em;
    opacity: 0.5;
  }
}
</style>
