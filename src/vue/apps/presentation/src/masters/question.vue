<template>
  <div class="question-master">
    <ul :class="{ numbers: showNumbers }">
      <li v-for="(pair, index) in questions" :key="pair.question">
        <p class="question">{{ pair.question }}</p>
        <p v-if="pair.answer" :class="getClassHidden(index + 1)" class="answer">{{ pair.answer }}</p>
      </li>
    </ul>
  </div>
</template>

<script>

const example = `
---
slides:
  - question:
      - question: Question one?
        answer: Answer one
      - question: Question two?
        answer: Answer two
      - question: Question three?
        answer: Answer three

  - question:
      - question: This is a question?
        answer: This is the answer

  - question:
      - Question one?
      - Question two?
      - Question three?

  - question: One big question?

  - question:
      question: This is a question?
      answer: This is the answer
`

const normalizeDataQAPair = function (pair) {
  if (typeof pair === 'string') {
    return { question: pair, answer: false }
  }
  if (typeof pair.question === 'string' && !pair.answer) {
    return { question: pair.question, answer: false }
  } else if (typeof pair.question === 'string' && typeof pair.answer === 'string') {
    return pair
  }

  throw new Error('Master slide “question”: Invalid data input')
}

export const master = {
  centerVertically: true,
  darkMode: true,
  example,
  normalizeData (data) {
    if (Array.isArray(data)) {
      const out = []
      for (const pair of data) {
        out.push(normalizeDataQAPair(pair))
      }
      return { questions: out }
    }
    return { questions: [normalizeDataQAPair(data)] }
  },
  stepCount (data) {
    return data.questions.length + 1
  }
}

export default {
  props: {
    questions: {
      type: Array,
      required: true
    },
    numbers: {
      type: Boolean,
      default: true
    }
  },
  computed: {
    stepNoCurrent () {
      return this.$store.getters.slideCurrent.master.stepNoCurrent
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
  .question-master {
    p {
      margin: 0;
    }

    li {
      margin-top: 2vw;
      margin-bottom: 2vw;
      list-style-type: none;
    }

    ul.numbers li {
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
