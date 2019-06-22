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

<style scoped>
.markup-sample .code {
  background-color: grey;
  border: 1px black solid;
}

.markup-sample .rendered {

}


</style>
