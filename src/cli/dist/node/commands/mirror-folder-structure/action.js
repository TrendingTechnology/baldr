// Project packages:
const { mirrorFolderStructure } = require('@bldr/media-server');
const config = require('@bldr/config');
function action() {
    console.log(mirrorFolderStructure(cwd));
}
module.exports = action;
