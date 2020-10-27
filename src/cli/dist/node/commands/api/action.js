const runRestApi = require('@bldr/media-server').runRestApi;
function action(port) {
    runRestApi(port);
}
module.exports = action;
