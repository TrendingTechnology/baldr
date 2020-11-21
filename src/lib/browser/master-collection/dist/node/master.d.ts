import { MasterTypes } from '@bldr/type-definitions';
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
declare class MasterIcon implements MasterTypes.MasterIconSpec {
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
    constructor({ name, color, size, showOnSlides }: MasterTypes.MasterIconSpec);
}
/**
 * Each master slide has an instance of this class.
 */
export declare class Master implements MasterTypes.Master {
    icon: MasterIcon;
    documentation?: string;
    /**
     * The specification of the master slide provided by a master package.
     */
    private spec;
    /**
     * @param spec - The specification of the master slide provided by a master
     * package.
     */
    constructor(spec: MasterTypes.MasterSpec);
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
    /**
     * Convert in the props certain strings containing markup to HTML.
     */
    detectUnkownProps(props: MasterTypes.StringObject): void;
    /**
     * Validate all media file URIs in the props of a certain slide.
     */
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
    normalizeProps(propsRaw: any): MasterTypes.StringObject;
    /**
     * Retrieve the media URIs which have to be resolved.
     *
     * Call the master funtion `resolveMediaUris` and collect the media URIs.
     * (like [id:beethoven, id:mozart]). Extract media URIs from
     * the text props.
     */
    resolveOptionalMediaUris(props: MasterTypes.StringObject): Set<string> | undefined;
    afterLoading(props: MasterTypes.StringObject, thisArg: ThisArg): void;
    afterMediaResolution(props: MasterTypes.StringObject, thisArg: ThisArg): Promise<void>;
    collectPropsMain(props: MasterTypes.StringObject, thisArg: ThisArg): MasterTypes.StringObject;
    collectPropsPreview(payload: MasterTypes.PropsAndSlide, thisArg: ThisArg): MasterTypes.StringObject;
    calculateStepCount(payload: MasterTypes.PropsSlideAndMaster, thisArg: ThisArg): number;
    titleFromProps(payload: MasterTypes.PropsBundle): string;
    plainTextFromProps(props: any): string;
    leaveSlide(payload: MasterTypes.OldAndNewPropsAndSlide, thisArg: ThisArg): void;
    enterSlide(payload: MasterTypes.OldAndNewPropsAndSlide, thisArg: ThisArg): void;
    afterSlideNoChangeOnComponent(payload: MasterTypes.OldAndNewPropsAndSlide, thisArg: ThisArg): void;
    leaveStep(payload: MasterTypes.OldAndNewStepNo, thisArg: ThisArg): any;
    enterStep(payload: MasterTypes.OldAndNewStepNo, thisArg: ThisArg): void;
    afterStepNoChangeOnComponent(payload: MasterTypes.OldAndNewStepNoAndSlideNoChange, thisArg: ThisArg): void;
}
export {};
