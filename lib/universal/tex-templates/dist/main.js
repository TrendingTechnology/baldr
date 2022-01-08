/**
 * https://stackoverflow.com/a/67385240
 */
function foldText(text, charCount = 72, buildArray = []) {
    if (text.length <= charCount) {
        buildArray.push(text);
        return buildArray;
    }
    let line = text.substring(0, charCount);
    const lastSpaceRgx = /\s(?!.*\s)/;
    const idx = line.search(lastSpaceRgx);
    let nextIdx = charCount;
    if (idx > 0) {
        line = line.substring(0, idx);
        nextIdx = idx;
    }
    buildArray.push(line.trim());
    return foldText(text.substring(nextIdx), charCount, buildArray);
}
function wrapText(text) {
    text = text.trim();
    return foldText(text).join('\n');
}
export function cmd(name, content) {
    return `\\${name}{${content}}`;
}
/**
 * For example `  key = { One, two, three },` or `  key = One,`
 */
export function keyValues(pairs) {
    const output = [];
    for (const key in pairs) {
        let value = pairs[key];
        if (value.includes(',')) {
            value = `{ ${value} }`;
        }
        output.push(`  ${key} = ${value},`);
    }
    return output.join('\n');
}
export function environment(name, content, pairs) {
    let pairsRendered = '';
    if (pairs != null) {
        pairsRendered = '[\n' + keyValues(pairs) + '\n]';
    }
    return (cmd('begin', name) +
        pairsRendered +
        '\n' +
        wrapText(content) +
        '\n' +
        cmd('end', name));
}
