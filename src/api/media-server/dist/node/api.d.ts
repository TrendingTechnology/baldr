import express from 'express';
import { StringIndexedObject } from '@bldr/type-definitions';
import { Database } from '@bldr/mongodb-connector';
export declare let database: Database;
/**
 * This object hold jsons for displaying help messages in the browser on
 * some entry point urls.
 *
 * Update docs on the top of this file in the JSDoc block.
 */
export declare const helpMessages: StringIndexedObject;
export declare function extractString(query: any, propertyName: string, defaultValue?: string | null): string;
/**
 * Run the REST API. Listen to a TCP port.
 *
 * @param port - A TCP port.
 */
export declare function startRestApi(port?: number): Promise<express.Express>;
