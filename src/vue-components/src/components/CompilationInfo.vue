<template>
  <div class="compilation-info">
    <span class="important">Version:</span>
    <a :href="`https://www.npmjs.com/package/${packageName}`">
     {{ packageName }} {{ version }}
    </a>

    <span class="spacer"></span>

    <span class="important">Git revision:</span>
    <a :href="`https://github.com/Josef-Friedrich/baldr/commit/${gitHead.long}`">
     {{ gitHead.short }}<span v-if="gitHead.isDirty">-dirty</span>
    </a>

    <span class="spacer"></span>

    <span class="important">Compilation time:</span>
    {{ compilationTime }}
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

<style lang="scss" scoped>
  .compilation-info {
    bottom: 0;
    color: $gray;
    font-size: 0.8em;
    left: 0;
    opacity: 0;
    padding: 0.4vw;
    position: absolute;

    .spacer {
      display: inline-block;
      width: 1em;
    }

    &:hover {
      opacity: 1;
    }
  }
</style>
