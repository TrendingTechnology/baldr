"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ShortcutManager = void 0;
// /**
//  * Add shortcuts for media files. At the momenten only for images. Video
//  * and audio are samples and handled separately.
//  *
//  * @private
//  */
//  addShortcutForAssets_ () {
//   const assets = store.getters['media/assets']
//   let shortcutNo = 1
//   for (const uri in assets) {
//     // i 10 does not work.
//     if (shortcutNo > 9) return
//     const asset = assets[uri]
//     if (!asset.shortcut && asset.type === 'image') {
//       asset.shortcut = `i ${shortcutNo}`
//       shortcuts.add(
//         asset.shortcut,
//         () => {
//           this.canvas.hide()
//           this.player.stop()
//           this.canvas.show(asset.mediaElement)
//         },
//         // Play
//         `Zeige Bild „${asset.titleSafe}“`
//       )
//       shortcutNo += 1
//     }
//   }
// }
// /**
//  * Add shortcut for each sample. Audio samples are triggered by “a number” and
//  * video files are trigger by “v number”.
//  *
//  * @private
//  */
// addShortcutForSamples_ () {
//   // We have to loop through all samples to get the latest shortcut number.
//   const samples = store.getters['media/samples']
//   const firstTriggerKeyByType = (type) => {
//     if (type === 'audio') {
//       return 'a'
//     } else if (type === 'video') {
//       return 'v'
//     }
//   }
//   const addShortcutsByType = (samples, type) => {
//     let counter = store.getters['media/shortcutCounterByType'](type)
//     // a 10 does not work.
//     if (counter > 9) return
//     for (const sampleUri in samples) {
//       const sample = samples[sampleUri]
//       if (!sample.shortcutCustom && !sample.shortcut && sample.asset.type === type) {
//         counter = store.getters['media/shortcutCounterByType'](type)
//         // a 10 does not work.
//         if (counter > 9) return
//         sample.shortcutNo = counter
//         store.dispatch('media/incrementShortcutCounterByType', type)
//         sample.shortcut = `${firstTriggerKeyByType(sample.asset.type)} ${sample.shortcutNo}`
//         shortcuts.add(
//           sample.shortcut,
//           () => {
//             // TODO: Start the same video twice behaves very strange.
//             this.canvas.hide()
//             this.player.load(sample.uri)
//             this.player.start()
//             if (sample.asset.isVisible) {
//               this.canvas.show(sample.mediaElement)
//             }
//           },
//           // Play
//           `Spiele Ausschnitt „${sample.titleSafe}“`
//         )
//       }
//     }
//   }
//   const addShortcutsCustom = (samples) => {
//     for (const sampleUri in samples) {
//       const sample = samples[sampleUri]
//       if (sample.shortcutCustom && !sample.shortcut) {
//         sample.shortcut = sample.shortcutCustom
//         shortcuts.add(
//           sample.shortcut,
//           () => {
//             this.player.load(sample.uri)
//             this.player.start()
//           },
//           // Play
//           `Spiele Ausschnitt „${sample.titleSafe}“`
//         )
//       }
//     }
//   }
//   addShortcutsCustom(samples)
//   for (const mimeType of ['audio', 'video']) {
//     addShortcutsByType(samples, mimeType)
//   }
/**
 * This class manages the counter for one MIME type (`audio`, `image` and `video`).
 *
 */
class MimeTypeShortcutCounter {
    constructor(triggerKey) {
        this.triggerKey = triggerKey;
        this.count = 0;
    }
    /**
     * Get the next available shortcut: `a 1`, `a 2`
     */
    get() {
        if (this.count < 10) {
            this.count++;
            if (this.count === 10) {
                return `${this.triggerKey} 0`;
            }
            return `${this.triggerKey} ${this.count}`;
        }
    }
    reset() {
        this.count = 0;
    }
}
class ShortcutManager {
    constructor() {
        this.audio = new MimeTypeShortcutCounter('a');
        this.image = new MimeTypeShortcutCounter('i');
        this.video = new MimeTypeShortcutCounter('v');
    }
    addShortcut(sample) {
        if (sample.shortcut != null)
            return;
        if (sample.asset.mimeType === 'audio') {
            sample.shortcut = this.audio.get();
        }
        else if (sample.asset.mimeType === 'image') {
            sample.shortcut = this.image.get();
        }
        else if (sample.asset.mimeType === 'video') {
            sample.shortcut = this.video.get();
        }
    }
    reset() {
        this.audio.reset();
        this.image.reset();
        this.video.reset();
    }
}
exports.ShortcutManager = ShortcutManager;
