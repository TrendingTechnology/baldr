<template>
  <div class="vc_media_categories main-app-padding" b-ui-theme="default">
    <h2>Zwei-Buchstaben-Abkürzungen</h2>

    <table>
      <tr
        v-for="(title, abbreviation) in twoLetterAbbreviations"
        :key="abbreviation"
      >
        <td class="machine-name">{{ abbreviation }}</td>
        <td>{{ title }}</td>
      </tr>
    </table>

    <h2>Metadaten-Kategorien</h2>

    <ul>
      <media-category
        :category="category"
        :name="name"
        v-for="(category, name) in categories"
        :key="name"
      />
    </ul>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'

import { getConfig } from '@bldr/config'
import { convertCamelToSnake } from '@bldr/yaml'
import { MediaCategoriesTypes } from '@bldr/type-definitions'

import MediaCategory from './MediaCategory.vue'

const config = getConfig()

@Component({
  components: {
    MediaCategory
  },
  methods: {
    convertCamelToSnake
  }
})
export default class MediaCategories extends Vue {
  get categories (): MediaCategoriesTypes.Collection {
    return config.mediaCategories
  }

  get twoLetterAbbreviations (): Record<string, string> {
    return config.twoLetterAbbreviations
  }
}
</script>

<style lang="scss">
.vc_media_categories {
  .machine-name {
    font-family: mono;
  }

  p.description {
    margin: 0;
    padding: 0;
  }

  .derived {
    opacity: 0.4;
  }
}
</style>
