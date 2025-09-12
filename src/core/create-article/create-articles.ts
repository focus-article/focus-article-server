import type { Database } from "bun:sqlite";
import { createTag } from "../create-tag/create-tag.ts";

export function createArticle(
  article: {
    title: string;
    url: string;
    tags?: string[];
    status?: string;
    author?: string;
    image?: string;
    publicationDate?: string;
    readTime?: string;
    description?: string;
    favorite?: boolean;
  },
  db: Database,
) {
  const stmt = db.query(`
    INSERT INTO articles (
      title,
      url,
      status,
      author,
      image,
      publication_date,
      read_time,
      description,
      favorite
    ) values (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);
  const result = stmt.run(
    article.title,
    article.url,
    article.status ?? "unread",
    article.author ?? null,
    article.image ?? null,
    article.publicationDate ?? null,
    article.readTime ?? null,
    article.description ?? null,
    article.favorite ?? null,
  );
  const article_id = result.lastInsertRowid;

  article.tags?.forEach((_tag) => {
    if (_tag) {
      const tag_id = createTag(_tag, db);
      db.query(
        `insert into articles_tags (tag_id, article_id) values (?, ?)`,
      ).run(tag_id as number, article_id);
    }
  });

  return result;
}
