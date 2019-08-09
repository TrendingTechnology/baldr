<template>
  <div>
    <dynamic-select
      :options="composer"
      @input="onInput"
      v-model="selectedComposer"
    />
  </div>
</template>

<script>
import { DynamicSelect } from '@bldr/vue-components'

export default {
  name: 'DynamicSelectView',
  components: {
    DynamicSelect
  },
  data: function () {
    return {
      selectedComposer: {},
      composer: [
        {
          id: 1,
          name: 'Ludwig van Beethoven'
        },
        {
          id: 2,
          name: 'Wolfgang Amadeus Mozart'
        }
      ]
    }
  },
  methods: {
    onInput () {
      console.log(this.selectedComposer.name)
    }
  }
}
</script>
