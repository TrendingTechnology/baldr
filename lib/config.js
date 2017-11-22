/**
 * @file Manage the configuration for a presentation session.
 * @module lib/config
 */

const yaml = require('js-yaml');
const path = require('path');
const fs = require('fs');

/**
 * Manage the configuration for a presentation session.
 */
class Config {

  /**
   * @param {string} sessionFile The path of the *.baldr presentation file
   * structured in the YAML format.
   */
  constructor(sessionFile) {

    /**
     * The path of the *.baldr presentation file
     * structured in the YAML format.
     * @type {string}
     */
    this.sessionFile = sessionFile;

    /**
     * The session files’ parent working directory. Assuming you are
     * loading a file with the path “/home/jf/example.baldr”, your
     * session directory is than “/home/jf”.
     * @type {string}
     */
    this.sessionDir = path.resolve(path.dirname(this.sessionFile));

    /**
     * Raw object representation of the main *.baldr session file
     * structured in YAML
     * @type {object}
     */
    this.raw = this.parseYamlFile(this.sessionFile);

    for (let config in this.raw) {
      this[config] = this.raw[config];
    }
  }

  /**
   * Load the contents of a *.baldr YAML file and convert its content
   * into a object.
   *
   * @param {string} sessionFile The path of the *.baldr presentation file
   * structured in the YAML format.
   * @return {object} Raw object representation of the presentation
   * session.
   */
  parseYamlFile(sessionFile) {
    return yaml.safeLoad(fs.readFileSync(sessionFile, 'utf8'));
  }

}

exports.Config = Config;
