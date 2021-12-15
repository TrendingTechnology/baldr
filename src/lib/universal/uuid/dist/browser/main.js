import { v4 as uuidv4 } from 'uuid';
/**
 * Generate a UUID (Universally Unique Identifier) in version 4. A version 4
 * UUID is randomly generated. This is a small wrapper around `uuid.v4()`
 *
 * @returns An UUID version 4
 */
export function generateUuid() {
    return uuidv4();
}
