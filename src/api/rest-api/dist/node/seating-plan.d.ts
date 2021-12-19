/**
 * A REST API to save states of the seating plan app.
 * @module @bldr/api-seating-plan
 */
import { Express } from 'express';
import { Database } from '@bldr/mongodb-connector';
export declare function registerSeatingPlan(database: Database): Express;
