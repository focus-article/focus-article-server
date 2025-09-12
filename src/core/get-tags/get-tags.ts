import type { Database } from "bun:sqlite";

interface Tags {
  name: string;
}

export function getTags(db: Database): string[] {
  const stmt = db.query(`
              select distinct name from tags
              -- only list tags that're being used by articles
              join articles_tags at on tags.id = at.tag_id
        `);
  return (stmt.all() as Tags[]).map((row) => row.name);
}
