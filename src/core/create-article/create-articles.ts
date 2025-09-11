import type { Database } from "bun:sqlite";

export function createArticle(
  article: {
    title: string;
    url: string;
    tags?: string;
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
                                  tags,
                                  status,
                                  author,
                                  image,
                                  publication_date,
                                  read_time,
                                  description,
                                  favorite
            ) values (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `);
  return stmt.run(
    article.title,
    article.url,
    article.tags ?? null,
    article.status ?? "unread",
    article.author ?? null,
    article.image ?? null,
    article.publicationDate ?? null,
    article.readTime ?? null,
    article.description ?? null,
    article.favorite ?? null,
  );
}
