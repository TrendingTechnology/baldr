// Third party packages.
import chalk from 'chalk'

// Project packages.
import { readFile, writeYamlFile } from '@bldr/file-reader-writer'
import { asciify } from '@bldr/core-browser'

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
function action (filePath: string): void {
  const text = readFile(filePath)
  console.log(`The content of the source file “${chalk.yellow(filePath)}”:\n`)
  console.log(text)

  const lines = text.split('\n')
  const samples = []
  // Text mark maybe have no description. We use a counter instead
  let counter = 1
  for (const line of lines) {
    const match = line.match(/([\d\.]+)\t([\d\.]+)\t(.*)/) // eslint-disable-line
    if (match != null) {
      //  for example: 1.488171
      const startTime = Number(match[1])
      //  for example: 1.488171
      let endTime: number | undefined = Number(match[2])
      let title
      if (match[3] == null) {
        title = String(counter)
      } else {
        // for example: Sample 1
        title = match[3]
      }
      title = title.trim()
      const id = asciify(title.toLowerCase())

      if (startTime === endTime) {
        endTime = undefined
      }
      const sample: { [key: string]: any } = {
        id,
        title,
        startTime: startTime
      }
      if (endTime == null) sample.endTime = endTime
      samples.push(sample)
    }
    counter += 1
  }
  let index = 0
  for (const sample of samples) {
    if (sample.endTime == null && index < samples.length - 1) {
      sample.endTime = samples[index + 1].startTime
    }
    index++
  }
  const dest = `${filePath}.yml`
  console.log(`The content of the destination file “${chalk.green(dest)}”:\n`)
  writeYamlFile(dest, samples)
}

export = action
