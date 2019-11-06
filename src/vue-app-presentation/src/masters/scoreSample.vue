<template>
  <div class="vc_score_sample_master">
    <play-button v-if="sample" :sample="sample"/>
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
  },
  enterSlide ({ newProps }) {
    if ('audio' in newProps) this.$media.player.load(newProps.audio)
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
      description: 'URI der entsprechenden Audio-Datei oder des Samples.'
    }
  },
  computed: {
    ...mapPresentationGetters(['slideCurrent']),
    ...mapMediaGetters(['mediaFileByUri', 'sampleByUri']),
    mediaFileScore () {
      return this.mediaFileByUri(this.score)
    },
    sample () {
      if (this.audio) return this.sampleByUri(this.audio)
    }
  }
}
</script>

<style lang="scss" scoped>
  .vc_score_sample_master {
    padding: 4vh 4vw;

    img {
      bottom: 0;
      left: 0;
      object-fit: contain;
      width: 92vw;
      height: 90vh;
    }

    .vc_play_button {
      position: absolute;
      bottom: 1vw;
      left: 1vw;
      z-index: 1;
    }
  }
</style>