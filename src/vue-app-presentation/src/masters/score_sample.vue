<template>
  <div class="vc_score_sample_master">
    <audio
      v-if="mediaFileAudio"
      :src="mediaFileAudio.httpUrl"
      controls
    />
    <img :src="mediaFileScore.httpUrl"/>
  </div>
</template>

<script>
import { createNamespacedHelpers } from 'vuex'
const mapPresentationGetters = createNamespacedHelpers('presentation').mapGetters
const mapMediaGetters = createNamespacedHelpers('media').mapGetters

const example = `
---
slides:

- score_sample:
    score: id:Foto-Savoyarden-Musikanten-mit-Murmeltier
    audio: id:Fischer-Dieskau_Marmotte
`

export const master = {
  title: 'Notenbeispiel',
  icon: 'file-audio',
  color: 'black',
  styleConfig: {
    centerVertically: true,
    darkMode: false
  },
  example,
  resolveMediaUris (props) {
    const uris = []
    uris.push(props.score)
    if ('audio' in props) uris.push(props.audio)
    return uris
  }
}

export default {
  props: {
    score: {
      type: String,
      description: 'URI zu einer Bild-Datei, dem Notenbeispiel.'
    },
    audio: {
      type: String,
      description: 'URI der entsprechenden Audio-Datei.'
    }
  },
  computed: {
    ...mapPresentationGetters(['slideCurrent']),
    ...mapMediaGetters(['mediaFileByUri']),
    mediaFileScore () {
      return this.mediaFileByUri(this.score)
    },
    mediaFileAudio () {
      if (this.audio) return this.mediaFileByUri(this.audio)
    }
  }
}
</script>

<style lang="scss" scoped>
  .vc_score_sample_master {
    padding: 4vw;

    img {
      bottom: 0;
      left: 0;
      width: 100%;
    }

    audio {
      position: absolute;
      bottom: 1vw;
      left: 1vw;
      z-index: 1;
    }
  }
</style>