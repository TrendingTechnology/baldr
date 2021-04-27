export function cmd(name: string, content: string): string {
  return `\\${name}{${content}}`
}

export function environment(name: string, content: string): string {
  return cmd('begin', name) + '\n' +
    content.trim() + '\n' +
    cmd('end', name)
}
