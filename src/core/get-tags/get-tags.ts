import type { Database } from "bun:sqlite";

export function getTags(db: Database) {
  const stmt = db.query(`
              select tags from articles
              where tags IS NOT NULL
                and tags <> ''
              group by tags;
        `);
  return stmt.all();
}
