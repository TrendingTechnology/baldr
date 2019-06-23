<template>
  <div class="heading-title">
    <vue-headful :title="title"/>
    <h1>{{ title }}</h1>
  </div>
</template>

<script>
import vueHeadful from 'vue-headful'

export default {
  name: 'HeadingTitle',
  props: {
    title: String
  },
  components: {
    vueHeadful
  }
}
</script>
