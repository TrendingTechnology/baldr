<template>
  <section class="vc_markup_sample">

    <h2 v-html="title">>{{ title }}</h2>

    <div class="code"><code><pre>{{ markup }}</pre></code></div>

    <div class="rendered" v-html="markup">
      {{ markup }}
    </div>

  </section>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'

@Component
export default class MarkupSample extends Vue {
  @Prop() readonly title!: string

  @Prop() readonly markup!: string
}
</script>
<style lang="scss" scoped>
  $padding: 0.2vw 2vw;
  $margin: 1vw;

  .vc_markup_sample {
    .code {
      background-color: scale-color($gray, $lightness: 70%);
      font-size: 0.8em;
      margin: $margin;
      padding: $padding;
    }

    .rendered {
      background-color: scale-color($yellow, $lightness: 90%);
      font-size: 1.4em;
      margin: $margin;
      padding: $padding;
    }
  }
</style>
