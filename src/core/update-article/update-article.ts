import type { Database, Changes } from "bun:sqlite";

export function updateArticle(
  article: {
    id: number;
    title: string;
    url: string;
    tags: string;
    status: string;
    author: string;
    image: string;
    publication_date: string;
    read_time: string;
    description: string;
    favorite: boolean;
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
            tags = coalesce(?, tags),
            status = coalesce(?, status),
            author = coalesce(?, author),
            image = coalesce(?, image),
            publication_date = coalesce(?, publication_date),
            read_time = coalesce(?, read_time),
            description = coalesce(?, description),
            favorite = coalesce(?, favorite)
        WHERE id = ?
      `);
  return stmt.run(
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
    id,
  );
}
