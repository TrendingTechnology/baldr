// Node packages.
const fs = require('fs')

// Third party packages.
const yaml = require('js-yaml')

// Project packages.
const mediaServer = require('@bldr/api-media-server')
const { RawDataObject } = require('@bldr/core-browser')

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

  // const person = new Person(metaData)
  // console.log(person.export())
  // console.log(person.title)
  // console.log(person.birth)
}

/**
 *
 */
class MetaDataType {
  constructor (metaData, specification) {
    /**
     * @type {Object}
     * @private
     */
    this.data_ = metaData
    /**
     * @type {Object}
     * @private
     */
    this.specs_ = specification

    return new Proxy(this, {
      get: function(obj, prop) {
        if (MetaDataType.isPropertyDerived_(obj.specs_, prop)) {
          return obj.specs_[prop].derived.call(obj.data_)
        }
        if (prop in obj.data_) return obj.data_[prop]
        return obj[prop]
      },
    })
  }

  /**
   * @param {Object} specs
   * @param {String} prop
   *
   * @private
   */
  static isPropertyDerived_ (specs, prop) {
    if (
      specs[prop] &&
      specs[prop].derived &&
      typeof specs[prop].derived === 'function'
    ) return true
    return false
  }

  /**
   *
   * @param {String} prop
   */
  isPropertyDerived (prop) {
    return MetaDataType.isPropertyDerived_(this.specs_, prop)
  }

  /**
   * @returns {Object}
   */
  export () {
    const output = {}
    const rawData = new RawDataObject(this.data_)
    for (const prop in this.specs_) {
      if (this.isPropertyDerived(prop)) {
        output[prop] = this[prop]
        // Throw away the value of this property. We prefer the derived
        // version.
        rawData.cut(prop)
      } else {
        output[prop] = rawData.cut(prop)
      }
    }

    // Add additional properties not in the specs.
    for (const prop in rawData.raw) {
      output[prop] = rawData.cut(prop)
    }
    return output
  }
}

/**
 *
 */
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
        short_biography: {
          required
        },
        birth: {
          validate: function (value) {
            return value.match(/\d{4,}-\d{2,}-\d{2,}/)
          }
        },
        death: {
          validate: function (value) {
            return value.match(/\d{4,}-\d{2,}-\d{2,}/)
          }
        }
      }
    )
  }
}

/**
 * @param {Array} files - An array of input files, comes from the commanders’
 *   variadic parameter `[files...]`.
 */
function action (files) {
  mediaServer.walk({
    asset (relPath) {
      if (fs.existsSync(`${relPath}.yml`)) {
        normalizeOneFile(relPath)
      }
    }
  }, {
    path: files
  })
}

module.exports = action
