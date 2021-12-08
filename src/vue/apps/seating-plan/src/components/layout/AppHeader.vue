<template>
  <header class="vc_app_header">
    <vue-headful :title="title" />
    <router-link v-if="isNotHome" to="/" class="back-link" title="zurück">
      <material-icon name="arrow-left" />
    </router-link>
    <h1>{{ title }}</h1>
    <main-menu />
  </header>
</template>

<script lang="ts">
import { Component, Prop, Vue } from '@bldr/vue-packages-bundler'
import vueHeadful from 'vue-headful'

import MainMenu from '@/components/layout/MainMenu/index.vue'

@Component({
  components: {
    MainMenu,
    vueHeadful
  }
})
export default class AppHeader extends Vue {
  @Prop()
  title!: string

  get isNotHome (): boolean {
    if (this.$route.path !== '/') {
      return true
    }
    return false
  }
}
</script>

<style lang="scss">
.vc_app_header {
  display: inline-flex;
  width: 100%;
  justify-content: space-between;

  h1 {
    padding-left: 2em;
  }

  @media print {
    display: none;
  }
}
</style>
