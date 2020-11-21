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
 * Each master slide is a instance of this class. This class has many dummy
 * methods. They are there for documentation reasons. On the other side they
 * are useful as default methods. You have not to check if a master slide
 * implements a specific hook.
 */
export declare class Master {
    /**
     * A instance of `MasterIcon` which holds information about the master icon.
     */
    icon: MasterIcon;
    /**
     * Some markdown formated string to document this master slide.
     */
    documentation?: string;
    private spec;
    /**
     * @param spec - The default exported object from the `main.js`
     * file.
     */
    constructor(spec: MasterTypes.MasterSpec);
    /**
     * The short name of the master slide. Should be a shorter string without
     * spaces in the camelCase format.
     */
    get name(): string;
    /**
     * The human readable title of the master slide.
     */
    get title(): string;
    /**
     * The name of the props which are supporting inline media (for example
     * `markup`)
     */
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
    /**
     * Raise an error if there is an unkown prop - a not in the `props` section
     * defined prop.
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
    /**
     * Normalize the properties so the result fits to props defintion of the
     * master slide.. Called during the parsing the YAML file
     * (`Praesentation.baldr.yml`)
     */
    normalizeProps(propsRaw: any): MasterTypes.StringObject;
    /**
     * Retrieve the media URIs which have to be resolved.
     *
     * Call the master funtion `resolveMediaUris` and collect the media URIs.
     * (like [id:beethoven, id:mozart]). Extract media URIs from
     * the text props.
     */
    /**
     * Check if the handed over media URIs can be resolved. Throw no errors, if
     * the media assets are not present. This hook is used in the YouTube master
     * slide. This master slide uses the online version, if no offline video could
     * be resolved. Called during the parsing the YAML file
     * (`Praesentation.baldr.yml`).
     */
    resolveOptionalMediaUris(props: MasterTypes.StringObject): Set<string> | undefined;
    /**
     * This hook after is called after loading. To load resources in the
     * background. Goes in the background. Called during the parsing the YAML file
     * (`Praesentation.baldr.yml`).
     *
     * - `this`: is the main Vue instance.
     *
     * @param props - The properties of the slide.
     */
    afterLoading(props: MasterTypes.StringObject, thisArg: ThisArg): void;
    /**
     * This hook gets executed after the media resolution. Wait for this hook to
     * finish. Go not in the background. Called during the parsing the YAML file
     * (`Praesentation.baldr.yml`). Blocks.
     *
     * - `this`: is the main Vue instance.
     *
     * @param props - The properties of the slide.
     */
    afterMediaResolution(props: MasterTypes.StringObject, thisArg: ThisArg): Promise<void>;
    /**
     * Collect the props (properties) for the main Vue component.
     *
     * @param props - The props of the master slide.
     *
     * @returns The props for the main component as a object.
     */
    collectPropsMain(props: MasterTypes.StringObject, thisArg: ThisArg): MasterTypes.StringObject;
    /**
     * Collect the props (properties) for the preview Vue component. Called
     * during the parsing the YAML file (`Praesentation.baldr.yml`).
     *
     * - `this`: is the main Vue instance.
     *
     * @returns The props for the preview component as a object.
     */
    collectPropsPreview(payload: MasterTypes.PropsAndSlide, thisArg: ThisArg): MasterTypes.StringObject;
    /**
     * Calculate from the given props the step count. This hook method is called
     * after media resolution. Called during the parsing the YAML file
     * (`Praesentation.baldr.yml`).
     *
     * - `this`: is the main Vue instance.
     * - `return`: a number or an array of slide steps.
     *
     * @returns The steps count.
     */
    calculateStepCount(payload: MasterTypes.PropsSlideAndMaster, thisArg: ThisArg): number;
    /**
     * Determine a title from the properties.
     */
    titleFromProps(payload: MasterTypes.PropsBundle): string;
    /**
     * Extract a plain text from the props (properties) of a slide.
     */
    plainTextFromProps(props: any): string;
    /**
     * Called when leaving a slide. This hook is triggered by the Vue lifecycle
     * hook `beforeDestroy`.
     */
    leaveSlide(payload: MasterTypes.OldAndNewPropsAndSlide, thisArg: ThisArg): void;
    /**
     * Called when entering a slide. This hook is only called on the public master
     * component (the one that is visible for the audience), not on further
     * secondary master components (for example the ad hoc slides or the future
     * slide view in the speakers view.)
     *
     * - `this`: is the Vue instance of the current main master component.
     * - called from within the Vuex store in the file  `store.js`.
     */
    enterSlide(payload: MasterTypes.OldAndNewPropsAndSlide, thisArg: ThisArg): void;
    /**
     * This hook gets executed after the slide number has changed on the
     * component. Use `const slide = this.$get('slide')` to get the current slide
     * object.
     *
     * - `this`: is the Vue instance of the current main master component.
     * - called from the master component mixin in the file `masters.js`.
     */
    afterSlideNoChangeOnComponent(payload: MasterTypes.OldAndNewPropsAndSlide, thisArg: ThisArg): void;
    /**
     * Called when leaving a step. This hook is only called on the public master
     * component (the one that is visible for the audience), not on further
     * secondary master components (for example the ad hoc slides or the future
     * slide view in the speakers view.)
     *
     * - `this`: is the Vue instance of the current main master component.
     * - called from the Vuex action `setStepNoCurrent` in the file `store.js`.
     */
    leaveStep(payload: MasterTypes.OldAndNewStepNo, thisArg: ThisArg): any;
    /**
     * Called when entering a step. This hook is only called on the public
     * master component (the one that is visible for the audience), not on
     * further secondary master components (for example the ad hoc slides or the
     * future slide view in the speakers view.)
     *
     * - `this`: is the Vue instance of the current main master component.
     * - called from the Vuex action `setStepNoCurrent` in the file `store.js`.
     */
    enterStep(payload: MasterTypes.OldAndNewStepNo, thisArg: ThisArg): void;
    /**
     * This hook gets executed after the step number has changed on the
     * component.
     *
     * - `this`: is the Vue instance of the current main master component.
     * - called from the master component mixin in the file `masters.js`.
     */
    afterStepNoChangeOnComponent(payload: MasterTypes.OldAndNewStepNoAndSlideNoChange, thisArg: ThisArg): void;
}
export {};
