<template>
  <main>
    <section class="available-icons">
      <h1>Available icons</h1>
      <p
        v-for="icon in icons"
        :key="icon"
        :name="icon"
      >
        <material-icon :size="size" :name="icon"/>
        <span class="description">{{ icon }}</span>
      </p>
    </section>

    <section class="circle-icons">
      <h1>Circle icons</h1>
      <p
        v-for="icon in icons"
        :key="icon"
        :name="icon"
      >
        <circle-icon :icon="icon"/>
      </p>
    </section>

    <h1>Warning</h1>
    <material-icon class="red" :size="size" name="xxx"/>
  </main>
</template>

<script>
import { icons } from '@bldr/vue-component-material-icon'
export default {
  name: 'MaterialIconView',
  data () {
    return {
      size: '2.5vw'
    }
  },
  computed: {
    icons () {
      return icons
    }
  }
}
</script>

<style lang="scss" scoped>
  .available-icons {
    columns: 3;

    .description {
      margin-left: 1vw;
    }

    .baldr-icons {
      transform: translate(0, 0.5vw)
    }
  }

  .circle-icons {
    columns: 2;
  }

</style>