import { Presentation } from './presentation';
export declare function parse(yamlString: string): Presentation;
export declare function parseAndResolve(yamlString: string): Promise<Presentation>;
