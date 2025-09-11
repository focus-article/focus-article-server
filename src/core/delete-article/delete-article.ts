import type { Database } from "bun:sqlite";

export function deleteArticle(id: string, db: Database) {
  return db.query(`DELETE FROM articles WHERE id = ?`).run(id);
}
