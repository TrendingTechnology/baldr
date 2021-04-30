[![npm](https://img.shields.io/npm/v/baldr.svg)](https://www.npmjs.com/package/baldr)
[![Build Status](https://travis-ci.org/Josef-Friedrich/baldr.svg?branch=master)](https://travis-ci.org/Josef-Friedrich/baldr)
[![GitHub repo size](https://img.shields.io/github/repo-size/Josef-Friedrich/baldr.svg)](https://github.com/Josef-Friedrich/baldr)

# @bldr/media-client

Resolve media files. Counter part of the BALDR media server.

```js
import media from '@bldr/media-client'

Vue.use(media, router, store)
```

On every Vue instance:

```js
this.$media.resolve('ref:Haydn')

const asset = this.$store.getters['media/assetByUri']('ref:Haydn')
```
