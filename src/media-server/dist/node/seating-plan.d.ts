/**
 * A REST API to save states of the seating plan app.
 * @module @bldr/api-seating-plan
 */
import { Express } from 'express';
import { Database } from './database';
export declare function registerRestApi(database: Database): Express;
