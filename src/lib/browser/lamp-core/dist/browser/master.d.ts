import type { LampTypes } from '@bldr/type-definitions';
/**
 * The
 * {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function/call thisArg}
 * a function is called with.
 */
declare type ThisArg = object;
/**
 * The icon of a master slide. This icon is shown in the documentation or
 * on the left corner of a slide.
 */
declare class MasterIcon implements LampTypes.MasterIconSpec {
    /**
     * For allowed icon names see the
     * {@link module:@bldr/icons Baldr icon font}.
     */
    name: string;
    /**
     * A color name (CSS color class name) to colorize the master icon.
     * @see {@link module:@bldr/themes}
     */
    color: string;
    /**
     * The size of a master icon: `small` or `large`.
     */
    size?: 'large' | 'small';
    /**
     * Show the icon on the slide view.
     */
    showOnSlides: boolean;
    constructor({ name, color, size, showOnSlides }: LampTypes.MasterIconSpec);
}
/**
 * Each master slide has an instance of this class.
 */
export declare class Master implements LampTypes.Master {
    icon: MasterIcon;
    documentation?: string;
    /**
     * The specification of the master slide provided by a master package.
     */
    private readonly spec;
    /**
     * @param spec - The specification of the master slide provided by a master
     * package.
     */
    constructor(spec: LampTypes.MasterSpec);
    get name(): string;
    get title(): string;
    get propNamesInlineMedia(): string[];
    /**
     * Filter the master props for props which are supporting inline media.
     */
    /**
     * Replace the inline media tags `[id:Beethoven]` in certain props with
     * HTML. This function must be called after the media resolution.
     */
    convertMarkdownToHtml(props: LampTypes.StringObject): LampTypes.StringObject;
    detectUnkownProps(props: LampTypes.StringObject): void;
    validateUris(props: LampTypes.StringObject): LampTypes.StringObject;
    /**
     * Call a master hook. Master hooks are definied in the `main.js`
     * files.
     *
     * @param hookName - The name of the master hook / function.
     * @param payload - The argument the master hook / function is called
     *   with.
     */
    private callHook;
    /**
     * Asynchronous version. Call a master hook. Master hooks are definied in the
     * `main.js` files.
     *
     * @param hookName - The name of the master hook / function.
     * @param payload - The argument the master hook / function is called
     *   with.
     */
    private callHookAsync;
    normalizeProps(propsRaw: any): LampTypes.StringObject;
    private normalizeUris;
    resolveMediaUris(props: LampTypes.StringObject): Set<string> | undefined;
    resolveOptionalMediaUris(props: LampTypes.StringObject): Set<string> | undefined;
    afterLoading(props: LampTypes.StringObject, thisArg: ThisArg): void;
    afterMediaResolution(props: LampTypes.StringObject, thisArg: ThisArg): Promise<void>;
    collectPropsMain(props: LampTypes.StringObject, thisArg: ThisArg): LampTypes.StringObject;
    collectPropsPreview(payload: LampTypes.PropsAndSlide, thisArg: ThisArg): LampTypes.StringObject;
    calculateStepCount(payload: LampTypes.PropsSlideAndMaster, thisArg: ThisArg): number;
    titleFromProps(payload: LampTypes.PropsBundle): string;
    plainTextFromProps(props: any): string;
    leaveSlide(payload: LampTypes.OldAndNewPropsAndSlide, thisArg: ThisArg): void;
    enterSlide(payload: LampTypes.OldAndNewPropsAndSlide, thisArg: ThisArg): void;
    afterSlideNoChangeOnComponent(payload: LampTypes.OldAndNewPropsAndSlide, thisArg: ThisArg): void;
    leaveStep(payload: LampTypes.OldAndNewStepNo, thisArg: ThisArg): void;
    enterStep(payload: LampTypes.OldAndNewStepNo, thisArg: ThisArg): void;
    afterStepNoChangeOnComponent(payload: LampTypes.OldAndNewStepNoAndSlideNoChange, thisArg: ThisArg): void;
}
export {};
