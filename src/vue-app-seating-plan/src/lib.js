export function formatToLocalDateTime (timeStampMsec) {
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
  }
  const dateString = date.toLocaleDateString()
  const timeString = date.toLocaleTimeString()
  return `${dayString} ${dateString} ${timeString}`
}
