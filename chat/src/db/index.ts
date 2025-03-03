import type { DatabaseAdapter } from "./types";
import { SQLiteAdapter } from "./sqlite";

export async function createAdapter(): Promise<DatabaseAdapter> {
  let adapter: DatabaseAdapter = new SQLiteAdapter();

  await adapter.initialize();
  return adapter;
}

export type { DatabaseAdapter };
export { SQLiteAdapter };
