"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.selectSubset = selectSubset;
exports.sortObjectsByProperty = sortObjectsByProperty;
exports.formatToLocalDate = formatToLocalDate;
exports.formatToYear = formatToYear;
exports.formatToLocalDateTime = formatToLocalDateTime;
exports.toTitleCase = toTitleCase;
exports.plainText = plainText;
exports.shortenText = shortenText;
exports.camelToSnake = camelToSnake;
exports.snakeToCamel = snakeToCamel;
exports.convertPropertiesCase = convertPropertiesCase;
exports.formatMultiPartAssetFileName = formatMultiPartAssetFileName;
exports.formatWikidataUrl = formatWikidataUrl;
exports.formatWikipediaUrl = formatWikipediaUrl;
exports.formatMusicbrainzRecordingUrl = formatMusicbrainzRecordingUrl;
exports.formatMusicbrainzWorkUrl = formatMusicbrainzWorkUrl;
exports.formatYoutubeUrl = formatYoutubeUrl;
exports.formatImslpUrl = formatImslpUrl;
exports.formatWikicommonsUrl = formatWikicommonsUrl;
exports.escapeHtml = escapeHtml;
exports.deepCopy = deepCopy;
exports.getExtension = getExtension;
exports.default = exports.mediaUriRegExp = exports.RawDataObject = exports.jsYamlConfig = exports.AssetTypes = exports.convertMdToTex = exports.convertTexToMd = exports.tex = void 0;

