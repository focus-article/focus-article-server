import type { Database } from "bun:sqlite";

export default (db: Database) => {
  db.run(`
      CREATE TABLE IF NOT EXISTS articles (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        url TEXT NOT NULL,
        time_added INTEGER,
        tags TEXT,
        status TEXT,
        author TEXT,
        image TEXT,
        publication_date DATETIME,
        read_time INTEGER,
        description TEXT,
        favorite INTEGER
      )
`);
};
