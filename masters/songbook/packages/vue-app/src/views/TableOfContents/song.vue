<template>
  <tr>
    <td>{{ song.metaData.title }}</td>
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
