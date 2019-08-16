<template>
  <div class="markup-sample">

    <p>{{ title }}</p>

    <div class="code"><code><pre>{{ markup }}</pre></code></div>

    <div class="rendered" v-html="markup">{{ markup }}</div>

    <hr>
  </div>
</template>

<script>
export default {
  name: 'MarkupSample',
  props: {
    title: String,
    markup: String
  }
}
</script>
<style lang="scss" scoped>
  .markup-sample {
    .code {
      font-size: 0.8em;
      background-color: scale-color($gray, $lightness: 50%);
      padding: 0.2em 1em;
    }

    .rendered {
      font-size: 1.4em;
    }
  }
</style>
