import { MasterTypes } from '@bldr/type-definitions';
/**
 * Validate the master specification. This function doesn’t change the
 * the input object. The input object is passed through unchanged. The
 * validation handles Typescript.
 *
 * @param masterSpec The specification of the master slide.
 *
 * @returns The unchanged object of the specification.
 */
export declare function validateMasterSpec(masterSpec: MasterTypes.MasterSpec): MasterTypes.MasterSpec;
declare type StepProp = 'selector' | 'mode' | 'subset';
/**
 * Map step support related props for the use as Vuejs props.
 */
export declare function mapStepProps(selectors: StepProp[]): MasterTypes.PropsDefintion;
export {};
