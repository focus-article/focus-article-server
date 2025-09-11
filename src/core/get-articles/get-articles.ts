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
  const stmt = db.query(`
            SELECT * FROM articles
                     where (? is null or tags like ?)
                     and (? is null or status = ?)
                     and (? is null or favorite = ?)
                     ORDER BY id ${order}, read_time ${orderReadTime}
                     LIMIT ? OFFSET ?
        `);
  return stmt.all(
    tag,
    `%${tag}%`,
    status,
    status,
    favorite,
    favorite,
    limit,
    offset,
  );
}
