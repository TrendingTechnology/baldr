export function cmd(name, content) {
    return `\\${name}{${content}}`;
}
export function environment(name, content) {
    return cmd('begin', name) + '\n' +
        content.trim() + '\n' +
        cmd('end', name);
}
