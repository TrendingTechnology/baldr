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
        <material-icon
          name="delete"
          @click.native="deleteStateFromRestAPI(timeStampMsec)"
        />
      </li>
    </ul>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import { toLocaleDateTimeString } from '../lib.js'

// Components
import HeadingTitle from './HeadingTitle.vue'
import MaterialIcon from './MaterialIcon.vue'

export default {
  name: 'ImportFromCloud',
  components: {
    HeadingTitle,
    MaterialIcon
  },
  computed: mapGetters(['savedStatesDates']),
  beforeCreate: function () {
    this.$store.dispatch('fetchSavedStatesDates')
  },
  methods: {
    ...mapActions(['deleteStateFromRestAPI']),
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
