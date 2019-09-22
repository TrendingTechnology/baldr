<template>
  <div class="media-overview">
    <h1>Media</h1>

    <div v-if="isMedia">

      <section v-if="typeCount('audio')">
        <h2><material-icon name="file-audio" color="yellow"/>audio</h2>
        <table>
          <tbody>
            <tr
              :key="mediaFile.uri"
              @click="play(mediaFile.uri)"
              class="clickable"
              v-for="mediaFile in mediaFilesByType('audio')"
            >
              <td><img v-if="mediaFile.previewHttpUrl" :src="mediaFile.previewHttpUrl"/></td>
              <td>{{ mediaFile.titleSafe }}</td>
              <td>{{ mediaFile.mediaElement.duration | duration }}</td>
            </tr>
          </tbody>
        </table>
      </section>

      <section v-if="typeCount('video')">
        <h2><material-icon name="file-video" color="red"/>video</h2>
        <table>
          <tbody>
            <tr
              @click="play(mediaFile.uri)"
              class="clickable"
              v-for="mediaFile in mediaFilesByType('video')"
             :key="mediaFile.uri"
            >
              <td>
                <img v-if="mediaFile.previewHttpUrl" :src="mediaFile.previewHttpUrl"/>
                <material-icon v-else class="placeholder-icon" name="file-video" color="red"/>
              </td>
              <td>{{ mediaFile.titleSafe }}</td>
              <td>{{ mediaFile.mediaElement.duration | duration }}</td>
            </tr>
          </tbody>
        </table>
      </section>

      <section v-if="typeCount('image')">
        <h2><material-icon name="file-image" color="green"/>image</h2>
        <table>
          <tbody>
            <tr v-for="mediaFile in mediaFilesByType('image')" :key="mediaFile.uri">
              <td><img v-if="mediaFile.httpUrl" :src="mediaFile.httpUrl"/></td>
              <td>{{ mediaFile.titleSafe }}</td>
              <td>{{ mediaFile.mediaElement.width }} x {{ mediaFile.mediaElement.height }}</td>

            </tr>
          </tbody>
        </table>
      </section>
    </div>

    <p v-else>Keine Medien-Dateien geladen.</p>
  </div>
</template>

<script>
import { createNamespacedHelpers } from 'vuex'
const { mapGetters } = createNamespacedHelpers('media')

export default {
  name: 'MediaOverview',
  computed: mapGetters(['mediaFilesByType', 'isMedia', 'typeCount']),
  methods: {
    play (uri) {
      this.$media.player.start(uri)
    }
  }
}
</script>

<style lang="scss" scoped>
  .media-overview {
    font-size: 1.8vw;

    .clickable {
      cursor: pointer;
    }

    .clickable:hover {
      background-color: scale-color($gray, $lightness: 30%);
    }

    img {
      width: 4vw;
      height: 4vw;
      object-fit: cover;
      background-color: scale-color($gray, $lightness: -70%);
      padding: 0.3vw;
    }

    .placeholder-icon {
      width: 4vw;
      height: 4vw;
      background-color: scale-color($gray, $lightness: -70%);
      padding: 0.3vw;
      font-size: 3vw;
      text-align: center;

    }

    table {
      width: 100%;

      td {
        padding: 0.3em;
        padding-bottom: 0em;
      }

      td:first-child {
        width: 5vw;
      }

      td:last-child {
        text-align: right;
      }
    }
  }
</style>
