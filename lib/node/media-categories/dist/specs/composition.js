var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { validateUuid } from '../main';
import { getAudioMetadataValue } from '../audio-metadata';
/**
 * The meta data type specification “composition”.
 */
export const composition = {
    title: 'Komposition',
    detectCategoryByPath: new RegExp('^.*/HB/.*(m4a|mp3)$'),
    props: {
        title: {
            title: 'Titel der Komponistion',
            // 'Tonart CD 4: Spur 29'
            removeByRegexp: /^.*CD.*Spur.*$/i,
            derive: function ({ filePath }) {
                return __awaiter(this, void 0, void 0, function* () {
                    return getAudioMetadataValue('title', filePath);
                });
            }
        },
        composer: {
            title: 'Komponsition',
            // Helbling-Verlag
            removeByRegexp: /^.*Verlag.*$/i,
            wikidata: {
                // Komponist
                fromClaim: 'P86',
                secondQuery: 'queryLabels',
                format: 'formatList'
            },
            derive: function ({ filePath }) {
                return __awaiter(this, void 0, void 0, function* () {
                    return getAudioMetadataValue('composer', filePath);
                });
            }
        },
        lyricist: {
            title: 'LiedtexterIn',
            wikidata: {
                // Text von | Autor des Liedtexts | Texter | Autor (Liedtext) | geschrieben von
                fromClaim: 'P676',
                secondQuery: 'queryLabels',
                format: 'formatList'
            }
        },
        creationDate: {
            title: 'Entstehungs-Datum',
            wikidata: {
                // Gründung, Erstellung bzw. Entstehung (P571)
                // Veröffentlichungsdatum (P577)
                // Datum der Erst- oder Uraufführung (P1191)
                fromClaim: ['P571', 'P577', 'P1191'],
                format: 'formatYear'
            }
        },
        // now combined in creationDate
        publicationDate: {
            title: 'Veröffentlichungsdatum',
            state: 'absent'
        },
        // now combined in creationDate
        firstPerformance: {
            title: 'Uraufführung',
            state: 'absent'
        },
        imslp: {
            title: 'IMSLP-ID',
            wikidata: {
                // IMSLP-ID
                fromClaim: 'P839'
            }
        },
        musicbrainzWorkId: {
            title: 'MusikBrainz-Werk-ID',
            validate: validateUuid,
            wikidata: {
                // MusicBrainz-Werk-ID
                fromClaim: 'P435',
                format: 'formatSingleValue'
            },
            format(value) {
                return value.replace(/\0/g, '');
            },
            derive: function ({ filePath }) {
                return __awaiter(this, void 0, void 0, function* () {
                    return getAudioMetadataValue('musicbrainz_work_id', filePath);
                });
            }
        },
        lyrics: {
            title: 'Liedtext',
            description: 'Der Liedtext sollte als YAML-Block-Stil „|“ gespeichert werden. Die einzelnen Zeilen sollen mit br-Tags getrennt werden.'
        }
    }
};
