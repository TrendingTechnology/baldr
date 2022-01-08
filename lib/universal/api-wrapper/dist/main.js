import { getConfig } from '@bldr/config';
import { makeHttpRequestInstance } from '@bldr/http-request';
import { MediaUri } from '@bldr/client-media-models';
const config = getConfig();
const httpRequest = makeHttpRequestInstance(config, 'local', '/api');
async function callWithErrorMessage(requestConfig, errorMessage) {
    const result = await httpRequest.request(requestConfig);
    if (result.status !== 200) {
        throw new Error(errorMessage);
    }
    return result.data;
}
export async function updateMediaServer() {
    return await callWithErrorMessage({ url: 'media', method: 'PUT' }, 'Updating the media server failed.');
}
export async function getMediaStatistics() {
    return await callWithErrorMessage({ url: 'media', method: 'GET' }, 'Fetching of statistical informations (stats/count) failed.');
}
export async function getPresentationByScheme(scheme, authority) {
    return await callWithErrorMessage(`media/presentations/by-${scheme}/${authority}`, `The presentation with the scheme “${scheme}” and the authority “${authority}” couldn’t be resolved.`);
}
export async function getPresentationByUri(uri) {
    const mediaUri = new MediaUri(uri);
    return await getPresentationByScheme(mediaUri.scheme, mediaUri.authority);
}
export async function getPresentationByRef(ref) {
    return await getPresentationByScheme('ref', ref);
}
export async function getDynamicSelectPresentations(substring) {
    return await callWithErrorMessage({
        url: 'media/get/presentations/by-substring',
        method: 'GET',
        params: {
            search: substring
        }
    }, `Dynamic select results with the substring “${substring}” couldn’t be resolved.`);
}
export async function readMediaAsString(relPath) {
    return await callWithErrorMessage({
        url: `/media/${relPath}`,
        method: 'GET',
        headers: { 'Cache-Control': 'no-cache' }
    }, `The media file with the path “${relPath}” couldn’t be read from the file system over HTTP.`);
}
export async function getAssetByUri(uri, throwException = true) {
    const mediaUri = new MediaUri(uri);
    const response = await httpRequest.request(`media/assets/by-${mediaUri.scheme}/${mediaUri.authority}`);
    if (response == null || response.status !== 200 || response.data == null) {
        if (throwException) {
            throw new Error(`The media with the ${mediaUri.scheme} ”${mediaUri.authority}” couldn’t be resolved.`);
        }
    }
    else {
        return response.data;
    }
}
export async function getTitleTree() {
    return await callWithErrorMessage({
        url: 'media/titles',
        method: 'GET',
        headers: { 'Cache-Control': 'no-cache' },
        params: {
            timestamp: new Date().getTime()
        }
    }, 'The title tree couldn’t be resolved.');
}
export async function openEditor(params) {
    return await callWithErrorMessage({ url: 'media/open/editor', params }, `Could not open the media file with the reference “${params.ref}” in the editor.`);
}
export async function openFileManager(params) {
    return await callWithErrorMessage({ url: 'media/open/file-manager', params }, `Could not open the media file with the reference “${params.ref}” in the file manager.`);
}
