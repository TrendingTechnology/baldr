/**
 * @file Master slide “markdown”
 * @module baldr-master-markdown
 */

'use strict';

const {MasterOfMasters} = require('baldr-masters');
const markdown = require('marked');

/**
 * Master class for the master slide “markdown”
 */
class MasterMarkdown extends MasterOfMasters {

  constructor(propObj) {
    super(propObj);
  }


  /**
   *
   */
  hookSetHTMLSlide() {
    return markdown(this.data);
  }

}

exports.MasterMarkdown = MasterMarkdown;
