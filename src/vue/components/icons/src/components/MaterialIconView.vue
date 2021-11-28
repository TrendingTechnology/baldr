<template>
  <main class="vc_material_icon_view">
    <h1>Icons</h1>

    <section class="available-icons">
      <!-- Available icons -->
      <h2>Alle Icons</h2>

      <div class="columns">
        <p v-for="icon in icons" :key="icon" :name="icon">
          <material-icon :size="size" :name="icon" />
          <span class="description">{{ icon }}</span>
        </p>
      </div>
    </section>

    <h2>As a link</h2>
    <material-icon
      href="https://de.wikipedia.org/wiki/Cloud_Computing"
      :size="size"
      name="cloud"
    />

    <h2>Outlines</h2>
    <p>
      <code>icon</code>:
      <material-icon outline="icon" :size="size" name="cloud" />
    </p>

    <p>
      <code>circle</code>:
      <material-icon outline="circle" :size="size" name="cloud" />
    </p>

    <p>
      <code>square</code>:
      <material-icon outline="square" :size="size" name="cloud" />
    </p>

    <h2>Display</h2>

    <p>
      <code>normal</code>:
      <material-icon display="normal" :size="size" name="cloud" />
    </p>

    <p>
      <code>disabled</code>:
      <material-icon display="disabled" :size="size" name="cloud" />
    </p>

    <p>
      <code>show-on-hover</code>:
      <material-icon display="show-on-hover" :size="size" name="cloud" />
    </p>

    <h2>Warning</h2>
    <material-icon class="red" :size="size" name="xxx" />
  </main>
</template>

<script lang="ts">
import { icons } from '@bldr/icons'
import { Component, Vue } from 'vue-property-decorator'

@Component
export default class MaterialIconView extends Vue {
  size = '2.5vw'

  get icons (): string[] {
    return icons
  }
}
</script>

<style lang="scss" scoped>
.vc_material_icon_view {
  .available-icons {
    .columns {
      columns: 3;
    }

    .description {
      margin-left: 1vw;
    }

    .baldr-icons {
      transform: translate(0, 0.5vw);
    }
  }
}
</style>
