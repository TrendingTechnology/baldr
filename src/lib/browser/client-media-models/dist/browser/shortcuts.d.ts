import { Sample } from './sample';
export declare class ShortcutManager {
    private readonly audio;
    private readonly image;
    private readonly video;
    constructor();
    addShortcut(sample: Sample): void;
    reset(): void;
}
