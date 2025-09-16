import type { Database } from "bun:sqlite";

export function getArticles(
  params: {
    tags: string[] | null;
    status: string | null;
    favorite: boolean | null;
    limit: number;
    page: number;
    order: string;
    orderReadTime: string;
  },
  db: Database,
) {
  const {
    page = 1,
    limit = -1,
    tags,
    status,
    favorite,
    order = "DESC",
    orderReadTime = "DESC",
  } = params;

  function placeholders(arr: any[]) {
    return arr.map(() => "?").join(", ");
  }

  const offset = (page - 1) * limit;
  const tagPlaceholders = tags?.length ? placeholders(tags) : "";

  const query = `
        SELECT a.*
        FROM articles AS a
                 LEFT JOIN articles_tags at ON a.id = at.article_id
                 LEFT JOIN tags t ON t.id = at.tag_id
        WHERE (? IS NULL OR status = ?)
          AND (? IS NULL OR t.name IN (${tagPlaceholders}))
          AND (? IS NULL OR favorite = ?)
        GROUP BY a.id
            ${
              tags?.length
                ? `HAVING COUNT(DISTINCT t.name) = ${tags.length}`
                : ""
            }
        ORDER BY id ${order}, read_time ${orderReadTime}
        LIMIT ? OFFSET ?
    `;

  const stmt = db.query(query);

  const resultado = stmt.all(
    status,
    status,
    tags?.length ? 1 : null, // ativa o filtro se houver tags
    ...(tags ?? []), // espalha os valores do array de tags
    favorite,
    favorite,
    limit,
    offset,
  );

  return resultado?.map((a: any) => {
    const query = `
            SELECT t.name
            FROM articles_tags at
                     JOIN tags t ON at.tag_id = t.id
            WHERE at.article_id = ?
        `;
    const tags = db
      .query(query)
      .all(a.id)
      .map((a: any) => a.name);

    return {
      ...a,
      tags,
    };
  });
}
