<template>
  <div class="vc_question_master">
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
  },
  computed: {
    ...mapGetters(['slideCurrent']),
    stepNoCurrent () {
      return this.slideCurrent.renderData.stepNoCurrent
    },
    showNumbers () {
      if (this.numbers && this.questions.length > 1) {
        return true
      }
      return false
    }
  },
  methods: {
    getClassHidden (answerNo) {
      if (this.stepNoCurrent <= answerNo) {
        return 'hidden'
      }
      return ''
    }
  }
}
</script>

<style lang="scss" scoped>
  .vc_question_master {
    font-size: 3vw;
    padding: 2vw 14vw;

    p {
      margin: 0;
    }

    li {
      margin-top: 2vw;
      margin-bottom: 2vw;
      list-style-type: none;
    }

    ol {
      padding-left: 3vw;
    }

    ol.numbers li {
      list-style-type: decimal;
    }

    .answer {
      font-style: italic;
      font-size: 0.8em
    }

    .hidden {
      visibility: hidden;
    }
  }
</style>
