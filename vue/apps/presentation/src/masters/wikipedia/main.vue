<template>
  <div class="vc_wikipedia_master main-app-padding">
    <div class="title-header">
      <h1>
        Wikipedia-Artikel: <em>{{ titleWithoutUnderscores }}</em>
      </h1>
      <a :href="httpUrl">{{ linkTitle }}</a>
    </div>
    <div v-html="body" />
  </div>
</template>

<script lang="ts">
import Component from 'vue-class-component'
import { Prop, Watch } from 'vue-property-decorator'

import { wikipediaMModule } from '@bldr/presentation-parser'

import MasterMain from '../MasterMain.vue'

@Component
export default class WikipediaMasterMain extends MasterMain {
  masterName = 'wikipedia'

  data (): { body: null | string } {
    return {
      body: null
    }
  }

  @Prop({
    type: String,
    required: true
  })
  id!: string

  @Prop({
    type: String,
    required: true
  })
  title!: string

  @Prop({
    type: String
  })
  language!: string

  @Prop({
    type: Number
  })
  oldid!: number

  @Prop({
    type: String,
    required: true
  })
  httpUrl!: string

  body?: string

  get titleWithoutUnderscores (): string {
    return wikipediaMModule.formatTitleHumanReadable(this.title)
  }

  get linkTitle (): string {
    return wikipediaMModule.formatTitleForLink(this)
  }

  async created (): Promise<void> {
    await wikipediaMModule.queryHtmlBody(this.title, this.language, this.oldid)
  }

  async setBody (): Promise<void> {
    this.body = await wikipediaMModule.queryHtmlBody(
      this.title,
      this.language,
      this.oldid
    )
  }

  @Watch('id')
  onBodyChange (): void {
    this.setBody()
  }

  mounted (): void {
    this.setBody()
  }
}
</script>
<style lang="scss">
// https://de.wikipedia.org/wiki/Wikipedia:Technik/Skin/CSS/Selektoren_unter_MediaWiki
// https://de.wikipedia.org/wiki/Wikipedia:Technik/Skin/MediaWiki#wmfCSS
.vc_wikipedia_master {
  .title-header {
    display: flex;
    justify-content: space-between;

    h1 {
      margin-top: 0;
    }
  }

  // Belege fehlen
  .noprint,
    // Personendaten
    .metadata,
    // "Beethoven" redirects here. For other uses, see Beethoven (disambiguation).
    .hatnote,
    // Citations
    .reflist,
    // First Viennese School
    // - Joseph Haydn
    // - Wolfgang Amadeus Mozart
    // - Ludwig van Beethoven
    // - Franz Schubert
    .navbox,
    // Hochgestellte Zahlen zu den Zitaten
    sup.reference {
    display: none;
  }

  .tleft,
  .float-left {
    clear: left; // To avoid stacked floats
    float: left;
  }

  .tright,
  .infobox,
  .float-right {
    clear: right; // To avoid stacked floats
    float: right;
  }

  .tleft {
    margin-right: 1em;
  }

  .tright {
    margin-left: 1em;
  }

  .thumbcaption {
    font-size: 0.7em;
  }

  // Overwrite default theme
  tr {
    border: none !important;
  }
}
</style>
