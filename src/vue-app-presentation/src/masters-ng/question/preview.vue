<template>
  <div class="vc_question_master_preview">
    <h1 v-if="heading" v-html="heading"/>
    <ol :class="{ numbers: showNumbers }">
      <li
        v-for="(pair, index) in questions"
        :key="pair.question"
      >
        <p class="question" v-html="pair.question"/>
        <p v-if="pair.answer">
          …
          <span
            :class="getClassHidden(index + 1)"
            class="answer"
            v-html="pair.answer"
          />
        </p>
      </li>
    </ol>
  </div>
</template>

<script>
import { createNamespacedHelpers } from 'vuex'
import { plainText } from '@bldr/core-browser'
const { mapGetters } = createNamespacedHelpers('presentation')

export default {
  props: {
    heading: {
      type: String,
      description: 'Eine Überschrift, die über den Fragen angezeigt wird.',
      markup: true
    },
    questions: {
      type: Array,
      description: 'Eine Liste mit Objekten mit den Schlüsseln `question` and `answer`.',
      required: true,
      markup: true
    },
    numbers: {
      type: Boolean,
      description: 'Ob die Fragen nummeriert werden sollen.',
      default: true
    }
  }
}
</script>

<style lang="scss" scoped>
  .vc_question_master_preview {
  }
</style>
