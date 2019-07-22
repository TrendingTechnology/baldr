<template>
  <div>
    <heading-title title="Aus der Cloud importieren"/>
    <ul>
      <li v-for="timeStampMsec in savedStatesDates" :key="timeStampMsec">
        {{ toLocaleDateTimeString(timeStampMsec) }}
      </li>
    </ul>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { toLocaleDateTimeString } from '../lib.js'

// Components
import HeadingTitle from './HeadingTitle.vue'

export default {
  name: 'ImportFromCloud',
  components: {
    HeadingTitle
  },
  computed: mapGetters(['savedStatesDates']),
  beforeCreate: function () {
    this.$store.dispatch('fetchSavedStatesDates')
  },
  methods: {
    toLocaleDateTimeString
  }
}
</script>
