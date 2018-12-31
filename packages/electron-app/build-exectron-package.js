#! /usr/bin/env node

const packager = require('electron-packager')
packager({dir: '.', out: 'dist', prune: false, overwrite: true, arch: 'x64', icon: './icon.icns', app_version: '0.0.11'}).then(appPath => { console.log(appPath) })
