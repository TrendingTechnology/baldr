import express from 'express';
import { Database } from '@bldr/mongodb-connector';
export declare let database: Database;
/**
 * Run the REST API. Listen to a TCP port.
 *
 * @param port - A TCP port.
 */
export declare function startRestApi(port?: number): Promise<express.Express>;
