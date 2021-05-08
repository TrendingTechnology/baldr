<template>
  <div
    class="vc_media_categories main-app-padding"
    b-ui-theme="default"
  >

    <h1>Metadaten-Kategorien</h1>

    <ul>
      <li v-for="(category, name) in categories" :key="name">
        {{ category.title }} (<span class="machine-name smaller">{{ name }}</span>)

        <ul>
          <li v-for="(prop, propName) in category.props" :key="propName">
            {{ prop.title }} (<span class="machine-name smaller">{{ convertCamelToSnake(propName) }}</span>)
            <p class="description smaller" v-if="prop.description" >
              {{ prop.description }}
            </p>
          </li>
        </ul>

      </li>
    </ul>
  </div>
</template>

<script>
import config from '@bldr/config'
import { convertCamelToSnake } from '@bldr/yaml'

export default {
  name: 'MediaCategories',
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
  }
</style>
