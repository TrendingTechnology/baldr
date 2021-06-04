<template>
  <li>
    {{ category.title }}
    (<span class="machine-name smaller">{{ convertCamelToSnake(name) }}</span>)
    <span
      class="machine-name smaller"
      v-if="category.abbreviation"
    >[{{ category.abbreviation }}]</span>

    <ul>
      <media-category-prop
        :prop=prop
        :name=propName
        v-for="(prop, propName) in category.props"
        :key="propName"
      />
    </ul>

  </li>
</template>

<script>
import { convertCamelToSnake } from '@bldr/yaml'
import MediaCategoryProp from './MediaCategoryProp.vue'

export default {
  name: 'MediaCategory',
  props: {
    category: {
      type: Object
    },
    name: {
      type: String
    }
  },
  components: {
    MediaCategoryProp
  },
  methods: {
    convertCamelToSnake
  }
}
</script>
