<template>
  <div class="media-overview">
    <h1>Media</h1>
    <ul v-if="isMedia">
      <li v-for="mediumData in media" :key="mediumData.URI">
        <material-icon :name="`file-${mediumData.type}`"/> {{ mediumData.filename }}
      </li>
    </ul>

    <p v-if="!isMedia">Keine Medien-Dateien geladen.</p>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'MediaOverview',
  computed: mapGetters(['media', 'isMedia']),
  mounted () {
    this.$styleConfig.set({
      overflow: true,
      darkMode: false,
      centerVertically: false
    })
  }
}
</script>
