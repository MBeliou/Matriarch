import type { DatabaseAdapter } from "./types";
import { SQLiteAdapter } from "./sqlite";
export declare function createAdapter(): Promise<DatabaseAdapter>;
export type { DatabaseAdapter };
export { SQLiteAdapter };
