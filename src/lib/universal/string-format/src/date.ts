/**
 * @param duration - in seconds
 *
 * @return `01:23`
 */
export function formatDuration (
  duration: number | string,
  short: boolean = false
): string {
  duration = Number(duration)
  let from = 11
  let length = 8
  if (duration < 3600 && short) {
    from = 14
    length = 5
  }
  return new Date(Number(duration) * 1000).toISOString().substr(from, length)
}

/**
 * Get the current school year. The function returns year in which the school year begins.
 *
 * @returns The year in which the school year begins, for example `2021/22`: `2021`
 */
export function getCurrentSchoolYear (): number {
  const date = new Date()
  // getMonth: 0 = January
  // 8 = September
  if (date.getMonth() < 8) {
    return date.getFullYear() - 1
  }
  return date.getFullYear()
}

/**
 * @returns e. g. `2021/22`
 */
export function getFormatedSchoolYear (): string {
  const year = getCurrentSchoolYear()
  const endYear = year + 1
  const endYearString = endYear.toString().substr(2)
  return `${year.toString()}/${endYearString}`
}

/**
 * Format a timestamp into a string like this example: `Mo 17.2.2020 07:57:53`
 *
 * @param timeStampMsec - The timestamp in milliseconds.
 */
export function formatToLocalDateTime (timeStampMsec: number): string {
  const date = new Date(Number(timeStampMsec))
  const dayNumber = date.getDay()
  let dayString
  if (dayNumber === 0) {
    dayString = 'So'
  } else if (dayNumber === 1) {
    dayString = 'Mo'
  } else if (dayNumber === 2) {
    dayString = 'Di'
  } else if (dayNumber === 3) {
    dayString = 'Mi'
  } else if (dayNumber === 4) {
    dayString = 'Do'
  } else if (dayNumber === 5) {
    dayString = 'Fr'
  } else if (dayNumber === 6) {
    dayString = 'Sa'
  } else {
    dayString = ''
  }
  const dateString = date.toLocaleDateString()
  const timeString = date.toLocaleTimeString()
  return `${dayString} ${dateString} ${timeString}`
}

/**
 * Convert a duration string (8:01 = 8 minutes 1 seconds or 1:33:12 = 1
 * hour 33 minutes 12 seconds) into seconds.
 */
export function convertDurationToSeconds (duration: string | number): number {
  if (typeof duration === 'number') {
    return duration
  }
  if (typeof duration === 'string' && duration.match(/:/) != null) {
    const segments = duration.split(':')
    if (segments.length === 3) {
      return (
        parseInt(segments[0]) * 3600 +
        parseInt(segments[1]) * 60 +
        parseInt(segments[2])
      )
    } else if (segments.length === 2) {
      return parseInt(segments[0]) * 60 + parseInt(segments[1])
    }
  }
  return Number.parseFloat(duration)
}

/**
 * Format a date specification string into a local date string, for
 * example `28. August 1749`
 *
 * @param dateSpec - A valid input for the `Date()` class. If the input
 *   is invalid the raw `dateSpec` is returned.
 */
export function formatToLocalDate (dateSpec: string): string {
  const date = new Date(dateSpec)
  // Invalid date
  if (isNaN(date.getDay())) return dateSpec
  const months = [
    'Januar',
    'Februar',
    'März',
    'April',
    'Mai',
    'Juni',
    'Juli',
    'August',
    'September',
    'Oktober',
    'November',
    'Dezember'
  ]
  // Not getDay()
  return `${date.getDate()}. ${months[date.getMonth()]} ${date.getFullYear()}`
}

/**
 * Extract the 4 digit year from a date string
 *
 * @param dateSpec - For example `1968-01-01`
 *
 * @returns for example `1968`
 */
export function formatToYear (dateSpec: string): string {
  return dateSpec.substr(0, 4)
}
