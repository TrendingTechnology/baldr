import { operations } from '@bldr/media-manager';
export default function action(filePath) {
    operations.convertAudacitySamples(filePath);
}
