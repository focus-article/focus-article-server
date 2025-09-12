import type { Database } from "bun:sqlite";

export function getArticle(id: number, db: Database) {
  const query_tags = `
        select t.name from articles_tags at
            join tags t on t.id = at.tag_id
            where article_id = ?
  `;
  const tags = db
    .query(query_tags)
    .all(id)
    .map((tag: any) => tag.name);

  const article = db.query(`SELECT * FROM articles WHERE id = ?`).get(id);
  return {
    ...(article as any),
    tags,
  };
}
