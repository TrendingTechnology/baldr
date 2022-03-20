import { openInFileManager } from '@bldr/open-with'

export default function action (filePath: string): void {
  openInFileManager(filePath)
}
