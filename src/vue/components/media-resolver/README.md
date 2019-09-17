[![npm](https://img.shields.io/npm/v/baldr.svg)](https://www.npmjs.com/package/baldr)
[![Build Status](https://travis-ci.org/Josef-Friedrich/baldr.svg?branch=master)](https://travis-ci.org/Josef-Friedrich/baldr)
[![GitHub repo size](https://img.shields.io/github/repo-size/Josef-Friedrich/baldr.svg)](https://github.com/Josef-Friedrich/baldr)

# @bldr/vue-media-resolver

Resolve media files. Counter part of the BALDR media server.

```js
import mediaResolver from '@bldr/vue-media-resolver'

Vue.use(mediaResolver, router, store)
```

On every Vue instance:

```js
this.$mediaResolver.resolve('id:Haydn_Joseph')

const mediaFile = this.$store.getters['media/mediaFileByUri']('id:Haydn_Joseph')
```