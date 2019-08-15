<template>
  <div class="compilation-info">
    Version:
    <a :href="`https://www.npmjs.com/package/${packageName}`">
     {{ packageName }} {{ version }}
    </a>

    Git revision:
    <a :href="`https://github.com/Josef-Friedrich/baldr/commit/${gitHead.long}`">
     {{ gitHead.short }}<span v-if="gitHead.isDirty">-dirty</span>
    </a>

    Compilation time: {{ compilationTime }}
  </div>
</template>

<script>
/* globals compilationTime gitHead */

export default {
  name: 'CompilationInfo',
  props: {
    packageName: {
      required: true,
      type: String
    },
    version: {
      required: true,
      type: String
    }
  },
  data () {
    return {
      gitHead: gitHead,
      compilationTime: new Date(compilationTime).toLocaleString()
    }
  }
}
</script>

<style scoped>
  .compilation-info {
    position: absolute;
    bottom: 0;
    left: 0;
    opacity: 0;
    padding: 0.4vw;
  }

  .compilation-info:hover {
    opacity: 1;
  }
</style>
