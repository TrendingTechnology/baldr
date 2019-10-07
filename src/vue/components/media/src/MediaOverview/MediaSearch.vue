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
      this.$media.resolve(uri)
    },
    search (text) {
      if (!text) return
      this.$media.httpRequest.request({
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
