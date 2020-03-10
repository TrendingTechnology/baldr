// Node packages.
const fs = require('fs')

// Third party packages.
const yaml = require('js-yaml')

// Project packages.
const mediaServer = require('@bldr/api-media-server')
const lib = require('../lib.js')

// Globals.
const { cwd } = require('../main.js')

/**
 * @param {String} filePath - The media asset file path.
 */
function normalizeOneFile (filePath) {
  const yamlFile = `${filePath}.yml`
  const metaData = yaml.safeLoad(lib.readFile(yamlFile))
  lib.writeYamlFile(yamlFile, lib.normalizeMetaData(filePath, metaData))

  //const person = new Person(metaData)
  //console.log(person.export())
  //console.log(person.title)
  //console.log(person.birth)
}

class MetaDataType {
  constructor (metaData, specification) {
    this.data_ = metaData
    this.specs_ = specification

    return new Proxy(this, {
      get: function(obj, prop) {
        if (obj.specs_[prop] && obj.specs_[prop].derived && typeof obj.specs_[prop].derived === 'function') {
          return obj.specs_[prop].derived.call(obj.data_)
        }
        if (prop in obj.data_) return obj.data_[prop]
        return obj[prop]
      },
    })
  }

  export () {
    return this.data_
  }
}

class Person extends MetaDataType {
  constructor (metaData) {
    super(
      metaData,
      {
        id: {
          derived: function () {
            return `${this.lastname}_${this.firstname}`
          }
        },
        title: {
          derived: function () {
            return `Portrait-Bild von „${this.firstname} ${this.lastname}“`
          }
        },
        firstname: {
          required: true
        },
        lastname: {
          required: true
        },
        name: {
          derived: function () {
            return `${this.firstname} ${this.lastname}`
          }
        },
        short_biography: {},
        birth: {
          validate: function (value) {
            return value.match(/\d{4,}-\d{2,}-\d{2,}/)
          }
        }
      }
    )
  }
}

/**
 * @param {String} filePath - The media asset file path.
 */
function action (filePath) {
  if (filePath) {
    normalizeOneFile(filePath)
  } else {
    mediaServer.walk(cwd, {
      asset (relPath) {
        if (fs.existsSync(`${relPath}.yml`)) {
          normalizeOneFile(relPath)
        }
      }
    })
  }
}

module.exports = {
  command: 'normalize [media-asset]',
  alias: 'n',
  description: 'Normalize the meta data files in the YAML format (sort, clean up).',
  action
}
