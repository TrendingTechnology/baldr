export function toLocaleDateTimeString (timeStampMsec) {
  const date = new Date(Number(timeStampMsec))
  const dateString = date.toLocaleDateString()
  const timeString = date.toLocaleTimeString()
  return `${dateString} ${timeString}`
}
