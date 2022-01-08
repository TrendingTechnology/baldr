import { AssetBuilder } from './asset-builder';
import { PresentationBuilder } from './presentation-builder';
export function buildDbAssetData(filePath) {
    const builder = new AssetBuilder(filePath);
    return builder.buildForDb();
}
export function buildMinimalAssetData(filePath) {
    const builder = new AssetBuilder(filePath);
    return builder.buildMinimal();
}
export function buildPresentationData(filePath) {
    const builder = new PresentationBuilder(filePath);
    return builder.build();
}
