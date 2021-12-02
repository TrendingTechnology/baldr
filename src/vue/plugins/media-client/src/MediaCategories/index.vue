<template>
  <div
    class="vc_media_categories main-app-padding"
    b-ui-theme="default"
  >


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
        :category=category
        :name=name
        v-for="(category, name) in categories"
        :key="name"
      />
    </ul>
  </div>
</template>

<script>
import { getConfig } from '@bldr/config'

import { convertCamelToSnake } from '@bldr/yaml'
import MediaCategory from './MediaCategory.vue'

const config = getConfig()


export default {
  name: 'MediaCategories',
  components: {
    MediaCategory
  },
  computed: {
    categories () {
      return config.mediaCategories
    },
    twoLetterAbbreviations () {
      return config.twoLetterAbbreviations
    }
  },
  methods: {
    convertCamelToSnake
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
