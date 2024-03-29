import { convertMarkdownToHtml } from '@bldr/markdown-to-html';
import * as tex from '@bldr/tex-templates';
/**
 * Collection all question text (without answers) to build the plain
 * text version.
 */
export function collectPlainText(text, questions) {
    for (const question of questions) {
        text = text + question.questionText + ' | ';
        if (question.subQuestions) {
            text = collectPlainText(text, question.subQuestions);
        }
    }
    return text;
}
/**
 * We want no lists `<ol>` etc in the HTML output for the question and the
 * heading. `1. act` is convert by `marked` into those lists. This is a
 * quick and dirty hack. Disable some renderer
 * https://marked.js.org/#/USING_PRO.md may be better.
 */
function convertMarkdownToHtmlNoLists(text) {
    text = convertMarkdownToHtml(text);
    // <ol start="2">
    text = text.replace(/<\/?(ul|ol|li)[^>]*?>/g, '');
    return text.trim();
}
function normalizeSpec(spec) {
    const output = {};
    if (typeof spec === 'string') {
        output.question = spec;
        return output;
    }
    if (typeof spec === 'object') {
        if (spec.q != null) {
            output.question = spec.q;
        }
        if (spec.question != null) {
            output.question = spec.question;
        }
        if (spec.a != null) {
            output.answer = spec.a;
        }
        if (spec.answer != null) {
            output.answer = spec.answer;
        }
        if (spec.h != null) {
            output.heading = spec.h;
        }
        if (spec.heading != null) {
            output.heading = spec.heading;
        }
        if (spec.s != null) {
            output.subQuestions = normalizeMultipleSpecs(spec.s);
        }
        if (spec.subQuestions != null) {
            output.subQuestions = normalizeMultipleSpecs(spec.subQuestions);
        }
        if (spec.questions != null) {
            output.subQuestions = normalizeMultipleSpecs(spec.questions);
        }
    }
    return output;
}
function normalizeMultipleSpecs(rawSpec) {
    if (Array.isArray(rawSpec)) {
        const output = [];
        for (const spec of rawSpec) {
            output.push(normalizeSpec(spec));
        }
        return output;
    }
    return [normalizeSpec(rawSpec)];
}
/**
 * A question with sub questions.
 */
export class Question {
    constructor(spec, counter, level) {
        this.counter = counter;
        if (spec.heading != null) {
            this.heading = convertMarkdownToHtmlNoLists(spec.heading);
        }
        if (spec.question != null) {
            this.question = convertMarkdownToHtmlNoLists(spec.question);
            counter.question++;
            counter.sequence.push(`q${counter.question}`);
            this.questionNo = counter.question;
        }
        if (spec.answer != null) {
            this.answer = convertMarkdownToHtml(spec.answer);
            counter.answer++;
            counter.sequence.push(`a${counter.answer}`);
            this.answerNo = counter.answer;
        }
        if (this.question != null) {
            this.level = level + 1;
        }
        else {
            // Question object without a question. Only a heading
            this.level = level;
        }
        if (spec.subQuestions != null) {
            this.subQuestions = [];
            Question.parseRecursively(spec.subQuestions, this.subQuestions, counter, this.level);
        }
    }
    get sequence() {
        return this.counter.sequence;
    }
    get stepCount() {
        return this.sequence.length;
    }
    /**
     * heading + question without answer.
     */
    get questionText() {
        let output = '';
        if (this.heading != null) {
            output = output + this.heading;
        }
        if (this.question != null) {
            output = output + this.question;
        }
        return output;
    }
    static parseRecursively(rawSpec, processed, counter, level) {
        const specs = normalizeMultipleSpecs(rawSpec);
        if (Array.isArray(specs)) {
            for (const spec of specs) {
                processed.push(new Question(spec, counter, level));
            }
            return processed;
        }
        processed.push(new Question(specs, counter, level));
        return processed;
    }
    static initCounter() {
        return {
            sequence: [],
            question: 0,
            answer: 0
        };
    }
    static parse(rawSpec) {
        const counter = Question.initCounter();
        return Question.parseRecursively(rawSpec, [], counter, 0);
    }
}
function formatTexMultipleQuestions(questions) {
    const markup = [];
    for (const question of questions) {
        markup.push(formatTexQuestion(question));
    }
    return tex.environment('enumerate', markup.join('\n'));
}
function formatTexQuestion(question) {
    const markup = ['\\item'];
    if (question.heading != null) {
        markup.push(tex.cmd('textbf', question.heading));
    }
    if (question.question != null) {
        markup.push(question.question);
    }
    if (question.answer != null) {
        markup.push(tex.cmd('textit', question.answer));
    }
    if (question.subQuestions != null) {
        markup.push(formatTexMultipleQuestions(question.subQuestions));
    }
    return markup.join('\n\n') + '\n';
}
export function generateTexMarkup(fields) {
    const markup = [];
    for (const question of fields.questions) {
        markup.push(formatTexQuestion(question));
    }
    return tex.environment('enumerate', markup.join('\n'));
}
export class QuestionMaster {
    constructor() {
        this.name = 'question';
        this.displayName = 'Frage';
        this.icon = {
            name: 'master-question',
            color: 'yellow',
            size: 'large',
            /**
             * U+2754
             *
             * @see https://emojipedia.org/white-question-mark/
             */
            unicodeSymbol: '❔'
        };
        this.fieldsDefintion = {
            questions: {
                description: 'Eine Liste mit Objekten mit den Schlüsseln `question` and `answer`.',
                required: true,
                markup: true
            }
        };
    }
    normalizeFieldsInput(fields) {
        const questions = Question.parse(fields);
        return {
            questions
        };
    }
    generateTexMarkup(fields) {
        return generateTexMarkup(fields);
    }
}
