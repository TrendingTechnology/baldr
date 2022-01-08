/* globals describe it */

import { parsePresentation } from './_helper'

function aparseAndResolve (relPath) {
  const presentation = parsePresentation(relPath)
  return presentation.resolve()
}

describe('All presentations in files/commons', function () {
  it('common/absentSlides', async function () {
    await aparseAndResolve('common/absentSlides')
  })

  it('common/allMaster', async function () {
    await aparseAndResolve('common/allMasters')
  })

  it('common/audioOverlay', async function () {
    await aparseAndResolve('common/audioOverlay')
  })

  it('common/inlineMedia', async function () {
    await aparseAndResolve('common/inlineMedia')
  })

  it('common/metaData', async function () {
    await aparseAndResolve('common/metaData')
  })

  it('common/minimal', async function () {
    await aparseAndResolve('common/minimal')
  })

  it('common/multipartAssets', async function () {
    await aparseAndResolve('common/multipartAssets')
  })

  it('common/slideNavigation', async function () {
    await aparseAndResolve('common/slideNavigation')
  })

  it('common/slidesWithPlayButtons', async function () {
    await aparseAndResolve('common/slidesWithPlayButtons')
  })

  it('common/stepSubset', async function () {
    await aparseAndResolve('common/stepSubset')
  })

  it('common/style', async function () {
    await aparseAndResolve('common/style')
  })
})
