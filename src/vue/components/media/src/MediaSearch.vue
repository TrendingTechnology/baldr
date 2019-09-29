<template>
  <div class="media-search">
    <dynamic-select
      :options="composer"
      @input="onInput"
      v-model="selectedComposer"
      @search="searchDebounced"
    />

  </div>
</template>

<script>
import { DynamicSelect } from '@bldr/vue-component-dynamic-select'
// https://codeburst.io/throttling-and-debouncing-in-javascript-646d076d0a44

// ES6
function debounced(delay, fn) {
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
}

function search (text) {
  console.log(text)
}


export default {
  name: 'MediaSearch',
  components: {
    DynamicSelect
  },
  data: function () {
    return {
      selectedComposer: {},
      composer: [
        {
          id: 1,
          name: 'Joseph Haydn'
        },
        {
          id: 2,
          name: 'Wolfgang Amadeus Mozart'
        },
        {
          id: 3,
          name: 'Ludwig van Beethoven'
        }
      ]
    }
  },
  methods: {
    onInput () {
      console.log(this.selectedComposer.name)
    },
    search (text) {
      console.log(text)
    },
    searchDebounced: debounced(400, search)
  }
}
</script>

