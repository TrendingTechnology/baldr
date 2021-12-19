import express from 'express';
import { Database } from '@bldr/mongodb-connector';
export declare let database: Database;
/**
 * Extract a string value from the parsed query string object.
 *
 * @param query - The parsed query string (`?param1=one&param2=two`) as an object.
 * @param key - The name of the query key.
 * @param defaultValue - A default value if the `query` is empty under the
 *   property `propertyName`.
 *
 * @returns The found parameter string or a default value
 *
 * @throws If not result string can be found.
 */
export declare function extractStringFromRequestQuery(query: Record<string, any>, key: string, defaultValue?: string): string;
/**
 * Run the REST API. Listen to a TCP port.
 *
 * @param port - A TCP port.
 */
export declare function startRestApi(port?: number): Promise<express.Express>;
