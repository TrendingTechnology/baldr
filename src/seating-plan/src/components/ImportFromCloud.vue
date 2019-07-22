<template>
  <div>
    <heading-title title="Aus der Cloud importieren"/>
    <ul>
      <li
        v-for="timeStampMsec in savedStatesDates"
        :key="timeStampMsec"
      >
        <a href="#" @click.prevent="importFromRestAPI(timeStampMsec)">
          {{ toLocaleDateTimeString(timeStampMsec) }}
        </a>
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
    toLocaleDateTimeString,
    importFromRestAPI (timeStampMsec) {
      this.$store.dispatch('importFromRestAPI', timeStampMsec).then((result) => {
        const date = toLocaleDateTimeString(timeStampMsec)
        this.$notify({
          type: 'success',
          text: date
        })
      })
    }
  }
}
</script>
