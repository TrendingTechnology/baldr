"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.toLocaleDateTimeString = toLocaleDateTimeString;
exports.plainText = plainText;
exports.shortenText = shortenText;
exports.camelToSnake = camelToSnake;
exports.convertPropertiesToCamelCase = convertPropertiesToCamelCase;
exports.formatMultiPartAssetFileName = formatMultiPartAssetFileName;
exports.formatWikidataUrl = formatWikidataUrl;
exports.formatWikipediaUrl = formatWikipediaUrl;
exports.formatYoutubeUrl = formatYoutubeUrl;
exports.AssetTypes = void 0;

function toLocaleDateTimeString(timeStampMsec) {
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

function plainText(html) {
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

function convertPropertiesToCamelCase(object) {
  if (Array.isArray(object)) {
    for (const item of object) {
      if (typeof object === 'object') {
        convertPropertiesToCamelCase(item);
      }
    }
  } else if (typeof object === 'object') {
    for (const snakeCase in object) {
      const camelCase = snakeToCamel(snakeCase);

      if (camelCase !== snakeCase) {
        const value = object[snakeCase];
        object[camelCase] = value;
        delete object[snakeCase];
      }

      if (typeof object[camelCase] === 'object') {
        convertPropertiesToCamelCase(object[camelCase]);
      }
    }
  }

  return object;
}

function formatMultiPartAssetFileName(firstFileName, no) {
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
  id = parseInt(id.replace(/^Q/, ''));
  return `https://www.wikidata.org/wiki/Q${id}`;
}

function formatWikipediaUrl(nameSpace) {
  const segments = nameSpace.split(':');
  const lang = segments[0];
  const slug = encodeURIComponent(segments[1]);
  return `https://${lang}.wikipedia.org/wiki/${slug}`;
}

function formatYoutubeUrl(id) {
  return `https://youtu.be/${id}`;
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
