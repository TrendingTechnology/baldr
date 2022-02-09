import { operations } from '@bldr/media-manager'

export default function action (filePath: string): void {
  operations.convertAudacitySamples(filePath)
}
