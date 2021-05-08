<template>
  <div
    class="vc_media_categories main-app-padding"
    b-ui-theme="default"
  >

    <h1>Media-Categories</h1>

    <ul>
      <li v-for="(category, name) in categories" :key="name">
        {{ category.title }} (<span class="machine-name smaller">{{ name }}</span>)

        <ul>
          <li v-for="(prop, propName) in category.props" :key="propName">
            {{ prop.title }} (<span class="machine-name smaller">{{ propName }}</span>)
          </li>
        </ul>

      </li>
    </ul>
  </div>
</template>

<script>

import config from '@bldr/config'

export default {
  name: 'MediaCategories',
  computed: {
    categories () {
      return config.mediaCategories
    }
  }
}
</script>

<style lang="scss">
  .vc_media_categories {
    .machine-name {
      font-family: mono;
    }
  }
</style>
