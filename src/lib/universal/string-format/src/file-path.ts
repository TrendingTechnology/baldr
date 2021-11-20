/**
 * Generate the n-th file name or the URL from a file name or a URL of the first
 * element of a multipart asset. The parameter `firstFileName` must have a
 * extension (for example `.jpg`). The parameter `no` must be less then 1000.
 * Only tree digit or smaller integers are allowed.
 *
 * 1. `multipart-asset.jpg`
 * 2. `multipart-asset_no002.jpg`
 * 3. `multipart-asset_no003.jpg`
 * 4. ...
 *
 * @param firstFileName - A file name, a path or a URL.
 * @param no - The number in the multipart asset list. The first element has the
 *   number 1.
 */
export function formatMultiPartAssetFileName (
  firstFileName: string,
  no: string | number
): string {
  if (!Number.isInteger(no)) {
    no = 1
  }

  if (no > 999) {
    throw new Error(
      `${firstFileName}: The multipart asset number must not be greater than 999.`
    )
  }

  let suffix
  if (no === 1) {
    return firstFileName
  } else if (no < 10) {
    suffix = `_no00${no}`
  } else if (no < 100) {
    suffix = `_no0${no}`
  } else {
    suffix = `_no${no}`
  }
  return firstFileName.replace(/(\.\w+$)/, `${suffix}$1`)
}
