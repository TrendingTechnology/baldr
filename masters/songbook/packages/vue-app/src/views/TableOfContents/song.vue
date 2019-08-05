<template>
  <tr>
    <td>
      <router-link :to="{ name: 'song', params: { songID: song.songID, slideNo: 1 }}">
        {{ song.metaData.title }}
      </router-link>
    </td>
  </tr>
</template>

<script>
export default {
  name: 'TocSong',
  props: {
    song: Object
  }
}
</script>
