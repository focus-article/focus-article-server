import type { Database } from "bun:sqlite";

export function getArticle(id: string, db: Database) {
  return db.query(`SELECT * FROM articles WHERE id = ?`).get(id);
}
