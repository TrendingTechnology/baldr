// Project packages.
import { MediaDataTypes } from '@bldr/type-definitions'
import * as log from '@bldr/log'
import { readFile, writeYamlFile, writeFile } from '@bldr/file-reader-writer'
import {
  asciify,
  convertSecondsToHHMMSS,
  convertHHMMSSToSeconds
} from '@bldr/string-format'
import { convertFromYaml } from '@bldr/yaml'

interface RawSample {
  startTime?: number
  endTime?: number
  title?: string
}

/**
 * Convert a Audacity text mark file into a raw sample format.
 *
 * ```txt
 * 1.488171\t1.488171\tSample 1
 * 11.635583\t12.940996\tSample 2 (begin + end)
 * 13.846082\t13.846082\tSample 3
 * ```
 */
function extractSamples (audacityTextmarkFile: string): RawSample[] {
  const lines = audacityTextmarkFile.split('\n')
  const samples: RawSample[] = []
  for (const line of lines) {
    const match = line.match(/([\d\.]+)\t([\d\.]+)(\t(.*))?/) // eslint-disable-line
    if (match != null) {
      //  for example: 1.488171
      const startTime = Number(match[1])
      //  for example: 1.488171
      let endTime: number | undefined = Number(match[2])
      let title
      if (match[4] != null && match[4] !== '') {
        // for example: Sample 1
        title = match[4]
        title = title.trim()
      }

      if (startTime === endTime) {
        endTime = undefined
      }
      const sample: RawSample = {}

      if (startTime != null) {
        sample.startTime = startTime
      }
      if (endTime != null) {
        sample.endTime = endTime
      }
      if (title != null && title !== '') {
        sample.title = title
      }
      samples.push(sample)
    }
  }
  let index = 0
  for (const sample of samples) {
    if (sample.endTime == null && index < samples.length - 1) {
      sample.endTime = samples[index + 1].startTime
    }
    index++
  }
  return samples
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
function convertAudacityToYaml (filePath: string, content: string): void {
  const rawSamples = extractSamples(content)

  // If the first sample doesn’t start at 0 add a new first sample beginning from 0.
  if (rawSamples[0].startTime != null && rawSamples[0].startTime > 0) {
    const firstRawSample: RawSample = {
      startTime: 0,
      endTime: rawSamples[0].startTime
    }
    rawSamples.unshift(firstRawSample)
  }

  const samples: MediaDataTypes.SampleMetaData[] = []
  // The text mark may not have a description. We use a counter instead
  let counter = 1
  for (const rawSample of rawSamples) {
    let title: string
    if (rawSample.title == null) {
      title = `Ausschnitt ${counter}`
    } else {
      title = rawSample.title
    }

    const ref = asciify(title)

    const timeText: string[] = []
    if (rawSample.startTime != null) {
      timeText.push(convertSecondsToHHMMSS(rawSample.startTime, true))
    }

    if (rawSample.endTime != null) {
      timeText.push(convertSecondsToHHMMSS(rawSample.endTime, true))
    }

    if (timeText.length > 0) {
      title += ' (' + timeText.join('-') + ')'
    }

    const sample: Partial<MediaDataTypes.SampleMetaData> = {
      ref,
      title
    }

    if (rawSample.startTime != null) {
      sample.startTime = rawSample.startTime
    }
    if (rawSample.endTime != null) {
      sample.endTime = rawSample.endTime
    }
    samples.push(sample as MediaDataTypes.SampleMetaData)
    counter += 1
  }

  const dest = `${filePath}.yml`
  log.info('The content of the destination file “%s”:\n', [dest])
  log.always(writeYamlFile(dest, { samples }))
}

function convertYamlToAudacity (filePath: string, content: string): void {
  const yaml = convertFromYaml(content)
  if (yaml.samples == null) {
    throw new Error('No field “samples” found.')
  }

  const lines: string[] = []
  for (const sample of yaml.samples as MediaDataTypes.SampleMetaData[]) {
    const startTime = convertHHMMSSToSeconds(sample.startTime)
    const endTime = convertHHMMSSToSeconds(
      sample.endTime == null ? sample.startTime : sample.endTime
    )
    const description =
      sample.title != null ? sample.title + ' ' + sample.ref : sample.ref
    const line = `${startTime}\t${endTime}\t${description}`
    lines.push(line)
  }

  const dest = filePath + '_audacity.txt'
  log.info('The content of the destination file “%s”:\n', [dest])
  log.always(writeFile(dest, lines.join('\n')))
}

export default function (filePath: string): void {
  const text = readFile(filePath)
  log.info('The content of the source file “%s”:\n', [filePath])
  log.info(text)

  if (text.indexOf('---') === 0) {
    convertYamlToAudacity(filePath, text)
  } else {
    convertAudacityToYaml(filePath, text)
  }
}
