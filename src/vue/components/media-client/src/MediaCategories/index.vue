<template>
  <div
    class="vc_media_categories main-app-padding"
    b-ui-theme="default"
  >

    <h1>Metadaten-Kategorien</h1>

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
import config from '@bldr/config'
import { convertCamelToSnake } from '@bldr/yaml'
import MediaCategory from './MediaCategory.vue'

export default {
  name: 'MediaCategories',
  components: {
    MediaCategory
  },
  computed: {
    categories () {
      return config.mediaCategories
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
