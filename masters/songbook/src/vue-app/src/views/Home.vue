<template>
  <div class="home">
    <dynamic-select
      :options="library.toDynamicSelect()"
      @input="selectSong"
      v-model="xxx"
    />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

import { DynamicSelect } from '@bldr/vue-components'

export default {
  name: 'home',
  components: {
    DynamicSelect
  },
  data: () => {
    return {
      xxx: ''
    }
  },
  computed: {
    ...mapGetters(['library'])
  },
  methods: {
    selectSong () {
      console.log('lol')
      // this.$store.dispatch('setSongCurrent', this.selectedSong.id)
      // this.$modal.hide('search')
    }
  }
}
</script>
