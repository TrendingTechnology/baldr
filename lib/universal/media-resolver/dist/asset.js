import { getExtension, formatMultiPartAssetFileName } from '@bldr/string-format';
import { mimeTypeManager, MediaUri } from '@bldr/client-media-models';
import { Cache } from './cache';
import { Sample } from './sample';
export class SampleCollection extends Cache {
    constructor(asset) {
        super();
        this.asset = asset;
        this.addFromAsset(asset);
    }
    get complete() {
        return this.get(this.asset.ref + '#complete');
    }
    addSample(asset, yamlFormat) {
        const sample = new Sample(asset, yamlFormat);
        if (this.get(sample.ref) == null) {
            this.add(sample.ref, sample);
        }
    }
    /**
     * Gather informations to build the default sample “complete”.
     */
    gatherYamlFromRoot(assetFormat) {
        const yamlFormat = {};
        if (assetFormat.startTime != null) {
            yamlFormat.startTime = assetFormat.startTime;
        }
        if (assetFormat.duration != null) {
            yamlFormat.duration = assetFormat.duration;
        }
        if (assetFormat.endTime != null) {
            yamlFormat.endTime = assetFormat.endTime;
        }
        if (assetFormat.fadeIn != null) {
            yamlFormat.startTime = assetFormat.fadeIn;
        }
        if (assetFormat.fadeOut != null) {
            yamlFormat.startTime = assetFormat.fadeOut;
        }
        if (assetFormat.shortcut != null) {
            yamlFormat.shortcut = assetFormat.shortcut;
        }
        if (Object.keys(yamlFormat).length > 0) {
            return yamlFormat;
        }
    }
    addFromAsset(asset) {
        // search the “complete” sample from the property “samples”.
        let completeYamlFromSamples;
        if (asset.meta.samples != null) {
            for (let i = 0; i < asset.meta.samples.length; i++) {
                const sampleYaml = asset.meta.samples[i];
                if (sampleYaml.ref != null && sampleYaml.ref === 'complete') {
                    completeYamlFromSamples = sampleYaml;
                    asset.meta.samples.splice(i, 1);
                    break;
                }
            }
        }
        // First add default sample “complete”
        const completeYamlFromRoot = this.gatherYamlFromRoot(asset.meta);
        if (completeYamlFromSamples != null && completeYamlFromRoot != null) {
            throw new Error('Duplicate definition of the default complete sample');
        }
        else if (completeYamlFromSamples != null) {
            this.addSample(asset, completeYamlFromSamples);
        }
        else if (completeYamlFromRoot != null) {
            this.addSample(asset, completeYamlFromRoot);
        }
        else {
            this.addSample(asset, {});
        }
        let counter = 0;
        // Add samples from the YAML property “samples”
        if (asset.meta.samples != null) {
            for (const sampleSpec of asset.meta.samples) {
                if (sampleSpec.ref == null && sampleSpec.title == null) {
                    counter++;
                    sampleSpec.ref = `sample${counter}`;
                    sampleSpec.title = `Ausschnitt ${counter}`;
                }
                this.addSample(asset, sampleSpec);
            }
        }
    }
}
/**
 * Hold various data of a media file as class properties.
 *
 * If a media file has a property with the name `multiPartCount`, it is a
 * multipart asset. A multipart asset can be restricted to one part only by a
 * URI fragment (for example `#2`). The URI `ref:Score#2` resolves always to the
 * HTTP URL `http:/example/media/Score_no02.png`.
 */
export class Asset {
    /**
     * @param meta - A raw javascript object read from the Rest API
     */
    constructor(uri, httpUrl, meta, resolver) {
        this.uri = new MediaUri(uri);
        this.httpUrl = httpUrl;
        this.meta = meta;
        this.resolver = resolver;
        if (this.meta.extension == null && this.meta.path != null) {
            this.meta.extension = getExtension(this.meta.path);
        }
        if (this.meta.extension == null) {
            throw Error('The client media assets needs a extension');
        }
        this.mimeType = mimeTypeManager.extensionToType(this.meta.extension);
        if (this.isPlayable) {
            this.samples = new SampleCollection(this);
        }
    }
    /**
     * The reference authority of the URI using the `ref` scheme. The returned
     * string is prefixed with `ref:`.
     */
    get ref() {
        return 'ref:' + this.meta.ref;
    }
    /**
     * The UUID authority of the URI using the `uuid` scheme. The returned
     * string is prefixed with `uuid:`.
     */
    get uuid() {
        return 'uuid:' + this.meta.uuid;
    }
    /**
     * Each media asset can have a preview image. The suffix `_preview.jpg`
     * is appended on the path. For example
     * `http://localhost/media/Lieder/i/Ich-hab-zu-Haus-ein-Gramophon/HB/Ich-hab-zu-Haus-ein-Grammophon.m4a_preview.jpg`
     */
    get previewHttpUrl() {
        if (this.meta.hasPreview != null && this.meta.hasPreview) {
            return `${this.httpUrl}_preview.jpg`;
        }
        if (this.meta.cover != null) {
            const cover = this.resolver.findAsset(this.meta.cover);
            if (cover != null) {
                return cover.httpUrl;
            }
        }
    }
    /**
     * Each media asset can be associated with a waveform image. The suffix `_waveform.png`
     * is appended on the HTTP URL. For example
     * `http://localhost/media/Lieder/i/Ich-hab-zu-Haus-ein-Gramophon/HB/Ich-hab-zu-Haus-ein-Grammophon.m4a_waveform.png`
     */
    get waveformHttpUrl() {
        if (this.meta.hasWaveform != null && this.meta.hasWaveform) {
            return `${this.httpUrl}_waveform.png`;
        }
    }
    get titleSafe() {
        if (this.meta.title != null) {
            return this.meta.title;
        }
        if (this.meta.filename != null) {
            return this.meta.filename;
        }
        return this.uri.raw;
    }
    /**
     * True if the media file is playable, for example an audio or a video file.
     */
    get isPlayable() {
        return ['audio', 'video'].includes(this.mimeType);
    }
    /**
     * True if the media file is visible, for example an image or a video file.
     */
    get isVisible() {
        return ['image', 'video'].includes(this.mimeType);
    }
    /**
     * The number of parts of a multipart media asset.
     */
    get multiPartCount() {
        if (this.meta.multiPartCount == null) {
            return 1;
        }
        return this.meta.multiPartCount;
    }
    /**
     * Retrieve the HTTP URL of the multipart asset by the part number.
     *
     * @param no - The part number starts with 1.
     */
    getMultiPartHttpUrlByNo(no) {
        if (typeof no !== 'number' || this.multiPartCount === 1) {
            return this.httpUrl;
        }
        return formatMultiPartAssetFileName(this.httpUrl, no);
    }
}
