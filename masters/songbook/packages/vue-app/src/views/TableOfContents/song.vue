<template>
  <tr>
    <td>
      <router-link :to="{ name: 'song', params: { songID: song.songID, slideNo: 1 }}">
        {{ song.metaData.title }}
      </router-link> <material-icon name="plus-box-outline"/>
    </td>
  </tr>
</template>

<script>
import { MaterialIcon } from '@bldr/vue-components'

export default {
  name: 'TocSong',
  components: {
    MaterialIcon
  },
  props: {
    song: Object
  }
}
</script>
