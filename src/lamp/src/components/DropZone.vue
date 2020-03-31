<template>
  <div class="vc_drop_zone">
    <!-- Is not functional, trigger must be on the root div tag of the main app
    flickering, search box not working
     -->
    <div
      class="trigger-area"
      @dragend="hideDragzone"
      @dragleave="hideDragzone"
      @dragover.prevent="showDragzone"
      @drop.prevent="dropHandler">
    </div>
    <div
      b-ui-theme="default"
      id="dropzone"
      ref="dropzone"
    >
      <div class="message">
        Medien-Dateien oder eine Präsentation öffnen durch „Drag-and-Drop“ ...
      </div>
    </div>
  </div>
</template>

<script>
import { openFiles } from '@/content-file.js'

export default {
  name: 'DropZone',
  methods: {
    dropHandler (event) {
      openFiles(event.dataTransfer.files)
      this.hideDragzone()
    },
    showDragzone (event) {
      this.$refs.dropzone.style.display = 'table'
    },
    hideDragzone (event) {
      this.$refs.dropzone.style.display = 'none'
    },
  }
}
</script>

<style lang="scss">
  .vc_drop_zone {
    .trigger-area {
      box-sizing: border-box;
      height: 100vh;
      left: 0;
      position: fixed;
      top: 0;
      width: 100vw;
    }
    #dropzone {
      background: $blue;
      border: 1vw dashed scale-color($blue, $lightness: -40%);
      box-sizing: border-box;
      display: none;
      height: 100vh;
      left: 0;
      opacity: 0.7;
      position: fixed;
      top: 0;
      width: 100vw;
      z-index: 99999;

      .message {
        display: table-cell;
        font-family: $font-family-sans;
        font-size: 8vw;
        font-weight: bold;
        opacity: 1;
        text-align: center;
        vertical-align: middle;
      }
    }
  }
</style>
