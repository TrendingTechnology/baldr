"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
const log = __importStar(require("@bldr/log"));
const file_reader_writer_1 = require("@bldr/file-reader-writer");
const core_browser_1 = require("@bldr/core-browser");
/**
 * Convert a Audacity text mark file into a raw sample format.
 *
 * ```txt
 * 1.488171\t1.488171\tSample 1
 * 11.635583\t12.940996\tSample 2 (begin + end)
 * 13.846082\t13.846082\tSample 3
 * ```
 */
function extractSamples(audacityTextmarkFile) {
    const lines = audacityTextmarkFile.split('\n');
    const samples = [];
    // Text mark maybe have no description. We use a counter instead
    for (const line of lines) {
        const match = line.match(/([\d\.]+)\t([\d\.]+)\t(.*)/); // eslint-disable-line
        if (match != null) {
            //  for example: 1.488171
            const startTime = Number(match[1]);
            //  for example: 1.488171
            let endTime = Number(match[2]);
            let title;
            if (match[3] != null && match[3] !== '') {
                // for example: Sample 1
                title = match[3];
                title = title.trim();
            }
            if (startTime === endTime) {
                endTime = undefined;
            }
            const sample = {};
            if (startTime != null) {
                sample.startTime = startTime;
            }
            if (endTime != null) {
                sample.endTime = endTime;
            }
            if (title != null && title !== '') {
                sample.title = title;
            }
            samples.push(sample);
        }
    }
    let index = 0;
    for (const sample of samples) {
        if (sample.endTime == null && index < samples.length - 1) {
            sample.endTime = samples[index + 1].startTime;
        }
        index++;
    }
    return samples;
}
/**
 * Convert a Audacity text mark file into a YAML file.
 *
 * ```txt
 * 1.488171\t1.488171\tSample 1
 * 11.635583\t12.940996\tSample 2 (begin + end)
 * 13.846082\t13.846082\tSample 3
 * ```
 *
 * ```yaml
 * ---
 * - ref: sample 1
 *   title: Sample 1
 *   start_time: 1.488171
 *   end_time: 11.635583
 * - ref: sample 2 (begin + end)
 *   title: Sample 2 (begin + end)
 *   start_time: 11.635583
 *   end_time: 12.940996
 * - ref: '3'
 *   title: '3'
 *   start_time: 13.846082
 * ```
 *
 * @param filePath - The file path of the Audacity’s text mark
 *   file.
 */
function action(filePath) {
    const text = file_reader_writer_1.readFile(filePath);
    log.info('The content of the source file “%s”:\n', [filePath]);
    log.info(text);
    const rawSamples = extractSamples(text);
    // If the first sample doesn’t start at 0 add a new first sample beginning from 0.
    if (rawSamples[0].startTime != null && rawSamples[0].startTime > 0) {
        const firstRawSample = {
            startTime: 0,
            endTime: rawSamples[0].startTime
        };
        rawSamples.unshift(firstRawSample);
    }
    const samples = [];
    // Text mark maybe have no description. We use a counter instead
    let counter = 1;
    for (const rawSample of rawSamples) {
        let title;
        if (rawSample.title == null) {
            title = `${counter}`;
        }
        else {
            title = rawSample.title;
        }
        const ref = core_browser_1.asciify(title);
        const timeText = [];
        if (rawSample.startTime != null) {
            timeText.push(core_browser_1.formatDuration(rawSample.startTime, true));
        }
        if (rawSample.endTime != null) {
            timeText.push(core_browser_1.formatDuration(rawSample.endTime, true));
        }
        if (timeText.length > 0) {
            title += ' (' + timeText.join('-') + ')';
        }
        const sample = {
            ref,
            title
        };
        if (rawSample.startTime != null) {
            sample.startTime = rawSample.startTime;
        }
        if (rawSample.endTime != null) {
            sample.endTime = rawSample.endTime;
        }
        samples.push(sample);
        counter += 1;
    }
    const dest = `${filePath}.yml`;
    log.info('The content of the destination file “%s”:\n', [dest]);
    log.always(file_reader_writer_1.writeYamlFile(dest, { samples }));
}
module.exports = action;