var _convertTex = _interopRequireDefault(require("./convert-tex.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const tex = _convertTex.default;
exports.tex = tex;
const convertTexToMd = _convertTex.default.convertTexToMd;
exports.convertTexToMd = convertTexToMd;
const convertMdToTex = _convertTex.default.convertMdToTex;
exports.convertMdToTex = convertMdToTex;

function selectSubset(subsetSelector, {
  sort,
  elements,
  elementsCount,
  firstElementNo,
  shiftSelector
}) {
  const subset = [];
  if (!shiftSelector) shiftSelector = 0;

  function addElement(element) {
    if (!element) return;

    if (!subset.includes(element)) {
      subset.push(element);
    }
  }

  if (!elements && elementsCount) {
    elements = [];
    let firstNo;

    if (firstElementNo) {
      firstNo = firstElementNo;
    } else {
      firstNo = 0;
    }

    const endNo = firstNo + elementsCount;

    for (let i = firstNo; i < endNo; i++) {
      elements.push(i);
    }
  }

  if (!subsetSelector) return elements;
  subsetSelector = subsetSelector.replace(/\s*/g, '');
  const ranges = subsetSelector.split(',');
  const shiftSelectorAdjust = -1 * shiftSelector;

  for (let range of ranges) {
    if (range.match(/^-/)) {
      const end = parseInt(range.replace('-', ''));
      range = `${1 + shiftSelectorAdjust}-${end}`;
    }

    if (range.match(/-$/)) {
      const begin = parseInt(range.replace('-', ''));
      range = `${begin}-${elements.length + shiftSelectorAdjust}`;
    }

    range = range.split('-');

    if (range.length === 1) {
      const i = range[0];
      addElement(elements[i - 1 + shiftSelector]);
    } else if (range.length === 2) {
      const beginNo = parseInt(range[0]) + shiftSelector;
      const endNo = parseInt(range[1]) + shiftSelector;

      if (endNo <= beginNo) {
        throw new Error(`Invalid range: ${beginNo}-${endNo}`);
      }

      for (let no = beginNo; no <= endNo; no++) {
        const index = no - 1;
        addElement(elements[index]);
      }
    }
  }

  if (sort === 'numeric') {
    subset.sort((a, b) => a - b);
  } else if (sort) {
    subset.sort();
  }

  return subset;
}

function sortObjectsByProperty(property) {
  return function (a, b) {
    return a[property].localeCompare(b[property]);
  };
}

function formatToLocalDate(dateSpec) {
  const date = new Date(dateSpec);
  if (isNaN(date.getDay())) return dateSpec;
  const months = ['Januar', 'Februar', 'März', 'April', 'Mai', 'Juni', 'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember'];
  return `${date.getDate()}. ${months[date.getMonth()]} ${date.getFullYear()}`;
}

function formatToYear(dateSpec) {
  return dateSpec.substr(0, 4);
}

function formatToLocalDateTime(timeStampMsec) {
  const date = new Date(Number(timeStampMsec));
  const dayNumber = date.getDay();
  let dayString;

  if (dayNumber === 0) {
    dayString = 'So';
  } else if (dayNumber === 1) {
    dayString = 'Mo';
  } else if (dayNumber === 2) {
    dayString = 'Di';
  } else if (dayNumber === 3) {
    dayString = 'Mi';
  } else if (dayNumber === 4) {
    dayString = 'Do';
  } else if (dayNumber === 5) {
    dayString = 'Fr';
  } else if (dayNumber === 6) {
    dayString = 'Sa';
  }

  const dateString = date.toLocaleDateString();
  const timeString = date.toLocaleTimeString();
  return `${dayString} ${dateString} ${timeString}`;
}

function toTitleCase(text) {
  return text.charAt(0).toUpperCase() + text.slice(1);
}

function plainText(html) {
  if (!html) return '';
  html = html.replace(/></g, '> <');
  const markup = new DOMParser().parseFromString(html, 'text/html');
  return markup.body.textContent || '';
}

function shortenText(text, options = {}) {
  if (!text) return '';
  let {
    maxLength,
    stripTags
  } = options;
  if (!maxLength) maxLength = 80;
  if (stripTags) text = plainText(text);
  if (text.length < maxLength) return text;
  text = text.substr(0, maxLength);
  text = text.substr(0, Math.min(text.length, text.lastIndexOf(' ')));
  return `${text} …`;
}

function camelToSnake(str) {
  return str.replace(/[\w]([A-Z])/g, function (m) {
    return m[0] + '_' + m[1];
  }).toLowerCase();
}

function snakeToCamel(str) {
  return str.replace(/([-_][a-z])/g, group => group.toUpperCase().replace('-', '').replace('_', ''));
}

function convertPropertiesCase(data, direction = 'snake-to-camel') {
  let newObject;

  if (!['snake-to-camel', 'camel-to-snake'].includes(direction)) {
    throw new Error(`convertPropertiesCase: argument direction must be “snake-to-camel” or “camel-to-snake”, got ${direction}`);
  }

  if (Array.isArray(data)) {
    for (let i = 0; i < data.length; i++) {
      const item = data[i];

      if (typeof item === 'object') {
        data[i] = convertPropertiesCase(item, direction);
      }
    }
  } else if (typeof data === 'object') {
    newObject = {};

    for (const oldProp in data) {
      let newProp;

      if (direction === 'camel-to-snake') {
        newProp = camelToSnake(oldProp);
      } else if (direction === 'snake-to-camel') {
        newProp = snakeToCamel(oldProp);
      }

      newObject[newProp] = data[oldProp];

      if (typeof newObject[newProp] === 'object') {
        newObject[newProp] = convertPropertiesCase(newObject[newProp], direction);
      }
    }
  }

  if (newObject) return newObject;
  return data;
}

function formatMultiPartAssetFileName(firstFileName, no) {
  if (!Number.isInteger(no)) {
    no = 1;
  }

  let suffix;

  if (no === 1) {
    return firstFileName;
  } else if (no < 10) {
    suffix = `_no0${no}`;
  } else if (no < 100) {
    suffix = `_no${no}`;
  } else {
    throw new Error(`${firstFileName} multipart asset counts greater than 100 are not supported.`);
  }

  return firstFileName.replace(/(\.\w+$)/, `${suffix}$1`);
}

function formatWikidataUrl(id) {
  id = String(id);
  id = parseInt(id.replace(/^Q/, ''));
  return `https://www.wikidata.org/wiki/Q${id}`;
}

function formatWikipediaUrl(nameSpace) {
  const segments = nameSpace.split(':');
  const lang = segments[0];
  const slug = encodeURIComponent(segments[1]);
  return `https://${lang}.wikipedia.org/wiki/${slug}`;
}

function formatMusicbrainzRecordingUrl(recordingId) {
  return `https://musicbrainz.org/recording/${recordingId}`;
}

function formatMusicbrainzWorkUrl(workId) {
  return `https://musicbrainz.org/work/${workId}`;
}

function formatYoutubeUrl(id) {
  return `https://youtu.be/${id}`;
}

function formatImslpUrl(id) {
  return `https://imslp.org/wiki/${id}`;
}

function formatWikicommonsUrl(fileName) {
  return `https://commons.wikimedia.org/wiki/File:${fileName}`;
}

class AssetTypes {
  constructor(config) {
    this.config_ = config.mediaServer.assetTypes;
    this.allowedExtensions_ = this.spreadExtensions_();
  }

  spreadExtensions_() {
    const out = {};

    for (const type in this.config_) {
      for (const extension of this.config_[type].allowedExtensions) {
        out[extension] = type;
      }
    }

    return out;
  }

  extensionToType(extension) {
    extension = extension.toLowerCase();

    if (extension in this.allowedExtensions_) {
      return this.allowedExtensions_[extension];
    }

    throw new Error(`Unkown extension “${extension}”`);
  }

  typeToColor(type) {
    return this.config_[type].color;
  }

  typeToTargetExtension(type) {
    return this.config_[type].targetExtension;
  }

  isAsset(filename) {
    const extension = filename.split('.').pop().toLowerCase();

    if (extension in this.allowedExtensions_) {
      return true;
    }

    return false;
  }

}

exports.AssetTypes = AssetTypes;

function escapeHtml(htmlString) {
  const htmlEscapes = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#x27;',
    '/': '&#x2F;'
  };
  const htmlEscaper = /[&<>"'/]/g;
  return ('' + htmlString).replace(htmlEscaper, function (match) {
    return htmlEscapes[match];
  });
}

function deepCopy(data) {
  return JSON.parse(JSON.stringify(data));
}

const jsYamlConfig = {
  noArrayIndent: true,
  lineWidth: 72,
  noCompatMode: true
};
exports.jsYamlConfig = jsYamlConfig;

class RawDataObject {
  constructor(rawData) {
    this.raw = deepCopy(rawData);
  }

  cut(property) {
    if ({}.hasOwnProperty.call(this.raw, property)) {
      const out = this.raw[property];
      delete this.raw[property];
      return out;
    }
  }

  isEmpty() {
    if (Object.keys(this.raw).length === 0) return true;
    return false;
  }

}

exports.RawDataObject = RawDataObject;

function getExtension(filePath) {
  if (filePath) {
    return String(filePath).split('.').pop().toLowerCase();
  }
}

const mediaUriRegExp = new RegExp('((id|uuid):(([a-zA-Z0-9-_]+)(#([a-zA-Z0-9-_]+))?))');
exports.mediaUriRegExp = mediaUriRegExp;
var _default = {
  formatImslpUrl,
  formatMusicbrainzRecordingUrl,
  formatMusicbrainzWorkUrl,
  formatWikicommonsUrl,
  formatWikidataUrl,
  formatWikipediaUrl,
  formatYoutubeUrl,
  mediaUriRegExp
};
exports.default = _default;