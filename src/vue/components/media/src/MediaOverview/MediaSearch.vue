<template>
  <div class="media-search">
    <dynamic-select
      :options="options"
      @input="onInput"
      v-model="mediaFile"
      @search="search"
    />

  </div>
</template>

<script>
import { DynamicSelect } from '@bldr/vue-component-dynamic-select'
import { request } from '../index.js'

export default {
  name: 'MediaSearch',
  components: {
    DynamicSelect
  },
  data: function () {
    return {
      mediaFile: {},
      options: []
    }
  },
  methods: {
    onInput () {
      const uri = `id:${this.mediaFile.id}`
      this.$media.resolve(uri).then((mediaFiles) => {
        const mediaFile = mediaFiles[uri]
        this.$router.push({
          name: 'media-file',
          params: {
            id: mediaFile.id
          }
        })
      })
    },
    search (text) {
      if (!text) return
      request.request({
        url: 'query/assets/search/id',
        method: 'get',
        params: {
          substring: text
        }
      }).then((response) => {
        this.options = response.data
      })
    }
  }
}
</script>

