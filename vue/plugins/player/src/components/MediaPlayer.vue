<template>
  <div class="vc_media_player" b-ui-theme="default">
    <div class="player-container">
      <div class="preview-container">
        <img
          class="preview-image"
          v-if="asset && asset.previewHttpUrl"
          :src="asset.previewHttpUrl"
        />
      </div>
      <div class="main-area" v-if="asset">
        <div class="progress-area">
          <progress-bar :src="playable" />
        </div>
        <div class="meta-data">
          <div
            v-if="sample.asset.artist"
            class="artist-safe"
            v-html="sample.artistSafe + ': '"
          />
          <div class="title-safe" v-html="sample.titleSafe" />
          <div v-if="sample.yearSafe" class="year-safe">
            ({{ sample.yearSafe }})
          </div>
        </div>
      </div>
      <p v-else>Es ist keine Medien-Datei geladen.</p>
      <div class="placeholder"></div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'

import { Sample, Asset } from '@bldr/media-resolver'

import { player } from '../plugin'
import { Playable } from '../playable'

import ProgressBar from './ProgressBar.vue'

@Component({
  components: {
    ProgressBar
  }
})
export default class MediaPlayer extends Vue {
  enqueuedUri?: string
  loadedUri?: string

  data () {
    return player.data
  }

  $refs!: {
    elapsed: HTMLElement
  }

  get playable (): Playable | undefined {
    if (this.loadedUri != null) {
      return player.getPlayable(this.loadedUri)
    }
  }

  get sample (): Sample | undefined {
    if (this.playable != null) {
      return this.playable.sample
    }
  }

  get asset (): Asset | undefined {
    if (this.sample != null) {
      return this.sample.asset
    }
  }
}
</script>

<style lang="scss">
$preview-size: 4em;
$padding: 0.2em;

.vc_media_player {
  bottom: 0;
  color: $black;
  font-size: 3vmin;
  left: 0;
  padding: $padding;
  text-align: left;

  .player-container {
    display: flex;

    .preview-container {
      height: $preview-size;

      .preview-image {
        height: $preview-size;
        object-fit: cover;
        width: $preview-size;
      }

      .preview-image,
      .video-container {
        background-color: $black;
      }

      .video-container {
        height: $preview-size;
        width: $preview-size;

        video {
          height: $preview-size;
          object-fit: contain;
          width: $preview-size;
        }
      }
    }

    .main-area {
      margin-left: $padding;
      width: 100%;

      .progress-area {
        .times {
          display: flex;
          justify-content: space-between;

          .ahead-time,
          .current-time {
            font-family: sans;
            font-size: 0.5em;
          }

          .current-time.enlarged {
            font-size: 3em;
          }
        }
      }

      .meta-data {
        font-size: 0.7em;
        font-family: $font-family-sans;
        div {
          display: inline-block;
          padding: 0 0.1em;
        }
      }
    }
    .placeholder {
      width: 2em;
    }
  }

  .close {
    position: absolute;
    right: 0.4em;
    top: 0em;
  }
}
</style>
