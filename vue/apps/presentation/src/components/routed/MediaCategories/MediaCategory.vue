<template>
  <li>
    {{ category.title }}
    (<span class="machine-name smaller">{{ convertCamelToSnake(name) }}</span
    >)
    <span class="machine-name smaller" v-if="category.abbreviation"
      >[{{ category.abbreviation }}]</span
    >

    <ul>
      <media-category-prop
        :prop="prop"
        :name="propName"
        v-for="(prop, propName) in category.props"
        :key="propName"
      />
    </ul>
  </li>
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'
import { Prop } from 'vue-property-decorator'

import { convertCamelToSnake } from '@bldr/yaml'
import { MediaCategoriesTypes } from '@bldr/type-definitions'

import MediaCategoryProp from './MediaCategoryProp.vue'

@Component({
  components: {
    MediaCategoryProp
  },
  methods: {
    convertCamelToSnake
  }
})
export default class MediaCategories extends Vue {
  @Prop({
    type: Object
  })
  category!: MediaCategoriesTypes.Category

  @Prop({
    type: String
  })
  name!: string
}
</script>
