export function embedSvgInline(url, id) {
    return new Promise((resolve, reject) => {
        const request = new XMLHttpRequest();
        request.open('GET', url, false);
        // Following line is just to be on the safe side;
        // not needed if your server delivers SVG with correct MIME type
        request.overrideMimeType('image/svg+xml');
        request.onload = function (e) {
            var _a;
            if (request.readyState !== 4) {
                reject(`Not ready ${url}`);
            }
            if (request.status !== 200) {
                reject(`Failed to load ${url}`);
            }
            if (request.responseXML != null) {
                (_a = document
                    .getElementById(id)) === null || _a === void 0 ? void 0 : _a.appendChild(request.responseXML.documentElement);
                resolve();
            }
        };
        request.send('');
    });
}
