<template>
  <div class="vc_app_info" v-if="show">
    <span class="important app-info">App-Info:</span>

    <span class="spacer"></span>

    <span class="important">Version:</span>
    <a :href="`https://www.npmjs.com/package/${packageName}`">
      {{ packageName }} {{ version }}
    </a>

    <span class="spacer"></span>

    <span class="important">Git revision:</span>
    <a
      :href="`https://github.com/Josef-Friedrich/baldr/commit/${gitHead.long}`"
    >
      {{ gitHead.short }}<span v-if="gitHead.isDirty">-dirty</span>
    </a>

    <span class="spacer"></span>

    <span class="important">Compilation time:</span>
    {{ compilationTime }}

    <material-icon class="close" name="close" @click.native="toggle" />
  </div>
</template>

<script lang="ts">
/* globals compilationTime gitHead */

import Vue from 'vue'
import Component from 'vue-class-component'
import { Prop } from 'vue-property-decorator'

import { MaterialIcon } from '@bldr/icons'
import { GitHead } from '@bldr/type-definitions'

@Component({
  components: {
    MaterialIcon
  }
})
export default class AppInfo extends Vue {
  data () {
    return {
      show: false,
      gitHead: gitHead,
      compilationTime: new Date(compilationTime).toLocaleString()
    }
  }

  show!: boolean
  gitHead!: GitHead
  compilationTime: string

  @Prop({
    required: true,
    type: String
  })
  packageName!: string

  @Prop({
    required: true,
    type: String
  })
  toggle () {
    this.show = !this.show
  }

  mounted (): void {
    // Show the app info.
    this.$shortcuts.add(
      'ctrl+,',
      () => {
        this.toggle()
      },
      'Zeige Hintergrundinformationen zur Applikation'
    )
  }
}
</script>

<style lang="scss" scoped>
.vc_app_info {
  background-color: $yellow;
  bottom: 0;
  box-sizing: border-box;
  font-size: 1.1em;
  left: 0;
  padding: 0.4vw;
  position: absolute;
  text-align: left;
  width: 100%;

  .app-info {
    text-transform: uppercase;
  }

  .spacer {
    display: inline-block;
    width: 1em;
  }

  .close {
    position: absolute;
    top: 0.5em;
    right: 1em;
  }
}
</style>
