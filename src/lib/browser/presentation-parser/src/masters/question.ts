import { convertMarkdownToHtml } from '@bldr/markdown-to-html'
import * as tex from '@bldr/tex-templates'

import { Master } from '../master'

/**
 * We want no lists `<ol>` etc in the HTML output for the question and the
 * heading. `1. act` is convert by `marked` into those lists. This is a
 * quick and dirty hack. Disable some renderer
 * https://marked.js.org/#/USING_PRO.md may be better.
 */
function convertMarkdownToHtmlNoLists (text: string): string {
  text = convertMarkdownToHtml(text)
  // <ol start="2">
  text = text.replace(/<\/?(ul|ol|li)[^>]*?>/g, '')
  return text.trim()
}

interface Counter {
  sequence: QuestionSequence
  question: number
  answer: number
}

interface Spec {
  question?: string
  answer?: string
  heading?: string
  subQuestions?: Spec[]
}

interface RawSpecObject extends Spec {
  q?: string
  a?: string
  h?: string
  s?: RawSpecObject[]
  questions?: RawSpecObject[]
}

interface QuestionFieldData {
  questions: Question[]
  sequence: QuestionSequence
}

type RawSpec = string | string[] | RawSpecObject | RawSpecObject[]

function normalizeSpec (spec: string | RawSpecObject): Spec {
  const output: Spec = {}
  if (typeof spec === 'string') {
    output.question = spec
    return output
  }
  if (typeof spec === 'object') {
    if (spec.q != null) {
      output.question = spec.q
    }
    if (spec.question != null) {
      output.question = spec.question
    }
    if (spec.a != null) {
      output.answer = spec.a
    }
    if (spec.answer != null) {
      output.answer = spec.answer
    }
    if (spec.h != null) {
      output.heading = spec.h
    }
    if (spec.heading != null) {
      output.heading = spec.heading
    }
    if (spec.s != null) {
      output.subQuestions = normalizeMultipleSpecs(spec.s)
    }
    if (spec.subQuestions != null) {
      output.subQuestions = normalizeMultipleSpecs(spec.subQuestions)
    }
    if (spec.questions != null) {
      output.subQuestions = normalizeMultipleSpecs(spec.questions)
    }
  }
  return output
}

function normalizeMultipleSpecs (rawSpec: RawSpec): Spec[] {
  if (Array.isArray(rawSpec)) {
    const output = []
    for (const spec of rawSpec) {
      output.push(normalizeSpec(spec))
    }
    return output
  }
  return [normalizeSpec(rawSpec)]
}

/**
 * `['q1', 'a1', 'q2', 'q3']`
 */
type QuestionSequence = string[]

/**
 * A question with sub questions.
 */
class Question {
  level: number
  heading?: string
  question?: string
  questionNo?: number
  answer?: string
  answerNo?: number
  subQuestions?: Question[]
  private readonly counter: Counter
  constructor (spec: Spec, counter: Counter, level: number) {
    this.counter = counter
    if (spec.heading != null) {
      this.heading = convertMarkdownToHtmlNoLists(spec.heading)
    }
    if (spec.question != null) {
      this.question = convertMarkdownToHtmlNoLists(spec.question)
      counter.question++
      counter.sequence.push(`q${counter.question}`)
      this.questionNo = counter.question
    }
    if (spec.answer != null) {
      this.answer = convertMarkdownToHtml(spec.answer)
      counter.answer++
      counter.sequence.push(`a${counter.answer}`)
      this.answerNo = counter.answer
    }
    if (this.question != null) {
      this.level = level + 1
    } else {
      // Question object without a question. Only a heading
      this.level = level
    }
    if (spec.subQuestions != null) {
      this.subQuestions = []
      Question.parseRecursively(
        spec.subQuestions,
        this.subQuestions,
        counter,
        this.level
      )
    }
  }

  get sequence (): QuestionSequence {
    return this.counter.sequence
  }

  get stepCount (): number {
    return this.sequence.length
  }

  /**
   * heading + question without answer.
   */
  get questionText (): string {
    let output = ''
    if (this.heading != null) {
      output = output + this.heading
    }
    if (this.question != null) {
      output = output + this.question
    }
    return output
  }

  private static parseRecursively (
    rawSpec: RawSpec,
    processed: Question[],
    counter: Counter,
    level: number
  ): Question[] {
    const specs = normalizeMultipleSpecs(rawSpec)
    if (Array.isArray(specs)) {
      for (const spec of specs) {
        processed.push(new Question(spec, counter, level))
      }
      return processed
    }
    processed.push(new Question(specs, counter, level))
    return processed
  }

  private static initCounter (): Counter {
    return {
      sequence: [],
      question: 0,
      answer: 0
    }
  }

  static parse (rawSpec: RawSpec): Question[] {
    const counter = Question.initCounter()
    return Question.parseRecursively(rawSpec, [], counter, 0)
  }
}

function formatTexMultipleQuestions (questions: Question[]): string {
  const markup: string[] = []
  for (const question of questions) {
    markup.push(formatTexQuestion(question))
  }
  return tex.environment('enumerate', markup.join('\n'))
}

function formatTexQuestion (question: Question): string {
  const markup: string[] = ['\\item']

  if (question.heading != null) {
    markup.push(tex.cmd('textbf', question.heading))
  }

  if (question.question != null) {
    markup.push(question.question)
  }

  if (question.answer != null) {
    markup.push(tex.cmd('textit', question.answer))
  }

  if (question.subQuestions != null) {
    markup.push(formatTexMultipleQuestions(question.subQuestions))
  }
  return markup.join('\n\n') + '\n'
}

export class QuestionMaster implements Master {
  name = 'question'

  displayName = 'Frage'

  icon = {
    name: 'question',
    color: 'yellow',
    size: 'large' as const
  }

  fieldsDefintion = {
    questions: {
      description:
        'Eine Liste mit Objekten mit den Schlüsseln `question` and `answer`.',
      required: true,
      markup: true
    },
    sequence: {
      description:
        "Wird automatisch erzeugt, z. B.: ['q1', 'a1', 'q2', 'q3'] .",
      type: Array
    }
  }

  normalizeFields (fields: RawSpec): QuestionFieldData {
    const questions = Question.parse(fields)
    return {
      questions,
      sequence: questions[0].sequence
    }
  }

  generateTexMarkup(fields: QuestionFieldData): string {
    const markup: string[] = []
    for (const question of fields.questions) {
      markup.push(formatTexQuestion(question))
    }
    return tex.environment('enumerate', markup.join('\n'))
  }
}
