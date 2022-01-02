<template>
  <li v-bind:class="{ derived: isDerived }">
    {{ prop.title }}
    (<span class="machine-name smaller">{{ convertCamelToSnake(name) }}</span
    >)
    <material-icon v-if="isWikidata" name="wikidata" />
    <p class="description smaller" v-if="prop.description">
      {{ prop.description }}
    </p>
  </li>
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'
import { Prop } from 'vue-property-decorator'

import { convertCamelToSnake } from '@bldr/yaml'
import { MediaCategoriesTypes } from '@bldr/type-definitions'

import MediaCategory from './MediaCategory.vue'

@Component({
  components: {
    MediaCategory
  },
  methods: {
    convertCamelToSnake
  }
})
export default class MediaCategories extends Vue {
  @Prop({
    type: Object
  })
  prop: MediaCategoriesTypes.Prop

  @Prop({
    type: String
  })
  name: string

  get isDerived (): boolean {
    return this.prop.overwriteByDerived
  }

  get isWikidata (): boolean {
    return this.prop.wikidata != null
  }
}
</script>
