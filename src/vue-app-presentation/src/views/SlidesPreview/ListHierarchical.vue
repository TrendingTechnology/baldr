<template>
  <ol class="vc_list_hierarchical">
    <li
      v-for="slide in slides"
      :key="slide.no"
      @click="gotToSlide(slide.no)"
      :title="`Zur Folie Nr. ${slide.no}`"
      :class="{ 'current-slide': slideCurrent.no === slide.no }"
      :style="{ paddingLeft: `${(slide.level - 1) * 3}em` }"
    >
      <div class="master-info">
        <material-icon
          :name="slide.master.icon.name"
          :color="slide.master.icon.color"
        />
        <span class="master-title"> {{ slide.master.title }}</span>
      </div>
      <div class="slide-title indent">{{ slide.title }}</div>
      <div class="plain-text indent" v-if="!previewDetail">{{ slide.plainText }}</div>
    </li>
  </ol>
</template>

<script>
import { createNamespacedHelpers } from 'vuex'
const { mapGetters } = createNamespacedHelpers('presentation')

export default {
  name: 'ListHierarchical',
  props: {
    slides: {
      type: Object
    }
  },
  mounted: function () {
    this.$styleConfig.set({
      centerVertically: false,
      overflow: false
    })
  },
  computed: mapGetters([
    'presentation',
    'slideCurrent',
    'slidesCount',
    'previewDetail'
  ]),
}
</script>

<style lang="scss" scoped>
  .vc_list_hierarchical {
    font-size: 1.5vw;
    box-sizing: border-box;
    height: 100vh;

    .indent {
      padding-left: 2.5vw;
    }

    .master-info {
      font-size: 1.5em;
    }

    h1 {
      font-size: 1.4em;
    }

    li {
      cursor: pointer;
      list-style-type: none;
      padding: 0 0.5em;

      &:hover {
        background-color: scale-color($gray, $lightness: 80%);
      }

      &.current-slide {
        background-color: scale-color($yellow, $lightness: 80%);
      }

      &.current-slide:hover {
        background-color: scale-color($yellow, $lightness: 50%);
      }

      .master-title {
        font-weight: bold;
        font-family: $font-family-sans;
      }

      .plain-text {
        font-size: 0.9em;
        color: $gray;
      }
    }
  }
</style>
