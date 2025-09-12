import type { Database, Changes } from "bun:sqlite";
import { createTag } from "../create-tag/create-tag.ts";

export function updateArticle(
  article: {
    id: number;
    title?: string;
    url?: string;
    tags?: string[];
    status?: string;
    author?: string;
    image?: string;
    publication_date?: string;
    read_time?: string;
    description?: string;
    favorite?: boolean;
  },
  db: Database,
): Changes {
  const {
    id,
    title,
    url,
    tags,
    status,
    author,
    image,
    publication_date,
    read_time,
    description,
    favorite,
  } = article;

  let stmt = db.query(`
    UPDATE articles
    SET title = coalesce(?, title),
        url = coalesce(?, url),
        status = coalesce(?, status),
        author = coalesce(?, author),
        image = coalesce(?, image),
        publication_date = coalesce(?, publication_date),
        read_time = coalesce(?, read_time),
        description = coalesce(?, description),
        favorite = coalesce(?, favorite)
    WHERE id = ?
  `);
  if (tags) {
    db.query(`delete from articles_tags where article_id = ?`).run(id);
    tags.map((tag) => {
      const id_tag = createTag(tag, db);
      db.query(
        `insert into articles_tags (tag_id, article_id) values (?, ?)`,
      ).run(id_tag, id);
    });
  }

  return stmt.run(
    title || null,
    url || null,
    status || null,
    author || null,
    image || null,
    publication_date || null,
    read_time || null,
    description || null,
    favorite || null,
    id,
  );
}
