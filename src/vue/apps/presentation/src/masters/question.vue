<template>
  <div class="question-master">
    <h1 v-if="heading">{{ heading }}</h1>
    <ul :class="{ numbers: showNumbers }">
      <li v-for="(pair, index) in questions" :key="pair.question">
        <p class="question">{{ pair.question }}</p>
        <p v-if="pair.answer">… <span :class="getClassHidden(index + 1)" class="answer">{{ pair.answer }}</span></p>

      </li>
    </ul>
  </div>
</template>

<script>

const example = `
---
slides:
  - title: Heading
    question:
      heading: Questions about the text
      questions:
        - question: Question one?
          answer: Answer one
        - question: Question two?
          answer: Answer two
        - question: Question three?
          answer: Answer three

  - title: Without numbers
    question:
      heading: Without numbers
      questions:
        - question: Question one?
          answer: Answer one
        - question: Question two?
          answer: Answer two
        - question: Question three?
          answer: Answer three
      numbers: false

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

const normalizeQAPair = function (pair) {
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

const normalizeQuestions = function (questions) {
  if (Array.isArray(questions)) {
    const out = []
    for (const pair of questions) {
      out.push(normalizeQAPair(pair))
    }
    return out
  }
  return [normalizeQAPair(questions)]
}

export const master = {
  centerVertically: true,
  darkMode: true,
  example,
  normalizeData (data) {
    if (typeof data === 'object' && !Array.isArray(data) && 'questions' in data) {
      data.questions = normalizeQuestions(data.questions)
      return data
    }
    return { questions: normalizeQuestions(data) }
  },
  stepCount (data) {
    let count = 0
    for (const question of data.questions) {
      if ('answer' in question && question.answer) count += 1
    }
    return count + 1
  }
}

export default {
  props: {
    questions: {
      type: Array,
      required: true
    },
    heading: {
      type: String
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
