import type { Database } from "bun:sqlite";

export function createTag(_tag: string, db: Database) {
  let tag_id;
  const tag_result = db
    .query<
      { id: number },
      string
    >(`SELECT id from tags where name = ? COLLATE NOCASE;`)
    .get(_tag);
  if (!tag_result?.id) {
    tag_id = db
      .query(`insert into tags (name) values (?)`)
      .run(_tag).lastInsertRowid;
  } else {
    tag_id = tag_result.id;
  }
  return tag_id;
}
