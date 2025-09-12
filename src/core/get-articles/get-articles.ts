import type { Database } from "bun:sqlite";

export function getArticles(
  params: {
    tag: string | null;
    status: string | null;
    favorite: boolean | null;
    limit: number;
    page: number;
    order: string;
    orderReadTime: string;
  },
  db: Database,
) {
  const { page, limit, tag, status, favorite, order, orderReadTime } = params;
  const offset = (page - 1) * limit;
  const query = `
    SELECT distinct a.*
    FROM articles as a
    left join articles_tags on a.id = articles_tags.article_id
    left join tags t on t.id = articles_tags.tag_id 
    where (? is null or status = ?)
    and (? IS NULL OR t.name = ?)
    and (? is null or favorite = ?)
    ORDER BY id ${order}, read_time ${orderReadTime}
    LIMIT ? OFFSET ?
  `;
  const stmt = db.query(query);
  const resultado = stmt.all(
    status,
    status,
    tag,
    tag,
    favorite,
    favorite,
    limit,
    offset,
  );
  return resultado?.map((a: any) => {
    const query = `
        select t.name from articles_tags at
        join tags t on at.tag_id = t.id
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
