<template>
  <div class="media-search">
    <dynamic-select
      :options="options"
      @input="onInput"
      v-model="mediaFile"
      @search="searchDebounced"
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
    // https://codeburst.io/throttling-and-debouncing-in-javascript-646d076d0a44
    debounced(delay, fn) {
      let timerId
      return function (...args) {
        if (timerId) {
          clearTimeout(timerId)
        }
        timerId = setTimeout(() => {
          fn(...args)
          timerId = null
        }, delay)
      }
    },
    search (text) {
      if (!text) return
      request.request({
        url: 'search-in/id',
        method: 'get',
        params: {
          substring: text
        }
      }).then((response) => {
        this.options = response.data
      })
    }
  },
  created () {
    this.searchDebounced = this.debounced(400, this.search)
  }
}
</script>

