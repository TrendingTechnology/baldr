<template>
  <li v-bind:class="{ derived: isDerived }">
    {{ prop.title }}
    (<span class="machine-name smaller">{{ convertCamelToSnake(name) }}</span>)
    <material-icon
      v-if="isWikidata"
      name="wikidata"
    />
    <p class="description smaller" v-if="prop.description" >
      {{ prop.description }}
    </p>
  </li>
</template>

<script>
import { convertCamelToSnake } from '@bldr/yaml'

export default {
  name: 'MediaCategoryProp',
  props: {
    prop: {
      type: Object
    },
    name: {
      type: String
    }
  },
  methods: {
    convertCamelToSnake
  },
  computed: {
    isDerived () {
      return this.prop.overwriteByDerived
    },
    isWikidata () {
      return this.prop.wikidata

    }
  }
}
</script>
