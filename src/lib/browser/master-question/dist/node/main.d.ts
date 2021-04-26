/**
 * We want no lists `<ol>` etc in the HTML output for the question and the
 * heading. `1. act` is convert my `marked` into those lists. This is a
 * quick and dirty hack. Disable some renderer
 * https://marked.js.org/#/USING_PRO.md may be better.
 */
interface Counter {
    sequence: QuestionSequence;
    question: number;
    answer: number;
}
interface Spec {
    question?: string;
    answer?: string;
    heading?: string;
    subQuestions?: Spec[];
}
interface RawSpec extends Spec {
    q?: string;
    a?: string;
    h?: string;
    s?: RawSpec[];
    questions?: RawSpec[];
}
export declare function normalizeSpec(spec: string | RawSpec): Spec;
export declare function normalizeMultipleSpecs(specs: RawSpec | RawSpec[]): Spec[];
/**
 * `['q1', 'a1', 'q2', 'q3']`
 */
declare type QuestionSequence = string[];
/**
 * A questions with sub questions.
 */
export declare class Question {
    level: number;
    heading?: string;
    question?: string;
    questionNo?: number;
    answer?: string;
    answerNo?: number;
    subQuestions?: Question[];
    private counter;
    constructor(spec: Spec, counter: Counter, level: number);
    get sequence(): QuestionSequence;
    get stepCount(): number;
    /**
     * heading + question without answer.
     */
    get questionText(): string;
    private static parseRecursively;
    private static initCounter;
    static init(rawSpecs: RawSpec | RawSpec[]): Question[];
}
export {};
