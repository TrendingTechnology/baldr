import path from 'path';
import { referencify } from '@bldr/string-format';
import { getConfig } from '@bldr/config';
const config = getConfig();
import { validateDate } from '../main';
function check(data) {
    if (data.lastname == null && data.firstname == null) {
        throw new Error('A person needs a first- and a lastname.');
    }
}
/**
 * The meta data type specification “person”.
 */
export const person = {
    title: 'Person',
    abbreviation: 'PR',
    basePath: path.join(config.mediaServer.basePath, 'faecheruebergreifend', 'Personen'),
    relPath: function ({ data }) {
        const personData = data;
        return path.join(personData.personId.substr(0, 1).toLowerCase(), personData.personId, `main.${personData.extension}`);
    },
    detectCategoryByPath: function (category) {
        const personCategory = category;
        return new RegExp('^' + personCategory.basePath + '/.*(jpg|png)');
    },
    normalizeWikidata: function ({ data, entity, functions }) {
        const label = functions.getLabel(entity);
        const segments = label.split(' ');
        const firstnameFromLabel = segments.shift();
        const lastnameFromLabel = segments.pop();
        // Use the label by artist names.
        // for example „Joan Baez“ and not „Joan Chandos“
        if (firstnameFromLabel != null &&
            lastnameFromLabel != null &&
            (data.firstname !== firstnameFromLabel ||
                data.lastname !== lastnameFromLabel)) {
            data.firstname = firstnameFromLabel;
            data.lastname = lastnameFromLabel;
            data.name = label;
        }
        return data;
    },
    props: {
        personId: {
            title: 'Personen-ID',
            description: 'Nachname_Vorname, zum Beispiel: Haydn_Joseph.',
            derive: function ({ data }) {
                check(data);
                return `${referencify(data.lastname)}_${referencify(data.firstname)}`;
            },
            overwriteByDerived: true
        },
        ref: {
            title: 'Referenz der Person',
            description: 'PR_Nachname_Vorname, zum Beispiel: PR_Haydn_Joseph.',
            derive: function ({ data, category }) {
                const personCategory = category;
                return `${personCategory.abbreviation}_${referencify(data.lastname)}_${referencify(data.firstname)}`;
            },
            overwriteByDerived: true
        },
        title: {
            title: 'Titel der Person',
            derive: function ({ data }) {
                const personData = data;
                return `Portrait-Bild von „${personData.firstname} ${personData.lastname}“`;
            },
            overwriteByDerived: true
        },
        firstname: {
            title: 'Vorname',
            required: true,
            wikidata: {
                // Vornamen der Person
                fromClaim: 'P735',
                secondQuery: 'queryLabels',
                format: function (value, category) {
                    if (Array.isArray(value)) {
                        return value.join(' ');
                    }
                    return value;
                }
            }
        },
        lastname: {
            title: 'Familienname',
            required: true,
            wikidata: {
                // Familienname einer Person
                fromClaim: 'P734',
                secondQuery: 'queryLabels',
                format: function (value) {
                    if (Array.isArray(value)) {
                        return value.join(' ');
                    }
                    return value;
                }
            }
        },
        name: {
            title: 'Name (Vor- und Familienname)',
            derive: function ({ data }) {
                check(data);
                const personData = data;
                return `${personData.firstname} ${personData.lastname}`;
            },
            overwriteByDerived: false
        },
        shortBiography: {
            title: 'Kurzbiographie',
            required: true,
            wikidata: {
                fromEntity: 'getDescription'
            }
        },
        birth: {
            title: 'Geburtstag',
            validate: validateDate,
            wikidata: {
                // Geburtsdatum
                fromClaim: 'P569',
                format: 'formatDate',
                alwaysUpdate: true
            }
        },
        death: {
            title: 'Todestag',
            validate: validateDate,
            wikidata: {
                // Sterbedatum
                fromClaim: 'P570',
                format: 'formatDate',
                alwaysUpdate: true
            }
        },
        mainImage: {
            title: 'Hauptbild',
            wikidata: {
                // Bild
                fromClaim: 'P18',
                format: 'formatWikicommons'
            }
        },
        famousPieces: {
            title: 'Bekannte Stücke',
            validate: function (value) {
                return Array.isArray(value);
            }
        },
        wikicommons: {
            title: 'Wikicommons',
            state: 'absent'
        }
    }
};
